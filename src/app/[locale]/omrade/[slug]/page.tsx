import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import Boris from "@/components/boris/Boris";
import { prisma } from "@/lib/db/prisma";
import { EventCard } from "@/components/omrade/EventCard";

export const dynamic = "force-dynamic";

export default async function AreaDashboardPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (await getMessages(locale)) as any;
  const t = (key: string): string => messages.omrade?.[key] ?? key;
  const typeLabels: Record<string, string> = messages.omrade?.type ?? {};

  const area = await prisma.area.findUnique({
    where: { slug: params.slug },
    include: {
      events: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!area) notFound();

  const typeIcons: Record<string, string> = {
    WARNING: "⚠️",
    INFO: "📢",
    TIP: "💡",
    NEIGHBOUR_WATCH: "🤝",
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <Link
          href={`/${locale}/omrade`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>←</span>
          <span className="text-sm font-medium">{t("allAreas")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏘️</span>
          <span className="font-bold text-slate-800">{area.name}</span>
        </div>
        <div className="w-16" />
      </header>

      <section className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          <Boris locale={locale} mood={area.events.length > 0 ? "warn" : "happy"} />

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              {t("events")} ({area.events.length})
            </h2>
            <Link
              href={`/${locale}/omrade/${area.slug}/rapportera`}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              + {t("report")}
            </Link>
          </div>

          {area.events.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-5xl">🌿</div>
              <p className="text-slate-400">{t("noEvents")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {area.events.map((event: { id: string; title: string; description: string | null; type: string; severity: number; reporterName: string | null; createdAt: Date }) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  type={event.type}
                  severity={event.severity}
                  reporterName={event.reporterName}
                  createdAt={event.createdAt.toISOString()}
                  typeLabel={typeLabels[event.type] ?? event.type}
                  typeIcon={typeIcons[event.type] ?? "📢"}
                  timeAgoLabel={t("timeAgo")}
                  severityLabels={[t("severityLow"), t("severityMedium"), t("severityHigh")]}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
