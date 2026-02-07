import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";
import { AdminPanel } from "@/components/omrade/AdminPanel";

export default async function AdminPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (await getMessages(locale)) as any;
  const admin = messages.omrade?.admin ?? {};
  const typeLabels: Record<string, string> = messages.omrade?.type ?? {};

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-3 flex items-center justify-center bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-slate-800">{admin.title}</span>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-lg w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">{admin.title}</h1>
            <p className="text-slate-500 mt-1">{admin.description}</p>
          </div>

          <AdminPanel locale={locale} labels={admin} typeLabels={typeLabels} />
        </div>
      </section>
    </main>
  );
}
