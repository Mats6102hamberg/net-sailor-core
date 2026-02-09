import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { BorisButton } from "@/components/boris/BorisButton";
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
  const boris = messages.boris;

  const areas = await prisma.area.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { events: { where: { status: "APPROVED" } } } } },
  });

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        <BorisButton
          context="area"
          greeting={boris.greeting}
          message={boris.intro}
        />

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
    </main>
  );
}
