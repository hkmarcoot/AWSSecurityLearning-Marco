import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className={cn(
        "rounded-lg bg-zinc-950 p-4 overflow-x-auto",
        "text-sm text-zinc-50 [&_*]:font-mono"
      )}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
