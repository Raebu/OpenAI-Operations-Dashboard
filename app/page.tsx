import { Activity, AlertTriangle, BadgeDollarSign, BrainCircuit, Clock3, ShieldCheck } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { ModelUsageChart, SpendChart } from '@/components/dashboard-charts';
import { getDashboardMetrics } from '@/lib/metrics';

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function usd(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export default async function Home() {
  const metrics = await getDashboardMetrics();
  const { summary } = metrics;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_35%),linear-gradient(180deg,#050816,#0B1020)] px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-sm text-sky-200">Enterprise AI governance</div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">OpenAI Operations Dashboard</h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-300">Monitor prompts, token spend, model usage, latency, hallucination risk, safety incidents, and audit logs across every AI application.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Governance posture</p>
            <p className="mt-1">Production telemetry, human review, audit trail, and risk scoring enabled.</p>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="30-day token spend" value={usd(summary.totalCost)} detail={`${summary.totalTokens.toLocaleString()} tokens observed`} icon={BadgeDollarSign} />
          <StatCard title="Model requests" value={summary.totalRequests.toLocaleString()} detail={`${pct(summary.errorRate)} error / block / timeout rate`} icon={Activity} />
          <StatCard title="Hallucination risk" value={pct(summary.hallucinationRate)} detail="Events above configured risk threshold" icon={BrainCircuit} />
          <StatCard title="Safety flags" value={pct(summary.flaggedRate)} detail="Moderation, jailbreak, data policy, and blocked events" icon={ShieldCheck} />
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <StatCard title="p50 latency" value={`${summary.p50LatencyMs}ms`} detail="Median end-to-end completion latency" icon={Clock3} />
          <StatCard title="p95 latency" value={`${summary.p95LatencyMs}ms`} detail="Tail latency for user-facing experiences" icon={Clock3} />
          <StatCard title="p99 latency" value={`${summary.p99LatencyMs}ms`} detail="Enterprise reliability watchpoint" icon={AlertTriangle} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <SpendChart data={metrics.daily} />
          <ModelUsageChart data={metrics.byModel} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold">Applications by cost and risk</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.05] text-slate-300">
                  <tr><th className="p-3">Application</th><th className="p-3">Requests</th><th className="p-3">Cost</th><th className="p-3">Avg risk</th></tr>
                </thead>
                <tbody>
                  {metrics.byApplication.map((item) => (
                    <tr key={item.application} className="border-t border-white/10">
                      <td className="p-3 font-medium text-white">{item.application}</td>
                      <td className="p-3 text-slate-300">{item.requests}</td>
                      <td className="p-3 text-slate-300">{usd(item.cost)}</td>
                      <td className="p-3 text-slate-300">{pct(item.risk)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold">Human review queue</h2>
            <div className="mt-4 space-y-3">
              {metrics.reviews.length === 0 ? <p className="text-sm text-slate-400">No pending high-risk reviews.</p> : metrics.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{review.aiEvent.promptName}</p>
                    <span className="rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-200">{review.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{review.aiEvent.application} · {review.aiEvent.model} · severity {review.severity}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-semibold">Audit logs</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {metrics.auditLogs.map((log) => (
              <div key={log.id} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                <p className="font-medium text-white">{log.action}</p>
                <p className="mt-1 text-slate-400">{log.actor} · {log.targetType}</p>
                <p className="mt-2 text-xs text-slate-500">{log.createdAt.toISOString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
