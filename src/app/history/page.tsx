"use client";
import useSWR from "swr";
import api from "@/app/lib/axios";
import { useAuth0 } from "@auth0/auth0-react";
import { HistoryResponse, Plan } from "@/app/lib/types";

function fetcher(url: string) {
  return api.get(url).then((r) => r.data);
}

export default function HistoryPage() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const { data, error, isLoading } = useSWR<HistoryResponse>(
    isAuthenticated ? "/api/history" : null,
    fetcher,
    { refreshInterval: 0 }
  );

  if (!isAuthenticated) return <div>Please login to see history</div>;
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
