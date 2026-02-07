import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import Boris from "@/components/boris/Boris";
import { prisma } from "@/lib/db/prisma";
import { AreaList } from "@/components/omrade/AreaList";

export const dynamic = "force-dynamic";

export default async function OmradePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (await getMessages(locale)) as any;
  const omrade = messages.omrade;
  const common = messages.common;

  const areas = await prisma.area.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { events: { where: { status: "ACTIVE" } } } } },
  });

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>←</span>
          <span className="text-sm font-medium">{common.back}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏘️</span>
          <span className="font-bold text-slate-800">{omrade.title}</span>
        </div>
        <div className="w-16" />
      </header>

      <section className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          <Boris locale={locale} mood="happy" />

          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">{omrade.title}</h1>
            <p className="text-slate-500 mt-1">{omrade.description}</p>
          </div>

          <h2 className="text-lg font-bold text-slate-800">{omrade.chooseArea}</h2>

          <AreaList
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            areas={areas.map((a: any) => ({
              id: a.id as string,
              name: a.name as string,
              slug: a.slug as string,
              eventCount: a._count.events as number,
            }))}
            locale={locale}
            noAreasText={omrade.noAreas}
            eventsLabel={omrade.events}
            searchPlaceholder={omrade.searchPlaceholder}
          />
        </div>
      </section>
    </main>
  );
}
