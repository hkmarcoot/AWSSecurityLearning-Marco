import { pgTable, text, serial, integer, boolean, jsonb, index, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  progress: jsonb("progress").default({}).notNull(),
  currentModule: integer("current_module").references(() => modules.id),
  startDate: timestamp("start_date"),
  lastActive: timestamp("last_active"),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  difficulty: text("difficulty").notNull().default('beginner'),
  content: jsonb("content").notNull(),
  prerequisites: integer("prerequisites").array(),
  estimatedHours: integer("estimated_hours").notNull().default(2),
});

export const learningPlan = pgTable("learning_plan", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  targetDate: timestamp("target_date"),
  weeklyHours: integer("weekly_hours").notNull().default(5),
  status: text("status").notNull().default('active'),
});

export const modulesRelations = relations(modules, ({ many }) => ({
  quizzes: many(quizzes),
  progress: many(progress),
}));

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
});

export const quizzesRelations = relations(quizzes, ({ one }) => ({
  module: one(modules, {
    fields: [quizzes.moduleId],
    references: [modules.id],
  }),
}));

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  completed: boolean("completed").default(false).notNull(),
  quizScore: integer("quiz_score"),
});

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [progress.moduleId],
    references: [modules.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProgressSchema = createInsertSchema(progress);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type User = typeof users.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type Progress = typeof progress.$inferSelect;