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
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">{admin.title}</h1>
          <p className="text-slate-500 mt-1">{admin.description}</p>
        </div>

        <AdminPanel locale={locale} labels={admin} typeLabels={typeLabels} />
      </div>
    </main>
  );
}
