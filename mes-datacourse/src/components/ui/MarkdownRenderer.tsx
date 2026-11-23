import React, { useState } from 'react';
import { marked } from 'marked';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Check if content has code blocks that we can extract or enhance
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Configure marked options
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const html = marked.parse(content) as string;

  return (
    <div className={`relative ${className}`}>
      <div
        className="prose prose-slate max-w-none text-navy-800 leading-relaxed text-sm [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-navy-950 [&>h2]:mt-6 [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-navy-900 [&>h3]:mt-4 [&>h3]:mb-2 [&>pre]:bg-navy-950 [&>pre]:text-navy-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:text-xs [&>pre]:font-mono [&>pre]:my-3 [&>blockquote]:border-l-4 [&>blockquote]:border-accent-500 [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:bg-accent-50/50 [&>blockquote]:text-navy-800 [&>blockquote]:rounded-r [&>table]:w-full [&>table]:border-collapse [&>table]:text-xs [&>table]:my-3 [&>table_th]:border-b [&>table_th]:border-navy-200 [&>table_th]:p-2 [&>table_th]:text-left [&>table_td]:border-b [&>table_td]:border-surface-200 [&>table_td]:p-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export const CodeBlockWithCopy: React.FC<{ code: string; language?: string }> = ({
  code,
  language = 'python',
}) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-navy-800 bg-navy-950 text-navy-100 font-mono text-xs shadow-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-navy-900 border-b border-navy-800 text-2xs text-navy-400">
        <span className="uppercase tracking-wider font-semibold">{language}</span>
        <button
          onClick={copy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded text-navy-300 hover:text-white hover:bg-navy-800 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};
