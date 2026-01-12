import { useState } from "react";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { useEmployee } from "@/hooks/use-employees";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [queryId, setQueryId] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: employee, isLoading, isError, error } = useEmployee(activeId);

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
            استعلام رصيد الإجازات
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            أدخل الرقم الوظيفي أدناه للاطلاع على تفاصيل رصيدك السنوي
          </motion.p>
        </div>

        {/* Search Box */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
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
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "استعلام"
            )}
          </button>
        </motion.form>

        {/* Results Area */}
        <div className="w-full min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3 text-destructive bg-destructive/5 px-8 py-6 rounded-2xl border border-destructive/20"
              >
                <AlertCircle className="w-8 h-8" />
                <p className="font-medium text-lg">{error instanceof Error ? error.message : "حدث خطأ غير متوقع"}</p>
              </motion.div>
            ) : employee ? (
              <StatsCard key="result" employee={employee} />
            ) : !isLoading && activeId ? (
               // Should be caught by error but fallback just in case
               <div className="text-muted-foreground">لا توجد بيانات</div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
