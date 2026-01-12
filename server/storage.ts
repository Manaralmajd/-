import { db } from "./db";
import { employees, type Employee, type InsertEmployee } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
}

export class DatabaseStorage implements IStorage {
  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.employeeId, employeeId));
    return employee;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db.insert(employees).values(insertEmployee).returning();
    return employee;
  }
}

export const storage = new DatabaseStorage();
