import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Table2,
  BarChart3,
  FileText,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Student Records", icon: Table2, end: false },
  { to: "/performance", label: "Performance Analysis", icon: BarChart3, end: false },
  { to: "/report", label: "Student Report", icon: FileText, end: false },
  { to: "/insights", label: "Insights", icon: Lightbulb, end: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-slate-100">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-700">
          <GraduationCap className="h-5 w-5 text-lavender-300" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-navy-800">SP Analytics</p>
          <p className="text-[11px] text-navy-400">Student Performance</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-lavender-50 text-navy-800"
                    : "text-navy-500 hover:bg-slate-50 hover:text-navy-700"
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-[11px] text-navy-300">College Mini Project</p>
        <p className="text-[11px] text-navy-300">Sample data · Prototype</p>
      </div>
    </aside>
  );
}
