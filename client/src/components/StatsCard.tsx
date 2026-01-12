import { motion } from "framer-motion";
import { User, Calendar, CreditCard } from "lucide-react";
import type { Employee } from "@shared/schema";

interface StatsCardProps {
  employee: Employee;
}

export function StatsCard({ employee }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
        {/* Decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-blue-400 to-accent" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar / Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white shadow-xl flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-slate-400" />
          </div>

          <div className="flex-1 text-center md:text-right w-full">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                <CreditCard className="w-3.5 h-3.5" />
                <span>الرقم الوظيفي: {employee.employeeId}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-5 text-white shadow-lg shadow-primary/20">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">الرصيد السنوي المتاح</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold tracking-tight">{employee.annualLeaveBalance}</span>
                  <span className="text-lg font-medium mb-1 opacity-90">يوم</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-center">
                <span className="text-slate-500 text-sm mb-1">آخر تحديث للبيانات</span>
                <span className="text-slate-900 font-semibold dir-ltr text-right">
                  {new Date().toLocaleDateString('ar-SA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
