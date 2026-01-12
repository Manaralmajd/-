import { Link } from "wouter";
import { Building2, UserPlus } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-tajawal relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10" />

      {/* Header */}
      <header className="py-6 px-4 md:px-8 border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer transition-opacity hover:opacity-80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-none">بوابة الموظفين</h1>
              <p className="text-xs text-muted-foreground mt-1">نظام الخدمات الذاتية</p>
            </div>
          </Link>
          
          <nav>
            <Link href="/admin">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                <UserPlus className="w-4 h-4" />
                <span>إدارة الموظفين</span>
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
        <p>© 2024 نظام الموارد البشرية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
