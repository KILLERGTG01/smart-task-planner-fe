// components/GanttWrapper.tsx
"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "frappe-gantt/dist/frappe-gantt.css";

const FrappeGantt = dynamic(() => import("frappe-gantt"), { ssr: false });

export default function GanttWrapper({ tasks }: { tasks: any[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!tasks || tasks.length === 0) {
      ref.current.innerHTML = "<div class='text-sm text-slate-500'>No tasks yet</div>";
      return;
    }

    const items = tasks.map((t: any, i: number) => {
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

    ref.current.innerHTML = "";
    // @ts-ignore
    const gantt = new FrappeGantt(ref.current, items, {
      on_click: (task: any) => {},
      on_date_change: (task: any, start: any, end: any) => {}
    });

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [tasks]);

  return <div ref={ref} className="bg-white rounded shadow-sm p-4 min-h-[200px] overflow-auto" />;
}
