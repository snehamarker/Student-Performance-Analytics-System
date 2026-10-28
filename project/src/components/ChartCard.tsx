import type { ReactNode } from "react";

export default function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-navy-800">{title}</h3>
        {subtitle && <p className="text-xs text-navy-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
