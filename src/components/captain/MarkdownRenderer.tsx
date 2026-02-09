interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown to HTML conversion for lesson content
  const html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-slate-900 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-900 mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-extrabold text-slate-900 mt-8 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-700">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-700">$2</li>')
    // Paragraphs (lines that aren't headers, lists, or empty)
    .replace(/^(?!<[hl]|<li|$)(.+)$/gm, '<p class="text-slate-700 leading-relaxed mb-3">$1</p>')
    // Empty lines
    .replace(/^\s*$/gm, "");

  return (
    <div
      className="prose prose-slate max-w-none space-y-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
