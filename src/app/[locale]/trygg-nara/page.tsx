import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { BorisButton } from "@/components/boris/BorisButton";
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
  aboutPilot: TSection;
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
  const aboutPilot = t.aboutPilot ?? {};
  const borisGlobal = messages.boris ?? {};

  const faqItems = [
    { q: faq.q1, a: faq.a1 },
    { q: faq.q2, a: faq.a2 },
    { q: faq.q3, a: faq.a3 },
    { q: faq.q4, a: faq.a4 },
  ];

  const flowSteps = [
    { icon: "\u{1F4DD}", label: flow.step1 },
    { icon: "\u{1F50D}", label: flow.step2 },
    { icon: "\u2705", label: flow.step3 },
    { icon: "\u{1F441}\u{FE0F}", label: flow.step4 },
  ];

  const cardData: { key: string; icon: string; title: string; body: string }[] = [
    { key: "what", icon: "\u{1F6E1}\u{FE0F}", title: cards.what?.title ?? "", body: cards.what?.body ?? "" },
    { key: "how", icon: "\u2699\u{FE0F}", title: cards.how?.title ?? "", body: cards.how?.body ?? "" },
    { key: "integrity", icon: "\u{1F512}", title: cards.integrity?.title ?? "", body: cards.integrity?.body ?? "" },
  ];

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-16 pb-12">
        <div className="max-w-lg w-full space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="text-5xl">{"\u{1F6E1}\u{FE0F}"}</span>
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
              <span>&rarr;</span>
            </Link>
            {hero.ctaSecondary && (
              <a
                href="#flow"
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                {hero.ctaSecondary}
                <span>&darr;</span>
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
                  <span className="text-slate-300 text-xl font-light mb-6">&rarr;</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boris */}
      <section className="px-4 pb-16">
        <div className="max-w-lg mx-auto">
          <BorisButton
            context="area"
            greeting={borisGlobal.greeting ?? "Boris"}
            message={boris.message}
          />
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

      {/* About pilot */}
      <section className="px-4 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{"\u{1F52C}"}</span>
              <h3 className="text-sm font-bold text-slate-700">{aboutPilot.title}</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{aboutPilot.body}</p>
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
            <span>&rarr;</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
