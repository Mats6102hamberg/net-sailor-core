import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import type { Metadata } from "next";

type TSection = Record<string, string>;
type TCards = Record<string, TSection>;
type TLanding = {
  meta: TSection;
  hero: TSection;
  cards: TCards;
  flow: TSection;
  faq: TSection;
  boris: TSection;
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (await getMessages(locale)) as any;
  const meta = messages.tryggNaraLanding?.meta ?? {};
  return {
    title: meta.title ?? "Trygg Nära",
    description: meta.description ?? "",
  };
}

export default async function TryggNaraLandingPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (await getMessages(locale)) as any;
  const t: TLanding = messages.tryggNaraLanding ?? {};
  const hero = t.hero ?? {};
  const cards = t.cards ?? {};
  const flow = t.flow ?? {};
  const faq = t.faq ?? {};
  const boris = t.boris ?? {};

  const faqItems = [
    { q: faq.q1, a: faq.a1 },
    { q: faq.q2, a: faq.a2 },
    { q: faq.q3, a: faq.a3 },
    { q: faq.q4, a: faq.a4 },
  ];

  const flowSteps = [
    { icon: "📝", label: flow.step1 },
    { icon: "🔍", label: flow.step2 },
    { icon: "✅", label: flow.step3 },
    { icon: "👁️", label: flow.step4 },
  ];

  const cardData: { key: string; icon: string; title: string; body: string }[] = [
    { key: "what", icon: "🛡️", title: cards.what?.title ?? "", body: cards.what?.body ?? "" },
    { key: "how", icon: "⚙️", title: cards.how?.title ?? "", body: cards.how?.body ?? "" },
    { key: "integrity", icon: "🔒", title: cards.integrity?.title ?? "", body: cards.integrity?.body ?? "" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span className="text-sm font-medium">← Tillbaka</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-slate-800">Trygg Nära</span>
        </div>
        <div className="w-20" />
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-16 pb-12">
        <div className="max-w-lg w-full space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="text-5xl">🛡️</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {hero.title}
              </h1>
              {hero.badge && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                  {hero.badge}
                </span>
              )}
            </div>
            <p className="text-lg text-slate-500 max-w-md mx-auto">
              {hero.subtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/${locale}/omrade`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white text-base font-semibold rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              {hero.cta}
              <span>→</span>
            </Link>
            {hero.ctaSecondary && (
              <a
                href="#flow"
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                {hero.ctaSecondary}
                <span>↓</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Three cards */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cardData.map((card) => (
            <div
              key={card.key}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm"
            >
              <div className="text-3xl">{card.icon}</div>
              <h3 className="text-base font-bold text-slate-800">{card.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section id="flow" className="px-4 pb-16 scroll-mt-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-xl font-bold text-slate-800">{flow.title}</h2>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {flowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{step.label}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <span className="text-slate-300 text-xl font-light mb-6">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boris */}
      <section className="px-4 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 p-6 flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">🐙</span>
            <p className="text-sm text-sky-800 leading-relaxed">{boris.message}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20">
        <div className="max-w-lg mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-800 text-center">{faq.title}</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
                <h3 className="text-sm font-bold text-slate-800">{item.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-16">
        <div className="max-w-lg mx-auto text-center">
          <Link
            href={`/${locale}/omrade`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white text-base font-semibold rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            {hero.cta}
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200">
        Trygg Nära · Pilot
      </footer>
    </main>
  );
}
