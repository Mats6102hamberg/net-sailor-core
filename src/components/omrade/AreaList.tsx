"use client";

import { useState } from "react";
import Link from "next/link";

interface AreaItem {
  id: string;
  name: string;
  slug: string;
  eventCount: number;
}

interface AreaListProps {
  areas: AreaItem[];
  locale: string;
  noAreasText: string;
  eventsLabel: string;
  searchPlaceholder: string;
}

export function AreaList({
  areas,
  locale,
  noAreasText,
  eventsLabel,
  searchPlaceholder,
}: AreaListProps) {
  const [search, setSearch] = useState("");

  const filtered = areas.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-8">{noAreasText}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((area) => (
            <Link
              key={area.id}
              href={`/${locale}/omrade/${area.slug}`}
              className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏘️</span>
                <span className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {area.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {area.eventCount > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                    {area.eventCount} {eventsLabel.toLowerCase()}
                  </span>
                )}
                <span className="text-slate-400 group-hover:text-emerald-500 transition-colors">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
