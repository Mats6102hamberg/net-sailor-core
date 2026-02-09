import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

async function dbPing(): Promise<{ ok: boolean; ms: number }> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, ms: Date.now() - start };
  } catch {
    return { ok: false, ms: Date.now() - start };
  }
}

export default async function StatusPage() {
  const db = await dbPing();
  const gitCommit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
    ?? process.env.GIT_COMMIT
    ?? "local";
  const hasDb = !!process.env.DATABASE_URL;
  const hasAdmin = !!process.env.ADMIN_KEY;

  const checks: { label: string; ok: boolean; detail: string }[] = [
    { label: "DATABASE_URL", ok: hasDb, detail: hasDb ? "configured" : "MISSING" },
    { label: "DB ping (SELECT 1)", ok: db.ok, detail: db.ok ? `OK (${db.ms}ms)` : `FAIL (${db.ms}ms)` },
    { label: "ADMIN_KEY", ok: hasAdmin, detail: hasAdmin ? "configured" : "MISSING" },
  ];

  const allOk = checks.every((c) => c.ok);

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">System Status</h1>
          <p className="text-sm text-slate-500">Net Sailor Core</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">App</span>
            <span className="font-mono font-medium text-slate-800">net-sailor-core</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Commit</span>
            <span className="font-mono font-medium text-slate-800">{gitCommit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Environment</span>
            <span className="font-mono font-medium text-slate-800">
              {process.env.VERCEL ? "vercel" : "local"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Health Checks</h2>
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{check.label}</span>
              <span className={`font-mono font-medium ${check.ok ? "text-green-700" : "text-red-700"}`}>
                {check.detail}
              </span>
            </div>
          ))}
        </div>

        <div className={`rounded-2xl p-4 text-center text-sm font-semibold ${
          allOk
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {allOk ? "All systems operational" : "Issues detected"}
        </div>
      </div>
    </main>
  );
}
