import { Users, TrendingUp, Award, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import Topbar from "../components/Topbar";
import KpiCard from "../components/KpiCard";
import PageHeader from "../components/PageHeader";
import ChartCard from "../components/ChartCard";
import {
  students,
  overallAverage,
  overallHighest,
  passPercentage,
  subjectAverages,
  semesterAverages,
} from "../data";

export default function Dashboard() {
  const subjectData = subjectAverages(students);
  const semesterData = semesterAverages(students);

  return (
    <>
      <Topbar />
      <main className="flex-1 px-4 md:px-8 py-6 space-y-6">
        <PageHeader
          title="Welcome back, Faculty"
          subtitle="A snapshot of academic performance across all departments."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Students"
            value={String(students.length)}
            sub="Across 4 departments"
            icon={Users}
            accent="navy"
            trend={{ direction: "up", value: "+4" }}
          />
          <KpiCard
            label="Class Average"
            value={`${overallAverage(students)}%`}
            sub="All subjects, all semesters"
            icon={TrendingUp}
            accent="lavender"
            trend={{ direction: "up", value: "+2.1%" }}
          />
          <KpiCard
            label="Highest Score"
            value={`${overallHighest(students)}`}
            sub="Out of 100"
            icon={Award}
            accent="amber"
          />
          <KpiCard
            label="Pass Percentage"
            value={`${passPercentage(students)}%`}
            sub="Threshold 40%"
            icon={CheckCircle2}
            accent="green"
            trend={{ direction: "up", value: "+1.5%" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard
            title="Subject-wise Average"
            subtitle="Average score per subject (all students)"
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#5a72a6" }} interval={0} angle={-12} textAnchor="end" height={50} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <Tooltip
                  cursor={{ fill: "#f7f5ff" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }}
                />
                <Bar dataKey="average" fill="#9770f0" radius={[6, 6, 0, 0]} name="Average" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Semester Trend"
            subtitle="Average score progression by semester"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={semesterData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9770f0" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#9770f0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" vertical={false} />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="#7c52d6"
                  strokeWidth={2}
                  fill="url(#avgGrad)"
                  name="Average"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard
          title="Recent Students"
          subtitle="Latest records in the system"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-navy-400 border-b border-slate-100">
                  <th className="py-2 pr-4 font-medium">Roll No</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Dept</th>
                  <th className="py-2 pr-4 font-medium">Sem</th>
                  <th className="py-2 pr-4 font-medium">Avg</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 6).map((s) => {
                  const avg = Math.round(s.scores.reduce((a, b) => a + b.score, 0) / s.scores.length);
                  return (
                    <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="py-2.5 pr-4 text-navy-500">{s.rollNo}</td>
                      <td className="py-2.5 pr-4 font-medium text-navy-800">{s.name}</td>
                      <td className="py-2.5 pr-4 text-navy-500">{s.department}</td>
                      <td className="py-2.5 pr-4 text-navy-500">{s.semester}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`chip ${avg >= 75 ? "bg-emerald-50 text-emerald-600" : avg >= 50 ? "bg-lavender-50 text-lavender-700" : "bg-amber-50 text-amber-600"}`}>
                          {avg}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </main>
    </>
  );
}
