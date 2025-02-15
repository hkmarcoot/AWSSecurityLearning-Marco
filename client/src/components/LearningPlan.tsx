import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { courseData } from "@/lib/courseData";

interface Milestone {
  week: number;
  goals: string[];
}

interface LearningPlanProps {
  difficulty: "beginner" | "intermediate" | "advanced";
  currentWeek?: number;
}

export default function LearningPlan({ difficulty, currentWeek = 0 }: LearningPlanProps) {
  const planData = courseData.learningPath.timeline[difficulty];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Plan - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {planData.weeklyHours} hours per week, {planData.estimatedWeeks} weeks total
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {planData.milestones.map((milestone: Milestone) => (
            <div key={milestone.week} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-none">
                  {milestone.week <= currentWeek ? (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className={cn(
                    "font-medium leading-none",
                    milestone.week <= currentWeek && "text-primary"
                  )}>
                    Week {milestone.week}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {milestone.goals.map((goal, idx) => (
                      <li key={idx} className="list-disc ml-4">{goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {milestone.week < planData.milestones.length && (
                <div className="absolute left-3 top-6 h-full w-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}