import { type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/server";

interface BorisProps {
  locale: Locale;
  mood?: "happy" | "encourage" | "warn" | "safety";
}

const moodStyles = {
  happy: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    emoji: "😊",
  },
  encourage: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-800",
    emoji: "💪",
  },
  warn: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    emoji: "🤔",
  },
  safety: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-800",
    emoji: "💙",
  },
};

export default async function Boris({ locale, mood = "happy" }: BorisProps) {
  const messages = (await getMessages(locale)) as Record<string, Record<string, string>>;
  const boris = messages.boris;
  const style = moodStyles[mood];

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-2xl p-6 max-w-md mx-auto animate-fade-in`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0 animate-bounce-slow">🐙</div>
        <div className={`${style.text} space-y-1`}>
          <p className="font-bold text-base">{boris.greeting}</p>
          <p className="text-sm leading-relaxed opacity-90">{boris.intro}</p>
        </div>
      </div>
    </div>
  );
}
