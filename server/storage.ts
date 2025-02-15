import { users, modules, quizzes, progress, type User, type InsertUser, type Module, type Quiz, type Progress, type InsertProgress } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getModules(): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  getQuizzesByModule(moduleId: number): Promise<Quiz[]>;
  getProgress(userId: number): Promise<Progress[]>;
  updateProgress(data: InsertProgress): Promise<Progress>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getModules(): Promise<Module[]> {
    return await db.select().from(modules).orderBy(modules.order);
  }

  async getModule(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  async getQuizzesByModule(moduleId: number): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.moduleId, moduleId));
  }

  async getProgress(userId: number): Promise<Progress[]> {
    return await db.select().from(progress).where(eq(progress.userId, userId));
  }

  async updateProgress(data: InsertProgress): Promise<Progress> {
    const [result] = await db.insert(progress).values(data).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();