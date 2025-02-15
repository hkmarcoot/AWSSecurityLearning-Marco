import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { type Module } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CodeBlock from "@/components/CodeBlock";
import { ArrowRight } from "lucide-react";

interface ModuleContent {
  sections: Array<{
    title: string;
    content: string;
    code?: string;
  }>;
}

export default function ModulePage() {
  const { id } = useParams();
  const { data: module, isLoading, error } = useQuery<Module>({
    queryKey: [`/api/modules/${id}`],
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
          <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </Card>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-destructive">
          Error loading module. Please try again.
        </Card>
      </div>
    );
  }

  const content = module.content as ModuleContent;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{module.title}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        {content.sections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="space-y-4">
              <p>{section.content}</p>
              {section.code && <CodeBlock code={section.code} language="typescript" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button asChild>
          <Link href={`/module/${id}/quiz`}>
            Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}