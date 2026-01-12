import { useState } from "react";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { useEmployee, useLeaveRequests } from "@/hooks/use-employees";
import { Search, Loader2, AlertCircle, CalendarDays, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveRequestForm } from "@/components/LeaveRequestForm";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Home() {
  const [queryId, setQueryId] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: employee, isLoading, isError, error } = useEmployee(activeId);
  const { data: requests } = useLeaveRequests(activeId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryId.trim()) {
      setActiveId(queryId.trim());
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 pb-2"
          >
            نظام الموظفات الذكي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            استعلمي عن رصيدك أو قدمي طلب إجازة بكل سهولة
          </motion.p>
        </div>

        <Tabs defaultValue="search" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="search" className="text-lg py-3">استعلام الرصيد</TabsTrigger>
            <TabsTrigger value="request" className="text-lg py-3">طلب إجازة</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <div className="flex flex-col items-center gap-10">
              {/* Search Box */}
              <motion.form 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleSearch}
                className="w-full max-w-md relative group"
              >
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  placeholder="أدخل الرقم الوظيفي هنا..."
                  className="w-full h-16 pr-14 pl-4 rounded-2xl border-2 border-border bg-white shadow-sm text-lg outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 placeholder:text-muted-foreground/50"
                />
                <button
                  type="submit"
                  disabled={!queryId.trim() || isLoading}
                  className="absolute left-2 top-2 bottom-2 bg-primary text-white px-6 rounded-xl font-medium hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "استعلام"}
                </button>
              </motion.form>

              {/* Results Area */}
              <div className="w-full min-h-[200px] space-y-8">
                <AnimatePresence mode="wait">
                  {isError ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-3 text-destructive bg-destructive/5 px-8 py-6 rounded-2xl border border-destructive/20"
                    >
                      <AlertCircle className="w-8 h-8" />
                      <p className="font-medium text-lg">{error instanceof Error ? error.message : "حدث خطأ غير متوقع"}</p>
                    </motion.div>
                  ) : employee ? (
                    <div className="space-y-8 w-full">
                      <StatsCard employee={employee} />
                      
                      {requests && requests.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
                        >
                          <div className="flex items-center gap-2 mb-6 text-primary">
                            <History className="w-6 h-6" />
                            <h3 className="text-xl font-bold">سجل الطلبات السابقة</h3>
                          </div>
                          <div className="space-y-4">
                            {requests.map((req) => (
                              <div key={req.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>{format(new Date(req.startDate), 'dd MMMM yyyy', { locale: ar })}</span>
                                    <span> - </span>
                                    <span>{format(new Date(req.endDate), 'dd MMMM yyyy', { locale: ar })}</span>
                                  </div>
                                  <p className="font-medium">{req.reason || "بدون سبب"}</p>
                                </div>
                                <div className={`px-4 py-1 rounded-full text-xs font-bold ${
                                  req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {req.status === 'approved' ? 'تمت الموافقة' :
                                   req.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="request">
            <LeaveRequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
