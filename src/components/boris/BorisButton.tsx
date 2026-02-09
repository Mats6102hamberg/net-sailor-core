"use client";

import { useEffect, useState } from "react";

type BorisContext = "family" | "area";

interface BorisButtonProps {
  context: BorisContext;
  greeting: string;
  message: string;
  tip?: string;
}

const THEME: Record<BorisContext, { bg: string; border: string; text: string }> = {
  family: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800" },
  area: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
};

export function BorisButton({ context, greeting, message, tip }: BorisButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const theme = THEME[context];

  return (
    <div
      className={`${theme.bg} ${theme.border} border rounded-2xl p-5 max-w-md mx-auto transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{"\u{1F419}"}</div>
        <div className={`${theme.text} space-y-1`}>
          <p className="font-bold text-base">{greeting}</p>
          <p className="text-sm leading-relaxed opacity-90">{message}</p>
          {tip && (
            <p className="text-xs italic opacity-70 mt-2">{tip}</p>
          )}
        </div>
      </div>
    </div>
  );
}
