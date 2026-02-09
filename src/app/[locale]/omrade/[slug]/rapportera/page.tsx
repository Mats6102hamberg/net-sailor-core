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
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        <Link
          href={`/${locale}/omrade/${area.slug}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>&larr;</span>
          <span>{common.back}</span>
        </Link>

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
            successExpectation: omrade.reportSuccessExpectation,
            severity: omrade.severity,
            severityLow: omrade.severityLow,
            severityMedium: omrade.severityMedium,
            severityHigh: omrade.severityHigh,
            typeWarning: omrade.type.WARNING,
            typeInfo: omrade.type.INFO,
            typeTip: omrade.type.TIP,
            typeNeighbourWatch: omrade.type.NEIGHBOUR_WATCH,
            error: common.error,
            guidelinesTitle: omrade.reportGuidelines.title,
            guidelinesRule1: omrade.reportGuidelines.rule1,
            guidelinesRule2: omrade.reportGuidelines.rule2,
            guidelinesRule3: omrade.reportGuidelines.rule3,
            guidelinesRule4: omrade.reportGuidelines.rule4,
            guidelinesAccept: omrade.reportGuidelines.accept,
          }}
        />
      </div>
    </main>
  );
}
