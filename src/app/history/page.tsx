"use client";
import useSWR from "swr";
import api from "@/app/lib/axios";
import { HistoryResponse, Plan } from "@/app/lib/types";
import { WithAuth } from "@/app/lib/withAuth";

function fetcher(url: string) {
  return api.get(url).then((r) => r.data);
}

function HistoryContent() {
  const { data, error, isLoading } = useSWR<HistoryResponse>(
    "/api/history",
    fetcher,
    { refreshInterval: 0 }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading history</div>;

  const plans = data?.plans ?? [];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Plans</h1>
      {plans.length === 0 && <div className="text-slate-500">No saved plans yet.</div>}
      <div className="grid gap-4">
        {plans.map((p: Plan) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{p.title || p.goal}</h3>
              <div className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleString()}</div>
            </div>
            <pre className="mt-2 text-sm bg-slate-50 p-2 rounded overflow-x-auto">{JSON.stringify(p.plan, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <WithAuth>
      <HistoryContent />
    </WithAuth>
  );
}
