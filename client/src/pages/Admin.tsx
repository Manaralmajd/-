import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useCreateEmployee } from "@/hooks/use-employees";
import { UserPlus, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Admin() {
  const { toast } = useToast();
  const createEmployee = useCreateEmployee();
  
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    annualLeaveBalance: "30"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee.mutateAsync({
        employeeId: formData.employeeId,
        name: formData.name,
        annualLeaveBalance: parseInt(formData.annualLeaveBalance)
      });
      
      toast({
        title: "تمت العملية بنجاح",
        description: `تم إضافة الموظف ${formData.name} بنجاح`,
        className: "bg-green-50 border-green-200 text-green-800",
      });

      setFormData({ employeeId: "", name: "", annualLeaveBalance: "30" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في إضافة الموظف",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إضافة موظف جديد</h1>
            <p className="text-muted-foreground mt-2">أدخل بيانات الموظف لإضافته للنظام</p>
          </div>
          <Link href="/">
            <button className="p-3 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                الرقم الوظيفي <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="مثال: EMP-001"
                value={formData.employeeId}
                onChange={e => setFormData({...formData, employeeId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                اسم الموظف <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="الاسم الثلاثي"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                رصيد الإجازة السنوي <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min="0"
                value={formData.annualLeaveBalance}
                onChange={e => setFormData({...formData, annualLeaveBalance: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={createEmployee.isPending}
                className="w-full py-4 rounded-xl font-bold text-lg bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:transform-none transition-all flex items-center justify-center gap-2"
              >
                {createEmployee.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    إضافة الموظف
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 text-sm">تأكد من الرقم الوظيفي</h4>
              <p className="text-xs text-blue-700 mt-1">يجب أن يكون الرقم الوظيفي فريداً ولا يمكن تكراره في النظام.</p>
            </div>
          </div>
          <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-yellow-900 text-sm">الرصيد الافتراضي</h4>
              <p className="text-xs text-yellow-700 mt-1">الرصيد الافتراضي هو 30 يوماً ويمكن تعديله حسب الحاجة.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
