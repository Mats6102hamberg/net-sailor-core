"use client";

interface EventCardProps {
  title: string;
  description: string | null;
  type: string;
  severity: number;
  reporterName: string | null;
  createdAt: string;
  typeLabel: string;
  typeIcon: string;
  timeAgoLabel: string;
  severityLabels: [string, string, string];
}

function timeAgo(dateStr: string, label: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just nu";
  if (minutes < 60) return `${minutes} min ${label}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${label}`;
  const days = Math.floor(hours / 24);
  return `${days}d ${label}`;
}

const severityColors = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-red-100 text-red-700 border-red-200",
];

export function EventCard({
  title,
  description,
  severity,
  reporterName,
  createdAt,
  typeLabel,
  typeIcon,
  timeAgoLabel,
  severityLabels,
}: EventCardProps) {
  const sevIndex = Math.min(Math.max(severity - 1, 0), 2);

  return (
    <div className={`rounded-xl border p-4 space-y-2 ${severityColors[sevIndex]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeIcon}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">
            {typeLabel}
          </span>
        </div>
        <span className="text-xs opacity-70">{timeAgo(createdAt, timeAgoLabel)}</span>
      </div>

      <h3 className="font-bold text-sm">{title}</h3>

      {description && (
        <p className="text-xs leading-relaxed opacity-80">{description}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-medium">
          {severityLabels[sevIndex]}
        </span>
        {reporterName && (
          <span className="text-xs opacity-60">— {reporterName}</span>
        )}
      </div>
    </div>
  );
}
