"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type DailyPoint = { date: string; requests: number; cost: number; flags: number };
type ModelPoint = { model: string; requests: number; tokens: number; cost: number };

export function SpendChart({ data }: { data: DailyPoint[] }) {
  return (
    <div className="h-72 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-lg font-semibold">Spend and request volume</h2>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip contentStyle={{ background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }} />
          <Area type="monotone" dataKey="requests" stroke="#38BDF8" fill="#38BDF833" />
          <Area type="monotone" dataKey="cost" stroke="#A78BFA" fill="#A78BFA33" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ModelUsageChart({ data }: { data: ModelPoint[] }) {
  return (
    <div className="h-72 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-lg font-semibold">Model usage</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data.slice(0, 8)} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="model" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip contentStyle={{ background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }} />
          <Bar dataKey="requests" fill="#38BDF8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
