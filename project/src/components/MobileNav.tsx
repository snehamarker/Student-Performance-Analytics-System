import { NavLink } from "react-router-dom";
import { LayoutDashboard, Table2, BarChart3, FileText, Lightbulb } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Records", icon: Table2, end: false },
  { to: "/performance", label: "Analysis", icon: BarChart3, end: false },
  { to: "/report", label: "Report", icon: FileText, end: false },
  { to: "/insights", label: "Insights", icon: Lightbulb, end: false },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-100 flex justify-around py-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium ${
                isActive ? "text-navy-800" : "text-navy-400"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
