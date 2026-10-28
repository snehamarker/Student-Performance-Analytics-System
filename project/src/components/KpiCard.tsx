import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: { direction: "up" | "down"; value: string };
  accent?: "navy" | "lavender" | "green" | "amber";
}

const ACCENTS: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  navy: "bg-navy-50 text-navy-700",
  lavender: "bg-lavender-50 text-lavender-700",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  accent = "navy",
}: KpiCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3 transition-shadow hover:shadow-cardLg">
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${ACCENTS[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={`chip ${
              trend.direction === "up"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-500"
            }`}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-navy-400">{label}</p>
        <p className="text-2xl font-semibold text-navy-800 mt-1">{value}</p>
        {sub && <p className="text-xs text-navy-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
