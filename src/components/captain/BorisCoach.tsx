"use client";

import { useEffect, useState } from "react";

type BorisMood = "happy" | "encourage" | "warn" | "safety";

interface BorisCoachProps {
  completed: number;
  total: number;
  mood?: BorisMood;
  labels: {
    title: string;
    message: string;
    tip?: string;
  };
}

const MOOD_CONFIG: Record<BorisMood, { emoji: string; ring: string; bg: string; border: string; text: string }> = {
  happy:     { emoji: "\u{1F60A}", ring: "ring-green-300",  bg: "bg-green-50",  border: "border-green-200",  text: "text-green-800" },
  encourage: { emoji: "\u{1F4AA}", ring: "ring-sky-300",    bg: "bg-sky-50",    border: "border-sky-200",    text: "text-sky-800" },
  warn:      { emoji: "\u{1F914}", ring: "ring-amber-300",  bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800" },
  safety:    { emoji: "\u{1F499}", ring: "ring-purple-300", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800" },
};

function getMood(completed: number, total: number, overrideMood?: BorisMood): BorisMood {
  if (overrideMood) return overrideMood;
  if (completed >= total) return "happy";
  return "encourage";
}

export function BorisCoach({ completed, total, mood: overrideMood, labels }: BorisCoachProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const safeTotal = Math.max(1, total);
  const safeCompleted = Math.max(0, Math.min(completed, safeTotal));
  const mood = getMood(safeCompleted, safeTotal, overrideMood);
  const config = MOOD_CONFIG[mood];

  return (
    <aside
      className={`rounded-2xl border ${config.border} ${config.bg} p-4 shadow-md transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white ring-2 ${config.ring} text-2xl shadow-sm`}
        >
          {config.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold ${config.text}`}>{labels.title}</p>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{labels.message}</p>
          {labels.tip && (
            <p className="mt-2 text-xs text-slate-400 italic">{labels.tip}</p>
          )}
        </div>
      </div>
    </aside>
  );
}
