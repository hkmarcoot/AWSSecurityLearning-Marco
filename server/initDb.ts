import { courseData } from "../client/src/lib/courseData";
import { modules, quizzes } from "@shared/schema";
import { db } from "./db";

export async function initializeDatabase() {
  try {
    // Insert modules
    await db.insert(modules).values(courseData.modules);
    
    // Insert quizzes
    await db.insert(quizzes).values(courseData.quizzes);
    
    console.log('Database initialized with sample data');
  } catch (error) {
    // Log error but don't throw, as we want the server to start even if init fails
    console.error('Error initializing database:', error);
  }
}
