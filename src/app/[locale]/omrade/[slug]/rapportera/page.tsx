import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";
import { ReportForm } from "@/components/omrade/ReportForm";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (await getMessages(locale)) as any;
  const omrade = messages.omrade;
  const common = messages.common;

  const area = await prisma.area.findUnique({
    where: { slug: params.slug },
  });

  if (!area) notFound();

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <Link
          href={`/${locale}/omrade/${area.slug}`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>←</span>
          <span className="text-sm font-medium">{common.back}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <span className="font-bold text-slate-800">{omrade.report}</span>
        </div>
        <div className="w-16" />
      </header>

      <section className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {omrade.report}
            </h1>
            <p className="text-slate-500 mt-1">{area.name}</p>
          </div>

          <ReportForm
            areaSlug={area.slug}
            locale={locale}
            labels={{
              title: omrade.reportTitle,
              description: omrade.reportDescription,
              name: omrade.reportName,
              submit: omrade.reportSubmit,
              success: omrade.reportSuccess,
              severity: omrade.severity,
              severityLow: omrade.severityLow,
              severityMedium: omrade.severityMedium,
              severityHigh: omrade.severityHigh,
              typeWarning: omrade.type.WARNING,
              typeInfo: omrade.type.INFO,
              typeTip: omrade.type.TIP,
              typeNeighbourWatch: omrade.type.NEIGHBOUR_WATCH,
              error: common.error,
            }}
          />
        </div>
      </section>
    </main>
  );
}
