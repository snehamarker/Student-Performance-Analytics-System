import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";

const TITLES: Record<string, string> = {
  "/": "Dashboard Overview",
  "/students": "Student Records",
  "/performance": "Performance Analysis",
  "/report": "Individual Student Report",
  "/insights": "Insights & Recommendations",
};

export default function Topbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "Analytics";

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur border-b border-slate-100 flex items-center gap-4 px-4 md:px-8">
      <h1 className="text-lg font-semibold text-navy-800">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        {onSearch && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-300" />
            <input
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search students..."
              className="w-56 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-lavender-200"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-lavender-100 flex items-center justify-center text-xs font-semibold text-lavender-700">
            FA
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-navy-700">Faculty Admin</p>
            <p className="text-[11px] text-navy-400">Department of CSE</p>
          </div>
        </div>
      </div>
    </header>
  );
}
