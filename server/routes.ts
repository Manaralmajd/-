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

  // Seed data from "الرصيد العام" sheet
  try {
    const seedData = {
      "1000228468": { "name": "وفاء العبودي", "balance": 23 },
      "1011545249": { "name": "أمل السويد", "balance": 22 },
      "1044163085": { "name": "علي الدخيل", "balance": 29 },
      "1059734093": { "name": "رنا العثيمين", "balance": 26 },
      "1063567745": { "name": "موضي المطيري", "balance": 21 },
      "1066768324": { "name": "رحاب النفيسة", "balance": 9 },
      "1069019501": { "name": "بشاير السلوم", "balance": 16 },
      "1070449382": { "name": "فاتن الخراز", "balance": 20 },
      "1076741121": { "name": "وصايف القشيميط", "balance": 8 },
      "1081995365": { "name": "وعد البصيلي", "balance": 15 },
      "1082305523": { "name": "سلوى الحمدان", "balance": 16 },
      "1082729680": { "name": "عذاري العليان", "balance": 0 },
      "1083396281": { "name": "شهد الحويس", "balance": 23 },
      "1090617539": { "name": "جوري التركي", "balance": 21 },
      "1093995510": { "name": "نوف العليان", "balance": 15 },
      "1095477939": { "name": "سما الصويان", "balance": 25 },
      "1096274269": { "name": "ندى الخليف", "balance": 25 },
      "1096629835": { "name": "حور الكريداء", "balance": 10 },
      "1097787228": { "name": "رغد الوكر", "balance": 22 },
      "1101558169": { "name": "وسن الموسى", "balance": 21 },
      "1101953741": { "name": "ريم الدحسنه", "balance": 17 },
      "1103208706": { "name": "اسية الغشام ", "balance": 33 },
      "1103656896": { "name": "لمى اليهق", "balance": 22 },
      "1104643166": { "name": "لبنى الصيخان", "balance": 21 },
      "1108164862": { "name": "بشاير الفليو", "balance": 18 },
      "1114181942": { "name": "خلد الشائع", "balance": 21 },
      "1115972299": { "name": "غادة المفيد", "balance": 23 },
      "1116333038": { "name": "دانية المانع", "balance": 19 },
      "1119478608": { "name": "رهف الوكر", "balance": 21 }
    };

    for (const [id, info] of Object.entries(seedData)) {
      const existing = await storage.getEmployeeByEmployeeId(id);
      if (!existing) {
        await storage.createEmployee({
          employeeId: id,
          name: info.name,
          annualLeaveBalance: info.balance
        });
      } else if (existing.annualLeaveBalance !== info.balance) {
        // Update balance if it changed in excel
        await storage.updateEmployeeBalance(id, info.balance);
      }
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }

  return httpServer;
}
