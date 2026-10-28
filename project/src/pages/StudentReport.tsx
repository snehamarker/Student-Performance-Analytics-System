import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { ArrowLeft, Mail, IdCard, Building2, BadgeCheck } from "lucide-react";
import Topbar from "../components/Topbar";
import PageHeader from "../components/PageHeader";
import ChartCard from "../components/ChartCard";
import Select from "../components/Select";
import { students, averageScore, highestScore } from "../data";
import { SUBJECTS, type Student } from "../types";

function gradeFor(score: number): string {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "bg-emerald-50 text-emerald-600";
    case "B":
      return "bg-lavender-50 text-lavender-700";
    case "C":
      return "bg-navy-50 text-navy-600";
    case "D":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-rose-50 text-rose-500";
  }
}

export default function StudentReport() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id") ?? students[0].id;
  const [subjectFilter, setSubjectFilter] = useState("all");

  const student: Student | undefined = useMemo(
    () => students.find((s) => s.id === selectedId),
    [selectedId]
  );

  const filteredScores = useMemo(() => {
    if (!student) return [];
    if (subjectFilter === "all") return student.scores;
    return student.scores.filter((s) => s.subject === subjectFilter);
  }, [student, subjectFilter]);

  if (!student) {
    return (
      <>
        <Topbar />
        <main className="flex-1 px-4 md:px-8 py-6">
          <p className="text-navy-500">Student not found.</p>
          <Link to="/students" className="btn-primary mt-4">Back to records</Link>
        </main>
      </>
    );
  }

  const avg = averageScore(student);
  const high = highestScore(student);

  const subjectBarData = SUBJECTS.map((subject) => {
    const all = student.scores.filter((s) => s.subject === subject);
    const a = all.length ? Math.round(all.reduce((x, y) => x + y.score, 0) / all.length) : 0;
    return { subject, average: a };
  });

  const trendData = Array.from(new Set(student.scores.map((s) => s.semester)))
    .sort()
    .map((sem) => {
      const all = student.scores.filter((s) => s.semester === sem);
      const a = Math.round(all.reduce((x, y) => x + y.score, 0) / all.length);
      return { semester: `Sem ${sem}`, average: a };
    });

  return (
    <>
      <Topbar />
      <main className="flex-1 px-4 md:px-8 py-6 space-y-6">
        <Link to="/students" className="inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-700">
          <ArrowLeft className="h-4 w-4" /> Back to records
        </Link>

        <PageHeader title="Individual Student Report" subtitle="Detailed academic breakdown for the selected student." />

        <div className="card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-lavender-100 flex items-center justify-center text-lg font-semibold text-lavender-700">
                {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-800">{student.name}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-navy-500">
                  <span className="inline-flex items-center gap-1.5"><IdCard className="h-4 w-4" /> {student.rollNo}</span>
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" /> {student.email}</span>
                  <span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {student.department}</span>
                  <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4" /> {student.attendance}% attendance</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-xs text-navy-400">Average</p>
                <p className="text-xl font-semibold text-navy-800">{avg}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-navy-400">Highest</p>
                <p className="text-xl font-semibold text-navy-800">{high}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-navy-400">Attendance</p>
                <p className="text-xl font-semibold text-navy-800">{student.attendance}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <Select
            label="Filter subject"
            value={subjectFilter}
            onChange={setSubjectFilter}
            options={[
              { value: "all", label: "All Subjects" },
              ...SUBJECTS.map((s) => ({ value: s, label: s })),
            ]}
          />
          <Select
            label="Select student"
            value={student.id}
            onChange={(v) => setParams({ id: v })}
            options={students.map((s) => ({ value: s.id, label: `${s.rollNo} — ${s.name}` }))}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Subject Averages" subtitle={`${student.name}'s average per subject`}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={subjectBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: "#5a72a6" }} interval={0} angle={-12} textAnchor="end" height={50} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <Tooltip cursor={{ fill: "#f7f5ff" }} contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }} />
                <Bar dataKey="average" fill="#9770f0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Score Trend" subtitle="Semester-wise average progression">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" vertical={false} />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="average" stroke="#7c52d6" strokeWidth={2.5} dot={{ r: 4, fill: "#7c52d6" }} name="Average" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-navy-800">Score Breakdown</h3>
            <p className="text-xs text-navy-400 mt-0.5">All subject scores for {student.name}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/60">
                <tr className="text-left text-navy-400">
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Semester</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.map((sc, i) => {
                  const grade = gradeFor(sc.score);
                  return (
                    <tr key={`${sc.subject}-${sc.semester}-${i}`} className="border-t border-slate-50 hover:bg-slate-50/40">
                      <td className="px-5 py-3 font-medium text-navy-800">{sc.subject}</td>
                      <td className="px-5 py-3 text-navy-500">Semester {sc.semester}</td>
                      <td className="px-5 py-3 text-navy-700">{sc.score} / {sc.maxScore}</td>
                      <td className="px-5 py-3">
                        <span className={`chip ${gradeColor(grade)}`}>Grade {grade}</span>
                      </td>
                    </tr>
                  );
                })}
                {filteredScores.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-navy-400">No scores for this filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
