import { z } from 'zod';
import { insertEmployeeSchema, employees, insertLeaveRequestSchema, leaveRequests } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  employees: {
    getByEmployeeId: {
      method: 'GET' as const,
      path: '/api/employees/:employeeId',
      responses: {
        200: z.custom<typeof employees.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/employees',
      input: insertEmployeeSchema,
      responses: {
        201: z.custom<typeof employees.$inferSelect>(),
      },
    },
  },
  leaveRequests: {
    create: {
      method: 'POST' as const,
      path: '/api/leave-requests',
      input: insertLeaveRequestSchema,
      responses: {
        201: z.custom<typeof leaveRequests.$inferSelect>(),
        400: errorSchemas.notFound,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/leave-requests/:employeeId',
      responses: {
        200: z.array(z.custom<typeof leaveRequests.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
