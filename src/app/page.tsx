// app/page.tsx
"use client";
import { useState } from "react";
import GoalForm from "@/app/components/GoalForm";
import TaskCard from "@/app/components/TaskCard";
import GanttWrapper from "@/app/components/GanttWrapper";
import api from "@/app/lib/axios";

export default function HomePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [progress, setProgress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // non-streaming generate (axios)
  const generateNonStream = async (payload: { goal: string; title?: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/api/generate", { goal: payload.goal, title: payload.title });
      setTasks(res.data.plan ?? res.data);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // streaming: use fetch + ReadableStream (lets set Authorization header)
  const generateStream = async (payload: { goal: string; title?: string }) => {
    setTasks([]);
    setProgress("");
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ goal: payload.goal, title: payload.title }),
      });

      if (!res.body) throw new Error("No streaming body available");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        acc += chunk;
        setProgress((p) => (p ?? "") + chunk);
        // Attempt to parse JSON as we accumulate; if parseable, update tasks
        const start = acc.indexOf("[");
        const end = acc.lastIndexOf("]");
        if (start !== -1 && end !== -1 && end > start) {
          try {
            const arr = JSON.parse(acc.slice(start, end + 1));
            setTasks(arr);
          } catch (e) {
            // ignore until complete
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Streaming failed");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const onGenerate = async ({ goal, title, stream }: { goal: string; title?: string; stream?: boolean }) => {
    if (stream) await generateStream({ goal, title });
    else await generateNonStream({ goal, title });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Smart Task Planner</h1>
      <GoalForm onGenerate={onGenerate} />
      <div>
        <GanttWrapper tasks={tasks} />
      </div>
      {progress && <pre className="bg-white p-3 rounded text-xs text-slate-600">{progress}</pre>}
      <div className="grid gap-3 md:grid-cols-2">
        {tasks.map((t, i) => (
          <TaskCard key={i} task={t} />
        ))}
      </div>
    </div>
  );
}
