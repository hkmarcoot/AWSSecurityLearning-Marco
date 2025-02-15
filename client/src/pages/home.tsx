import { useQuery } from "@tanstack/react-query";
import { type Module } from "@shared/schema";
import ModuleCard from "@/components/ModuleCard";
import ProgressBar from "@/components/ProgressBar";
import LearningPlan from "@/components/LearningPlan";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { data: modules, isLoading, error } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-8">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-8 text-destructive">
          Error loading modules. Please try again.
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">AWS Security Learning Path</h1>
        <p className="text-muted-foreground">
          Master AWS security, Terraform, and DevOps practices through hands-on exercises
        </p>
      </div>

      <ProgressBar completed={0} total={modules?.length || 0} />

      <Tabs defaultValue="learning-plan">
        <TabsList>
          <TabsTrigger value="learning-plan">Learning Plan</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>
        <TabsContent value="learning-plan" className="mt-6">
          <div className="space-y-6">
            <LearningPlan difficulty="beginner" currentWeek={0} />
            <LearningPlan difficulty="intermediate" currentWeek={0} />
            <LearningPlan difficulty="advanced" currentWeek={0} />
          </div>
        </TabsContent>
        <TabsContent value="modules" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules?.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}