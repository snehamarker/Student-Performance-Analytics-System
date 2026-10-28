import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import Topbar from "../components/Topbar";
import PageHeader from "../components/PageHeader";
import ChartCard from "../components/ChartCard";
import Select from "../components/Select";
import {
  students,
  subjectAverages,
  gradeDistribution,
} from "../data";
import { SEMESTERS, SUBJECTS } from "../types";

export default function Performance() {
  const [semester, setSemester] = useState("all");
  const [compareA, setCompareA] = useState<string>(SUBJECTS[0]);
  const [compareB, setCompareB] = useState<string>(SUBJECTS[1]);

  const filteredStudents = useMemo(() => {
    if (semester === "all") return students;
    return students.filter((s) => String(s.semester) === semester);
  }, [semester]);

  const subjectData = useMemo(() => subjectAverages(filteredStudents), [filteredStudents]);
  const gradeData = useMemo(() => gradeDistribution(filteredStudents), [filteredStudents]);

  const comparisonData = useMemo(() => {
    return SEMESTERS.filter((sem) => sem <= 6).map((sem) => {
      const aScores = filteredStudents
        .filter((s) => s.semester >= sem)
        .flatMap((s) => s.scores.filter((sc) => sc.subject === compareA && sc.semester === sem));
      const bScores = filteredStudents
        .filter((s) => s.semester >= sem)
        .flatMap((s) => s.scores.filter((sc) => sc.subject === compareB && sc.semester === sem));
      const aAvg = aScores.length ? Math.round(aScores.reduce((x, y) => x + y.score, 0) / aScores.length) : 0;
      const bAvg = bScores.length ? Math.round(bScores.reduce((x, y) => x + y.score, 0) / bScores.length) : 0;
      return { semester: `Sem ${sem}`, [compareA]: aAvg, [compareB]: bAvg } as Record<string, number | string>;
    }).filter((d) => Number(d[compareA]) > 0 || Number(d[compareB]) > 0);
  }, [filteredStudents, compareA, compareB]);

  const radarData = useMemo(
    () => subjectAverages(students).map((d) => ({ subject: d.subject, average: d.average })),
    []
  );

  return (
    <>
      <Topbar />
      <main className="flex-1 px-4 md:px-8 py-6 space-y-6">
        <PageHeader
          title="Performance Analysis"
          subtitle="Compare subjects, grade distribution and score trends."
          action={
            <Select
              value={semester}
              onChange={setSemester}
              options={[
                { value: "all", label: "All Semesters" },
                ...SEMESTERS.map((s) => ({ value: String(s), label: `Semester ${s}` })),
              ]}
            />
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard
            title="Subject Averages"
            subtitle="Average score per subject (bar)"
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#5a72a6" }} interval={0} angle={-12} textAnchor="end" height={50} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <Tooltip cursor={{ fill: "#f7f5ff" }} contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }} />
                <Bar dataKey="average" fill="#9770f0" radius={[6, 6, 0, 0]} name="Average" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Grade Distribution" subtitle="Count of scores by grade band">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeData}
                  dataKey="count"
                  nameKey="grade"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {gradeData.map((entry) => (
                    <Cell key={entry.grade} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Subject Comparison" subtitle="Compare two subjects across semesters">
            <div className="flex flex-wrap gap-3 mb-4">
              <Select
                label="Subject A"
                value={compareA}
                onChange={setCompareA}
                options={SUBJECTS.map((s) => ({ value: s, label: s }))}
              />
              <Select
                label="Subject B"
                value={compareB}
                onChange={setCompareB}
                options={SUBJECTS.map((s) => ({ value: s, label: s }))}
              />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" vertical={false} />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5a72a6" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey={compareA} fill="#9770f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey={compareB} fill="#5a72a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Subject Strength Radar" subtitle="Overall subject averages (all students)">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} outerRadius={100}>
                <PolarGrid stroke="#eef2f8" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#5a72a6" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#8498c4" }} />
                <Radar dataKey="average" stroke="#7c52d6" fill="#9770f0" fillOpacity={0.35} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f8", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </>
  );
}
