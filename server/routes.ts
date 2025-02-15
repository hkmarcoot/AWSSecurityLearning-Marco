import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProgressSchema } from "@shared/schema";
import { z } from "zod";
import type { Express, Request, Response } from "express";

const quizSubmissionSchema = z.object({
  answers: z.record(z.string(), z.number()).or(z.record(z.number(), z.number())),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/modules", async (req, res) => {
    const modules = await storage.getModules();
    res.json(modules);
  });

  app.get("/api/modules/:id", async (req, res) => {
    const module = await storage.getModule(parseInt(req.params.id));
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.json(module);
  });

  app.get("/api/modules/:id/quizzes", async (req, res) => {
    const quizzes = await storage.getQuizzesByModule(parseInt(req.params.id));
    res.json(quizzes);
  });

  app.post("/api/modules/:id/submit-quiz", async (req: Request, res: Response) => {
    try {
      console.log('Received quiz submission:', req.body); // Debug log
      const { answers } = quizSubmissionSchema.parse(req.body);
      const quizzes = await storage.getQuizzesByModule(parseInt(req.params.id));

      let correctAnswers = 0;
      quizzes.forEach(quiz => {
        const selectedAnswer = answers[quiz.id.toString()] || answers[quiz.id];
        if (selectedAnswer === quiz.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / quizzes.length) * 100);
      console.log('Quiz score:', score); // Debug log

      res.json({ score });
    } catch (error) {
      console.error('Quiz submission error:', error); // Debug log
      res.status(400).json({ message: "Invalid submission", error: String(error) });
    }
  });

  app.get("/api/progress", async (req, res) => {
    res.json([]);
  });

  const httpServer = createServer(app);
  return httpServer;
}