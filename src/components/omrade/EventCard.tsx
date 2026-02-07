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
  statusBadge?: string;
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

const typeColors: Record<string, string> = {
  WARNING: "bg-amber-50 text-amber-800 border-amber-200",
  INFO: "bg-blue-50 text-blue-800 border-blue-200",
  TIP: "bg-emerald-50 text-emerald-800 border-emerald-200",
  NEIGHBOUR_WATCH: "bg-violet-50 text-violet-800 border-violet-200",
};

export function EventCard({
  title,
  description,
  type,
  severity,
  reporterName,
  createdAt,
  typeLabel,
  typeIcon,
  timeAgoLabel,
  severityLabels,
  statusBadge,
}: EventCardProps) {
  const sevIndex = Math.min(Math.max(severity - 1, 0), 2);
  const colors = typeColors[type] ?? typeColors.INFO;

  return (
    <div className={`relative rounded-xl border p-4 space-y-2 ${colors}`}>
      {statusBadge && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
          {statusBadge}
        </span>
      )}

      <div className="flex items-start justify-between pr-16">
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
