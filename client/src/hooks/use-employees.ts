import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertEmployee } from "@shared/schema";
import { z } from "zod";

// Fetch employee by ID
export function useEmployee(employeeId: string | null) {
  return useQuery({
    queryKey: [api.employees.getByEmployeeId.path, employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      
      const url = buildUrl(api.employees.getByEmployeeId.path, { employeeId });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) {
        throw new Error("لم يتم العثور على الموظف"); // Employee not found in Arabic
      }
      
      if (!res.ok) {
        throw new Error("حدث خطأ أثناء البحث"); // Generic error
      }
      
      return api.employees.getByEmployeeId.responses[200].parse(await res.json());
    },
    enabled: !!employeeId, // Only run if ID is provided
    retry: false,
  });
}

// Create new employee (for Admin/Testing)
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertEmployee) => {
      const validated = api.employees.create.input.parse(data);
      const res = await fetch(api.employees.create.path, {
        method: api.employees.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("فشل إنشاء الموظف");
      }
      
      return api.employees.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate query for this specific employee if they were just created
      queryClient.invalidateQueries({ 
        queryKey: [api.employees.getByEmployeeId.path, data.employeeId] 
      });
    },
  });
}
