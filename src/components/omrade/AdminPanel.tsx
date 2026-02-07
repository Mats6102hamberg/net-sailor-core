"use client";

import { useState } from "react";

interface AdminLabels {
  adminKey: string;
  adminKeyPlaceholder: string;
  load: string;
  noPending: string;
  approve: string;
  reject: string;
  approved: string;
  rejected: string;
  unauthorized: string;
  area: string;
}

interface PendingEvent {
  id: string;
  title: string;
  description: string | null;
  type: string;
  severity: number;
  reporterName: string | null;
  createdAt: string;
  area: { name: string; slug: string };
}

interface AdminPanelProps {
  locale: string;
  labels: AdminLabels;
  typeLabels: Record<string, string>;
}

const typeIcons: Record<string, string> = {
  WARNING: "⚠️",
  INFO: "📢",
  TIP: "💡",
  NEIGHBOUR_WATCH: "🤝",
};

const severityColors = [
  "border-blue-200 bg-blue-50",
  "border-amber-200 bg-amber-50",
  "border-red-200 bg-red-50",
];

export function AdminPanel({ labels, typeLabels }: AdminPanelProps) {
  const [adminKey, setAdminKey] = useState("");
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState<Record<string, string>>({});

  async function loadEvents() {
    if (!adminKey.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/events?status=PENDING", {
        headers: { "x-admin-key": adminKey },
      });

      if (res.status === 401) {
        setError(labels.unauthorized);
        setLoaded(false);
        return;
      }

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setEvents(data);
      setLoaded(true);
    } catch {
      setError("Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(eventId: string, status: "APPROVED" | "REJECTED") {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed");

      setActionStatus((prev) => ({
        ...prev,
        [eventId]: status === "APPROVED" ? labels.approved : labels.rejected,
      }));

      setTimeout(() => {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        setActionStatus((prev) => {
          const next = { ...prev };
          delete next[eventId];
          return next;
        });
      }, 1200);
    } catch {
      setError("Error");
    }
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "< 1 min";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  return (
    <div className="space-y-4">
      {/* Admin key input */}
      <div className="flex gap-2">
        <input
          type="password"
          placeholder={labels.adminKeyPlaceholder}
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadEvents()}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
        />
        <button
          onClick={loadEvents}
          disabled={loading || !adminKey.trim()}
          className="px-5 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : labels.load}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium text-center">{error}</p>
      )}

      {/* Events list */}
      {loaded && events.length === 0 && (
        <div className="text-center py-12 space-y-3">
          <div className="text-5xl">✅</div>
          <p className="text-slate-400">{labels.noPending}</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="space-y-3">
          {events.map((event) => {
            const sevIndex = Math.min(Math.max(event.severity - 1, 0), 2);
            const status = actionStatus[event.id];

            return (
              <div
                key={event.id}
                className={`rounded-xl border p-4 space-y-3 transition-all ${
                  status
                    ? "opacity-50 scale-95"
                    : severityColors[sevIndex]
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeIcons[event.type] ?? "📢"}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {typeLabels[event.type] ?? event.type}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{timeAgo(event.createdAt)}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-800">{event.title}</h3>

                {event.description && (
                  <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{labels.area}: {event.area.name}</span>
                  {event.reporterName && <span>— {event.reporterName}</span>}
                </div>

                {status ? (
                  <p className="text-center text-sm font-semibold text-slate-600">{status}</p>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(event.id, "APPROVED")}
                      className="flex-1 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      {labels.approve}
                    </button>
                    <button
                      onClick={() => handleAction(event.id, "REJECTED")}
                      className="flex-1 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                    >
                      {labels.reject}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
