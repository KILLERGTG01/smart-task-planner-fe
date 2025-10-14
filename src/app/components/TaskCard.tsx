// components/TaskCard.tsx
export default function TaskCard({ task }: { task: any }) {
  return (
    <div className="bg-white rounded shadow-sm p-4 border">
      <h3 className="font-semibold text-lg">{task.task}</h3>
      <div className="text-sm text-slate-600">Duration: {task.duration_days ?? task.duration}</div>
      {task.depends_on?.length > 0 && <div className="text-xs text-slate-500 mt-1">Depends: {task.depends_on.join(", ")}</div>}
    </div>
  );
}
