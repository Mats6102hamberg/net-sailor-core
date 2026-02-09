import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { BorisButton } from "@/components/boris/BorisButton";
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
  const boris = messages.boris;

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
    WARNING: "\u26A0\u{FE0F}",
    INFO: "\u{1F4E2}",
    TIP: "\u{1F4A1}",
    NEIGHBOUR_WATCH: "\u{1F91D}",
  };

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        <Link
          href={`/${locale}/omrade`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>&larr;</span>
          <span>{t("allAreas")}</span>
        </Link>

        <BorisButton
          context="area"
          greeting={boris.greeting}
          message={boris.intro}
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              {area.name} &middot; {t("events")} ({area.events.length})
            </h2>
            <Link
              href={`/${locale}/omrade/${area.slug}/rapportera`}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              + {t("reportIn")} {area.name}
            </Link>
          </div>
          <p className="text-xs text-slate-400">{t("reviewedNote")}</p>
        </div>

        {area.events.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-5xl">{"\u{1F33F}"}</div>
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
                typeIcon={typeIcons[event.type] ?? "\u{1F4E2}"}
                timeAgoLabel={t("timeAgo")}
                severityLabels={[t("severityLow"), t("severityMedium"), t("severityHigh")]}
                statusBadge={t("statusApproved")}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
