// app/page.tsx
"use client";
import { useState } from "react";
import GoalForm from "@/app/components/GoalForm";
import TaskTimeline from "@/app/components/TaskTimeline";
import api from "@/app/lib/axios";
import { Task } from "@/app/lib/types";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const onGenerate = async (payload: {
    goal: string;
    title?: string;
  }) => {
    setLoading(true);
    try {
      const res = await api.post("/api/generate", {
        goal: payload.goal,
        title: payload.title,
      });
      setTasks(res.data.plan ?? res.data);
    } catch (err: unknown) {
      console.error("API error:", err);
      const error = err as any;
      alert(error?.response?.data?.error || error.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Smart Task Planner
        </h1>
        <p className="text-slate-600 mt-2">AI-powered project planning and task scheduling</p>
      </div>
      
      <GoalForm onGenerate={onGenerate} />
      
      {loading && (
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium text-slate-700">Generating your plan...</span>
          </div>
          <p className="text-slate-500 mt-2">This may take a few moments while AI analyzes your goal.</p>
        </div>
      )}
      
      <TaskTimeline tasks={tasks} />
    </div>
  );
}
