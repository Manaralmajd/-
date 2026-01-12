import { useState } from "react";
import { useCreateLeaveRequest } from "@/hooks/use-employees";
import { Calendar, Loader2, Send, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function LeaveRequestForm() {
  const { toast } = useToast();
  const createLeave = useCreateLeaveRequest();
  
  const [formData, setFormData] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLeave.mutateAsync(formData);
      
      toast({
        title: "تم إرسال الطلب",
        description: "تم تقديم طلب الإجازة بنجاح وهو قيد المراجعة",
        className: "bg-green-50 border-green-200 text-green-800",
      });

      setFormData({ employeeId: "", startDate: "", endDate: "", reason: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في إرسال الطلب",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 w-full max-w-2xl mx-auto"
    >
      <div className="mb-6 flex items-center gap-3 text-primary">
        <Calendar className="w-8 h-8" />
        <div>
          <h2 className="text-2xl font-bold">تقديم طلب إجازة</h2>
          <p className="text-muted-foreground text-sm">املئي النموذج أدناه لتقديم طلب جديد</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">الرقم الوظيفي</label>
            <input
              required
              type="text"
              placeholder="مثال: 1001"
              value={formData.employeeId}
              onChange={e => setFormData({...formData, employeeId: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">تاريخ البدء</label>
            <input
              required
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
            <input
              required
              type="date"
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">سبب الإجازة</label>
          <div className="relative">
            <FileText className="absolute top-3 right-3 w-5 h-5 text-muted-foreground" />
            <textarea
              placeholder="اختياري: اذكري سبب الإجازة..."
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all min-h-[120px] resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createLeave.isPending}
          className="w-full py-4 rounded-xl font-bold text-lg bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:transform-none transition-all flex items-center justify-center gap-2"
        >
          {createLeave.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              إرسال الطلب
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
