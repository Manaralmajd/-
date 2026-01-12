import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import type { Employee, LeaveRequest, InsertEmployee, InsertLeaveRequest } from "@shared/schema";
import { z } from "zod";

// Fetch employee by ID
export function useEmployee(employeeId: string | null) {
  return useQuery<Employee>({
    queryKey: [api.employees.getByEmployeeId.path, employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error("ID required");
      const res = await fetch(buildUrl(api.employees.getByEmployeeId.path, { employeeId }));
      if (!res.ok) {
        if (res.status === 404) throw new Error("الموظف غير موجود");
        throw new Error("حدث خطأ في الاتصال بالخادم");
      }
      const data = await res.json();
      return api.employees.getByEmployeeId.responses[200].parse(data);
    },
    enabled: !!employeeId,
  });
}

// Create new employee (for Admin/Testing)
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEmployee) => {
      const res = await apiRequest("POST", api.employees.create.path, data);
      const json = await res.json();
      return api.employees.create.responses[201].parse(json);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.employees.getByEmployeeId.path, data.employeeId] });
    },
  });
}

// Fetch leave requests for an employee
export function useLeaveRequests(employeeId: string | null) {
  return useQuery<LeaveRequest[]>({
    queryKey: [api.leaveRequests.list.path, employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      const url = buildUrl(api.leaveRequests.list.path, { employeeId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("فشل في استرجاع سجل الطلبات");
      const data = await res.json();
      return z.array(api.leaveRequests.create.responses[201]).parse(data);
    },
    enabled: !!employeeId,
  });
}

// Create new leave request
export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLeaveRequest) => {
      const res = await apiRequest("POST", api.leaveRequests.create.path, data);
      const json = await res.json();
      return api.leaveRequests.create.responses[201].parse(json);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.leaveRequests.list.path, data.employeeId] });
      queryClient.invalidateQueries({ queryKey: [api.employees.getByEmployeeId.path, data.employeeId] });
    },
  });
}
