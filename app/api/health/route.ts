import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'ok',
      service: 'openai-operations-dashboard',
      database: 'reachable',
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      {
        status: 'degraded',
        service: 'openai-operations-dashboard',
        database: 'unreachable',
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
