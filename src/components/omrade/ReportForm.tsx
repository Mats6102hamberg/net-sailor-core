"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReportFormProps {
  areaSlug: string;
  locale: string;
  labels: {
    title: string;
    description: string;
    name: string;
    submit: string;
    success: string;
    successExpectation: string;
    severity: string;
    severityLow: string;
    severityMedium: string;
    severityHigh: string;
    typeWarning: string;
    typeInfo: string;
    typeTip: string;
    typeNeighbourWatch: string;
    error: string;
    guidelinesTitle: string;
    guidelinesRule1: string;
    guidelinesRule2: string;
    guidelinesRule3: string;
    guidelinesRule4: string;
    guidelinesAccept: string;
  };
}

const eventTypes = [
  { value: "INFO", icon: "📢" },
  { value: "WARNING", icon: "⚠️" },
  { value: "TIP", icon: "💡" },
  { value: "NEIGHBOUR_WATCH", icon: "🤝" },
] as const;

export function ReportForm({ areaSlug, locale, labels }: ReportFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [type, setType] = useState<string>("INFO");
  const [severity, setSeverity] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const typeLabels: Record<string, string> = {
    WARNING: labels.typeWarning,
    INFO: labels.typeInfo,
    TIP: labels.typeTip,
    NEIGHBOUR_WATCH: labels.typeNeighbourWatch,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/areas/${areaSlug}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          type,
          severity,
          reporterName: reporterName.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/omrade/${areaSlug}`);
        router.refresh();
      }, 1500);
    } catch {
      setError(labels.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 space-y-4 animate-fade-in">
        <div className="text-5xl">✅</div>
        <p className="text-lg font-semibold text-emerald-700">{labels.success}</p>
        <p className="text-sm text-slate-500">{labels.successExpectation}</p>
      </div>
    );
  }

  if (!accepted) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <h3 className="text-base font-bold text-amber-900">{labels.guidelinesTitle}</h3>
        </div>
        <ul className="space-y-3">
          {[
            { icon: "📍", text: labels.guidelinesRule1 },
            { icon: "🚫", text: labels.guidelinesRule2 },
            { icon: "✏️", text: labels.guidelinesRule3 },
            { icon: "🚨", text: labels.guidelinesRule4 },
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-amber-800">
              <span className="flex-shrink-0">{rule.icon}</span>
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setAccepted(true)}
          className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          {labels.guidelinesAccept}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Event type */}
      <div className="grid grid-cols-4 gap-2">
        {eventTypes.map((et) => (
          <button
            key={et.value}
            type="button"
            onClick={() => setType(et.value)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all ${
              type === et.value
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            <span className="text-xl">{et.icon}</span>
            <span>{typeLabels[et.value]}</span>
          </button>
        ))}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {labels.title} *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {labels.description}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none"
        />
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {labels.severity}
        </label>
        <div className="flex gap-2">
          {[
            { value: 1, label: labels.severityLow, color: "border-blue-300 bg-blue-50 text-blue-700" },
            { value: 2, label: labels.severityMedium, color: "border-amber-300 bg-amber-50 text-amber-700" },
            { value: 3, label: labels.severityHigh, color: "border-red-300 bg-red-50 text-red-700" },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSeverity(s.value)}
              className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                severity === s.value
                  ? `${s.color} shadow-sm`
                  : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reporter name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {labels.name}
        </label>
        <input
          type="text"
          value={reporterName}
          onChange={(e) => setReporterName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "..." : labels.submit}
      </button>
    </form>
  );
}
