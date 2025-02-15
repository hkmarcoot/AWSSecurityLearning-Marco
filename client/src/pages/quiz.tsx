import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { type Quiz } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function QuizPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const { data: quizzes, isLoading, error } = useQuery<Quiz[]>({
    queryKey: [`/api/modules/${id}/quizzes`],
  });

  const submitMutation = useMutation({
    mutationFn: async (answers: Record<number, number>) => {
      const res = await apiRequest('POST', `/api/modules/${id}/submit-quiz`, {
        answers
      });
      return res.json();
    },
    onSuccess: (data) => {
      const score = data.score;
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${score}% on this quiz.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      navigate(`/module/${id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!quizzes?.length) return <div>No quiz available</div>;

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length !== quizzes.length) {
      toast({
        title: "Warning",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }
    console.log('Submitting answers:', selectedAnswers); 
    submitMutation.mutate(selectedAnswers);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Module Quiz</h1>

      <div className="space-y-8">
        {quizzes.map((quiz, idx) => (
          <div key={quiz.id} className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              {idx + 1}. {quiz.question}
            </h3>

            <RadioGroup
              value={selectedAnswers[quiz.id]?.toString()}
              onValueChange={(value) => {
                console.log('Selected answer:', quiz.id, value); 
                setSelectedAnswers(prev => ({
                  ...prev,
                  [quiz.id]: parseInt(value)
                }));
              }}
            >
              {quiz.options.map((option, optIdx) => (
                <div key={optIdx} className="flex items-center space-x-2">
                  <RadioGroupItem value={optIdx.toString()} id={`q${quiz.id}-${optIdx}`} />
                  <Label htmlFor={`q${quiz.id}-${optIdx}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      <Button 
        className="mt-8 w-full" 
        onClick={handleSubmit}
        disabled={submitMutation.isPending}
      >
        {submitMutation.isPending ? "Submitting..." : "Submit Answers"}
      </Button>
    </div>
  );
}