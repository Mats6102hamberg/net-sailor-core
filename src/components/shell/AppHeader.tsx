"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { type Locale } from "@/i18n/config";

interface AppHeaderProps {
  locale: Locale;
  labels: {
    appName: string;
    familj: string;
    omrade: string;
  };
}

export default function AppHeader({ locale, labels }: AppHeaderProps) {
  const pathname = usePathname();

  const isFamilj = pathname.startsWith(`/${locale}/familj`);
  const isOmrade =
    pathname.startsWith(`/${locale}/omrade`) ||
    pathname.startsWith(`/${locale}/trygg-nara`);

  const navItems = [
    { href: `/${locale}/familj`, label: labels.familj, active: isFamilj, icon: "\u{1F3E0}" },
    { href: `/${locale}/omrade`, label: labels.omrade, active: isOmrade, icon: "\u{1F3D8}\u{FE0F}" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">{"\u{1F419}"}</span>
          <span className="font-bold text-lg text-slate-800 hidden sm:inline">
            {labels.appName}
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                item.active
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <LanguageSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
