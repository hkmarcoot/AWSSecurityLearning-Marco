
import { QueryClient } from "@tanstack/react-query";
import { courseData } from "./courseData";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [path] = queryKey as string[];
        
        if (path.startsWith('/api/modules/')) {
          const moduleId = parseInt(path.split('/')[3]);
          
          if (path.endsWith('/quizzes')) {
            return courseData.quizzes.filter(q => q.moduleId === moduleId);
          } else {
            return courseData.modules.find(m => m.id === moduleId);
          }
        }
        
        if (path === '/api/modules') {
          return courseData.modules;
        }
        
        if (path === '/api/progress') {
          return [];
        }
        
        throw new Error(`Unknown query path: ${path}`);
      }
    }
  }
});

export const apiRequest = async (method: string, path: string, body?: any) => {
  if (path.includes('submit-quiz')) {
    const moduleId = parseInt(path.split('/')[3]);
    const quizzes = courseData.quizzes.filter(q => q.moduleId === moduleId);
    let correctAnswers = 0;
    
    Object.entries(body.answers).forEach(([quizId, answer]) => {
      const quiz = quizzes.find(q => q.id === parseInt(quizId));
      if (quiz && quiz.correctAnswer === answer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quizzes.length) * 100);
    return { json: () => ({ score }) };
  }
  
  throw new Error(`Unknown API path: ${path}`);
};
