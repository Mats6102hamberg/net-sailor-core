interface AppFooterProps {
  tagline: string;
}

export default function AppFooter({ tagline }: AppFooterProps) {
  return (
    <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200">
      Net Sailor Core &middot; {tagline}
    </footer>
  );
}
