import { db } from "./db";
import { employees, type Employee, type InsertEmployee, leaveRequests, type LeaveRequest, type InsertLeaveRequest } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(employeeId: string, updates: Partial<InsertEmployee>): Promise<Employee>;
  createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest>;
  getLeaveRequestsByEmployeeId(employeeId: string): Promise<LeaveRequest[]>;
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

  async updateEmployee(employeeId: string, updates: Partial<InsertEmployee>): Promise<Employee> {
    const [employee] = await db.update(employees)
      .set(updates)
      .where(eq(employees.employeeId, employeeId))
      .returning();
    return employee;
  }

  async createLeaveRequest(insertLeaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const [request] = await db.insert(leaveRequests).values(insertLeaveRequest).returning();
    return request;
  }

  async getLeaveRequestsByEmployeeId(employeeId: string): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, employeeId));
  }
}

export const storage = new DatabaseStorage();
