
"use client";
import { useEffect, useRef } from "react";
import "frappe-gantt/dist/frappe-gantt.css";
import { Task, GanttTask } from "@/app/lib/types";

export default function GanttWrapper({ tasks }: { tasks: Task[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!tasks || tasks.length === 0) {
      ref.current.innerHTML = "<div class='text-sm text-slate-500'>No tasks yet</div>";
      return;
    }

    const loadGantt = async () => {
      const Gantt = (await import("frappe-gantt")).default;
      
      const items: GanttTask[] = tasks.map((t: Task, i: number) => {
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + (t.duration_days ?? t.duration ?? 1));
        return {
          id: String(i),
          name: t.task,
          start: start.toISOString().slice(0, 10),
          end: end.toISOString().slice(0, 10),
          progress: 0
        };
      });

      if (ref.current) {
        ref.current.innerHTML = "";
        const gantt = new Gantt(ref.current, items, {
          on_click: (task: GanttTask) => {},
          on_date_change: (task: GanttTask, start: Date, end: Date) => {}
        });
      }
    };

    loadGantt();

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [tasks]);

  return <div ref={ref} className="bg-white rounded shadow-sm p-4 min-h-[200px] overflow-auto" />;
}
