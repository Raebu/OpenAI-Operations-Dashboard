import { prisma } from '@/lib/db';

function percentile(values: number[], p: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}

export async function getDashboardMetrics(organisationId = 'org_demo') {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const events = await prisma.aiEvent.findMany({
    where: { organisationId, createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
    take: 5000
  });

  const totalRequests = events.length;
  const totalTokens = events.reduce((sum, event) => sum + event.inputTokens + event.outputTokens + event.reasoningTokens, 0);
  const totalCost = events.reduce((sum, event) => sum + Number(event.estimatedCostUsd), 0);
  const flagged = events.filter((event) => event.safetyFlagged).length;
  const risky = events.filter((event) => (event.hallucinationRisk ?? 0) >= 0.6).length;
  const errors = events.filter((event) => ['error', 'timeout', 'blocked'].includes(event.status)).length;
  const latencies = events.map((event) => event.latencyMs);

  const byModel = Object.values(events.reduce<Record<string, { model: string; requests: number; tokens: number; cost: number }>>((acc, event) => {
    acc[event.model] ??= { model: event.model, requests: 0, tokens: 0, cost: 0 };
    acc[event.model].requests += 1;
    acc[event.model].tokens += event.inputTokens + event.outputTokens + event.reasoningTokens;
    acc[event.model].cost += Number(event.estimatedCostUsd);
    return acc;
  }, {})).sort((a, b) => b.cost - a.cost);

  const byApplication = Object.values(events.reduce<Record<string, { application: string; requests: number; cost: number; risk: number }>>((acc, event) => {
    acc[event.application] ??= { application: event.application, requests: 0, cost: 0, risk: 0 };
    acc[event.application].requests += 1;
    acc[event.application].cost += Number(event.estimatedCostUsd);
    acc[event.application].risk += event.hallucinationRisk ?? 0;
    return acc;
  }, {})).map((item) => ({ ...item, risk: item.requests ? item.risk / item.requests : 0 })).sort((a, b) => b.cost - a.cost);

  const daily = Object.values(events.reduce<Record<string, { date: string; requests: number; cost: number; flags: number }>>((acc, event) => {
    const date = event.createdAt.toISOString().slice(0, 10);
    acc[date] ??= { date, requests: 0, cost: 0, flags: 0 };
    acc[date].requests += 1;
    acc[date].cost += Number(event.estimatedCostUsd);
    acc[date].flags += event.safetyFlagged ? 1 : 0;
    return acc;
  }, {})).sort((a, b) => a.date.localeCompare(b.date));

  const reviews = await prisma.humanReview.findMany({
    where: { organisationId },
    include: { aiEvent: true },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const auditLogs = await prisma.auditLog.findMany({
    where: { organisationId },
    orderBy: { createdAt: 'desc' },
    take: 25
  });

  return {
    summary: {
      totalRequests,
      totalTokens,
      totalCost,
      flaggedRate: totalRequests ? flagged / totalRequests : 0,
      hallucinationRate: totalRequests ? risky / totalRequests : 0,
      errorRate: totalRequests ? errors / totalRequests : 0,
      p50LatencyMs: percentile(latencies, 50),
      p95LatencyMs: percentile(latencies, 95),
      p99LatencyMs: percentile(latencies, 99)
    },
    byModel,
    byApplication,
    daily,
    reviews,
    auditLogs
  };
}
