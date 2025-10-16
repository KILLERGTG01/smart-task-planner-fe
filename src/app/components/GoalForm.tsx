"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Schema = z.object({
  title: z.string().max(100).optional(),
  goal: z
    .string()
    .min(10, "Please describe your goal in at least 10 characters"),
});

type FormData = z.infer<typeof Schema>;

export default function GoalForm({
  onGenerate,
}: {
  onGenerate: (payload: { goal: string; title?: string }) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(Schema) });
  const [loading, setLoading] = useState(false);

  const submit = async (data: FormData) => {
    setLoading(true);

    await onGenerate({
      goal: data.goal,
      title: data.title,
    });

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="mb-3">
        <input
          {...register("title")}
          placeholder="Title (optional)"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-3">
        <textarea
          {...register("goal")}
          placeholder="Describe the goal, e.g., Launch MVP in 4 weeks"
          className="w-full border rounded px-3 py-2 h-28"
        />
        {errors.goal && (
          <p className="text-red-500 text-sm mt-1">
            {String(errors.goal.message)}
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>
    </form>
  );
}
