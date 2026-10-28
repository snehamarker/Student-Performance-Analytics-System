import { useMemo } from "react";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  Target,
  BookOpen,
} from "lucide-react";
import Topbar from "../components/Topbar";
import PageHeader from "../components/PageHeader";
import ChartCard from "../components/ChartCard";
import {
  students,
  subjectAverages,
  averageScore,
} from "../data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface Insight {
  type: "positive" | "warning" | "info";
  title: string;
  detail: string;
  icon: typeof TrendingUp;
}

export default function Insights() {
  const subjectAvgs = useMemo(() => subjectAverages(students), []);

  const weakestSubject = useMemo(
    () => [...subjectAvgs].sort((a, b) => a.average - b.average)[0],
    [subjectAvgs]
  );
  const strongestSubject = useMemo(
    () => [...subjectAvgs].sort((a, b) => b.average - a.average)[0],
    [subjectAvgs]
  );

  const atRiskStudents = useMemo(() => {
    return students
      .map((s) => ({ student: s, avg: averageScore(s) }))
      .filter((x) => x.avg < 50)
      .sort((a, b) => a.avg - b.avg);
  }, []);

  const topPerformers = useMemo(() => {
    return students
      .map((s) => ({ student: s, avg: averageScore(s) }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }, []);

  const insights: Insight[] = [
    {
      type: "positive",
      title: `${strongestSubject.subject} is the strongest subject`,
      detail: `Average of ${strongestSubject.average}% — consider advanced electives and peer-teaching programs to leverage this strength.`,
      icon: TrendingUp,
    },
    {
      type: "warning",
      title: `${weakestSubject.subject} needs attention`,
      detail: `Lowest average at ${weakestSubject.average}%. Recommend remedial sessions, additional practice material and targeted mentoring.`,
      icon: AlertTriangle,
    },
    {
      type: "info",
      title: `${atRiskStudents.length} students are at risk`,
      detail: `Students below 50% average should be flagged for academic advising and a personalised improvement plan.`,
      icon: GraduationCap,
    },
    {
      type: "info",
      title: "Attendance correlates with performance",
      detail: `Students with attendance above 85% consistently outperform peers — reinforce attendance policy.`,
      icon: Target,
    },
  ];

  const recs = [
    {
      title: "Schedule remedial classes",
      detail: `Organise focused weekend sessions for ${weakestSubject.subject} and ${subjectAvgs.sort((a, b) => a.average - b.average)[1]?.subject ?? "core subjects"}.`,
      icon: BookOpen,
    },
    {
      title: "Launch a peer mentoring program",
      detail: "Pair top performers with at-risk students for weekly guided study groups.",
      icon: GraduationCap,
    },
    {
      title: "Set semester improvement targets",
      detail: "Aim for a 5% increase in the weakest subject's average over the next semester.",
      icon: Target,
    },
    {
      title: "Introduce continuous assessment",
      detail: "Short weekly quizzes in low-performing subjects to catch gaps early.",
      icon: Lightbulb,
    },
  ];

  const barColor = (avg: number) =>
    avg >= 75 ? "#3d5487" : avg >= 60 ? "#9770f0" : avg >= 45 ? "#ac8efb" : "#e07b9b";

  return (
    <>
      <Topbar />
      <main className="flex-1 px-4 md:px-8 py-6 space-y-6">
        <PageHeader
          title="Insights & Recommendations"
          subtitle="Auto-generated observations based on the current dataset."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => {
            const Icon = ins.icon;
            const accent =
              ins.type === "positive"
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : ins.type === "warning"
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-lavender-50 text-lavender-700 border-lavender-100";
            return (
              <div key={ins.title} className={`card p-5 border ${accent.split(" ").find((c) => c.startsWith("border-"))}`}>
                <div className="flex gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy-800">{ins.title}</h3>
                    <p className="text-sm text-navy-500 mt-1 leading-relaxed">{ins.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="At-Risk Students" subtitle="Students with average below 50%">
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {atRiskStudents.length === 0 && (
                <p className="text-sm text-navy-400">No at-risk students — great!</p>
              )}
              {atRiskStudents.map(({ student, avg }) => (
                <div key={student.id} className="flex items-center justify-between rounded-xl bg-rose-50/50 px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-navy-800">{student.name}</p>
                    <p className="text-xs text-navy-400">{student.rollNo} · {student.department}</p>
                  </div>
                  <span className="chip bg-rose-50 text-rose-500">{avg}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Top Performers" subtitle="Top 5 by average score">
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {topPerformers.map(({ student, avg }, i) => (
                <div key={student.id} className="flex items-center justify-between rounded-xl bg-emerald-50/40 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-700 text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-navy-800">{student.name}</p>
                      <p className="text-xs text-navy-400">{student.rollNo} · {student.department}</p>
                    </div>
                  </div>
                  <span className="chip bg-emerald-50 text-emerald-600">{avg}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Subject Performance Ranking" subtitle="Sorted lowest to highest to highlight gaps">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[...subjectAvgs].sort((a, b) => a.average - b.average)}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#5a72a6" }} />
              <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: "#5a72a6" }} width={120} />
              <Tooltip cursor={{ fill: "#f7f5ff" }} contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }} />
              <Bar dataKey="average" radius={[0, 6, 6, 0]}>
                {[...subjectAvgs].sort((a, b) => a.average - b.average).map((d) => (
                  <Cell key={d.subject} fill={barColor(d.average)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div>
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recs.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="card p-5 flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-navy-50 flex items-center justify-center shrink-0 text-navy-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-800">{r.title}</p>
                    <p className="text-sm text-navy-500 mt-1 leading-relaxed">{r.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
