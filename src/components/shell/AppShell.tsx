import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { type Locale } from "@/i18n/config";

interface AppShellProps {
  locale: Locale;
  labels: {
    appName: string;
    tagline: string;
    familj: string;
    omrade: string;
  };
  children: React.ReactNode;
}

export default function AppShell({ locale, labels, children }: AppShellProps) {
  return (
    <>
      <AppHeader
        locale={locale}
        labels={{
          appName: labels.appName,
          familj: labels.familj,
          omrade: labels.omrade,
        }}
      />
      <div className="flex-1 flex flex-col">{children}</div>
      <AppFooter tagline={labels.tagline} />
    </>
  );
}
