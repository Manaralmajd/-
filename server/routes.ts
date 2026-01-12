import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.employees.getByEmployeeId.path, async (req, res) => {
    const { employeeId } = req.params;
    const employee = await storage.getEmployeeByEmployeeId(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  });

  app.post(api.employees.create.path, async (req, res) => {
    try {
      const input = api.employees.create.input.parse(req.body);
      const employee = await storage.createEmployee(input);
      res.status(201).json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data
  try {
    const testEmployeeId = "1001";
    const existing = await storage.getEmployeeByEmployeeId(testEmployeeId);
    if (!existing) {
      console.log("Seeding database...");
      await storage.createEmployee({
        employeeId: "1001",
        name: "سارة أحمد",
        annualLeaveBalance: 24
      });
      await storage.createEmployee({
        employeeId: "1002",
        name: "نورة محمد",
        annualLeaveBalance: 15
      });
       await storage.createEmployee({
        employeeId: "1003",
        name: "منى علي",
        annualLeaveBalance: 30
      });
      console.log("Seeding complete.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }

  return httpServer;
}
