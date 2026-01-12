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
      return res.status(404).json({ message: "الموظف غير موجود" });
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

  app.post(api.leaveRequests.create.path, async (req, res) => {
    try {
      const input = api.leaveRequests.create.input.parse(req.body);
      const employee = await storage.getEmployeeByEmployeeId(input.employeeId);
      if (!employee) {
        return res.status(400).json({ message: "الموظف غير موجود" });
      }
      const request = await storage.createLeaveRequest(input);
      res.status(201).json(request);
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

  app.get(api.leaveRequests.list.path, async (req, res) => {
    const { employeeId } = req.params;
    const requests = await storage.getLeaveRequestsByEmployeeId(employeeId);
    res.json(requests);
  });

  // Seed data from Excel analysis
  try {
    const seedData = {
      "1011545249": { name: "أمل السويد", balance: 30 },
      "1069019501": { name: "بشاير السلوم", balance: 30 },
      "1070449382": { name: "فاتن الخراز", balance: 29 }, // 30 - 1
      "1081995365": { name: "وعد البصيلي", balance: 30 },
      "1090617539": { name: "جوري التركي", balance: 30 },
      "1093995510": { name: "نوف العليان", balance: 29 }, // 30 - 1
      "1095477939": { name: "سما الصويان", balance: 30 },
      "1108164862": { name: "بشاير الفليو", balance: 30 }
    };

    for (const [id, info] of Object.entries(seedData)) {
      const existing = await storage.getEmployeeByEmployeeId(id);
      if (!existing) {
        await storage.createEmployee({
          employeeId: id,
          name: info.name,
          annualLeaveBalance: info.balance
        });
      }
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }

  return httpServer;
}
