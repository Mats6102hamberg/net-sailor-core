"use client";

import { useState, useTransition } from "react";
import {
  listKidsWithAdmin,
  setKidStatusWithAdmin,
  resetKidProgressWithAdmin,
  createKidWithAdmin,
  listGuardians,
} from "@/app/[locale]/familj/guardian/actions";

interface Kid {
  id: string;
  name: string;
  status: string;
  currentLessonOrder: number;
  locale: string;
  guardianName: string;
  createdAt: string;
}

interface Guardian {
  id: string;
  name: string | null;
  email: string | null;
}

interface GuardianPanelProps {
  locale: string;
  labels: {
    title: string;
    adminKey: string;
    adminKeyPlaceholder: string;
    load: string;
    unauthorized: string;
    noKids: string;
    status: string;
    progress: string;
    reset: string;
    createKid: string;
    name: string;
    pin: string;
    guardian: string;
    save: string;
    locked: string;
    unlocked: string;
    repair: string;
    lessonOf: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  LOCKED: "bg-red-100 text-red-800 border-red-200",
  UNLOCKED: "bg-green-100 text-green-800 border-green-200",
  REPAIR: "bg-amber-100 text-amber-800 border-amber-200",
};

const TOTAL_LESSONS = 5;

export function GuardianPanel({ locale, labels }: GuardianPanelProps) {
  const [adminKey, setAdminKey] = useState("");
  const [kids, setKids] = useState<Kid[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLoad = () => {
    setError(null);
    startTransition(async () => {
      try {
        const [kidsResult, guardiansResult] = await Promise.all([
          listKidsWithAdmin(adminKey),
          listGuardians(adminKey),
        ]);
        setKids(kidsResult);
        setGuardians(guardiansResult);
        setLoaded(true);
      } catch {
        setError(labels.unauthorized);
        setLoaded(false);
      }
    });
  };

  const handleStatusChange = (kidId: string, status: string) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("adminKey", adminKey);
        formData.set("kidId", kidId);
        formData.set("status", status);
        await setKidStatusWithAdmin(formData);
        const updated = await listKidsWithAdmin(adminKey);
        setKids(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Fel vid statusändring");
      }
    });
  };

  const handleReset = (kidId: string) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("adminKey", adminKey);
        formData.set("kidId", kidId);
        await resetKidProgressWithAdmin(formData);
        const updated = await listKidsWithAdmin(adminKey);
        setKids(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Fel vid reset");
      }
    });
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("adminKey", adminKey);

    startTransition(async () => {
      try {
        await createKidWithAdmin(formData);
        const updated = await listKidsWithAdmin(adminKey);
        setKids(updated);
        setShowCreate(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Fel vid skapande");
      }
    });
  };

  if (!loaded) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {labels.adminKey}
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder={labels.adminKeyPlaceholder}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}
        <button
          onClick={handleLoad}
          disabled={isPending || !adminKey}
          className="w-full px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "..." : labels.load}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          {kids.length} {locale === "sv" ? "barn" : "kids"}
        </h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors"
        >
          + {labels.createKid}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-violet-50 border border-violet-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-violet-900">{labels.createKid}</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.name}</label>
            <input name="name" required className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.pin} (4 siffror)</label>
            <input name="pin" required pattern="\d{4}" maxLength={4} inputMode="numeric" className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center tracking-widest" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.guardian}</label>
            <select name="guardianId" required className="w-full px-3 py-2 border border-slate-300 rounded-xl">
              <option value="">Välj...</option>
              {guardians.map((g) => (
                <option key={g.id} value={g.id}>{g.name ?? g.email ?? g.id}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full px-4 py-2 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:bg-slate-400 transition-colors"
          >
            {labels.save}
          </button>
        </form>
      )}

      {kids.length === 0 ? (
        <div className="text-center py-12 text-slate-500">{labels.noKids}</div>
      ) : (
        <div className="space-y-4">
          {kids.map((kid) => {
            const completed = Math.max(0, Math.min(kid.currentLessonOrder - 1, TOTAL_LESSONS));
            const statusColor = STATUS_COLORS[kid.status] || "bg-slate-100 text-slate-800";

            return (
              <div key={kid.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{kid.name}</h3>
                    <p className="text-xs text-slate-500">{kid.guardianName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                    {kid.status === "LOCKED" ? labels.locked : kid.status === "UNLOCKED" ? labels.unlocked : labels.repair}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">
                    {labels.progress}: {completed}/{TOTAL_LESSONS}
                  </p>
                  <div className="flex gap-1">
                    {Array.from({ length: TOTAL_LESSONS }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i < completed ? "bg-sky-500" : "bg-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={kid.status}
                    onChange={(e) => handleStatusChange(kid.id, e.target.value)}
                    disabled={isPending}
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="LOCKED">{labels.locked}</option>
                    <option value="UNLOCKED">{labels.unlocked}</option>
                    <option value="REPAIR">{labels.repair}</option>
                  </select>
                  <button
                    onClick={() => handleReset(kid.id)}
                    disabled={isPending}
                    className="px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {labels.reset}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
