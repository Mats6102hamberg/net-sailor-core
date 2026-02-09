"use client";

import { captainLogin } from "@/app/[locale]/familj/captain/actions";
import { useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";

interface Kid {
  id: string;
  name: string;
}

interface CaptainLoginFormProps {
  kids: Kid[];
  locale: Locale;
  labels: {
    chooseProfile: string;
    selectName: string;
    enterPin: string;
    pinHelp: string;
    loggingIn: string;
    setSail: string;
    pinSecure: string;
  };
}

export function CaptainLoginForm({ kids, locale, labels }: CaptainLoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<{
    message: string;
    code?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("locale", locale);

    startTransition(async () => {
      try {
        const result = await captainLogin(formData);
        if (result?.ok === false) {
          setError({ message: result.message, code: result.code });
          return;
        }
      } catch (err) {
        if (err instanceof Error && "digest" in err) {
          // Next.js redirect - let it propagate
          throw err;
        }
        setError({
          message: err instanceof Error ? err.message : "Inloggningen misslyckades.",
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="kidId" className="block text-sm font-medium text-slate-700 mb-2">
            {labels.chooseProfile}
          </label>
          <select
            id="kidId"
            name="kidId"
            required
            disabled={isPending}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-100 text-lg"
          >
            <option value="">{labels.selectName}</option>
            {kids.map((kid) => (
              <option key={kid.id} value={kid.id}>
                {kid.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pin" className="block text-sm font-medium text-slate-700 mb-2">
            {labels.enterPin}
          </label>
          <input
            type="password"
            id="pin"
            name="pin"
            required
            pattern="\d{4}"
            maxLength={4}
            disabled={isPending}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-100 text-lg text-center tracking-widest"
            placeholder="----"
            inputMode="numeric"
          />
          <p className="mt-2 text-xs text-slate-500">{labels.pinHelp}</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 text-center">{error.message}</p>
            {error.code && (
              <p className="text-xs text-slate-400 text-center mt-1">Kod: {error.code}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold text-lg hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? labels.loggingIn : labels.setSail}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          {labels.pinSecure}
        </p>
      </div>
    </div>
  );
}
