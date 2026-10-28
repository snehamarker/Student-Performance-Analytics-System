import { useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import PageHeader from "../components/PageHeader";
import Select from "../components/Select";
import { students, averageScore } from "../data";
import { SEMESTERS, SUBJECTS } from "../types";

export default function StudentRecords() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("all");
  const [subject, setSubject] = useState("all");
  const [dept, setDept] = useState("all");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesQuery =
        query.trim() === "" ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase());
      const matchesSemester = semester === "all" || String(s.semester) === semester;
      const matchesDept = dept === "all" || s.department === dept;
      const matchesSubject =
        subject === "all" ||
        s.scores.some((sc) => sc.subject === subject && sc.score >= 0);
      return matchesQuery && matchesSemester && matchesDept && matchesSubject;
    });
  }, [query, semester, subject, dept]);

  return (
    <>
      <Topbar />
      <main className="flex-1 px-4 md:px-8 py-6 space-y-6">
        <PageHeader
          title="Student Records"
          subtitle={`${filtered.length} of ${students.length} students shown`}
        />

        <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-medium text-navy-400">Search</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, roll no, email"
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-lavender-200"
              />
            </div>
          </label>
          <Select
            label="Semester"
            value={semester}
            onChange={setSemester}
            options={[
              { value: "all", label: "All Semesters" },
              ...SEMESTERS.map((s) => ({ value: String(s), label: `Semester ${s}` })),
            ]}
          />
          <Select
            label="Subject"
            value={subject}
            onChange={setSubject}
            options={[
              { value: "all", label: "All Subjects" },
              ...SUBJECTS.map((s) => ({ value: s, label: s })),
            ]}
          />
          <Select
            label="Department"
            value={dept}
            onChange={setDept}
            options={[
              { value: "all", label: "All Departments" },
              { value: "CSE", label: "CSE" },
              { value: "ECE", label: "ECE" },
              { value: "IT", label: "IT" },
              { value: "MECH", label: "MECH" },
            ]}
          />
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/60">
                <tr className="text-left text-navy-400">
                  <th className="px-4 py-3 font-medium">Roll No</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Semester</th>
                  <th className="px-4 py-3 font-medium">Attendance</th>
                  <th className="px-4 py-3 font-medium">Avg Score</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const avg = averageScore(s);
                  return (
                    <tr key={s.id} className="border-t border-slate-50 hover:bg-slate-50/40">
                      <td className="px-4 py-3 text-navy-500">{s.rollNo}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy-800">{s.name}</p>
                        <p className="text-xs text-navy-400">{s.email}</p>
                      </td>
                      <td className="px-4 py-3 text-navy-500">{s.department}</td>
                      <td className="px-4 py-3 text-navy-500">{s.semester}</td>
                      <td className="px-4 py-3 text-navy-500">{s.attendance}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={`chip ${
                            avg >= 75
                              ? "bg-emerald-50 text-emerald-600"
                              : avg >= 50
                              ? "bg-lavender-50 text-lavender-700"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {avg}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/report?id=${s.id}`)}
                          className="btn-ghost !px-2.5 !py-1.5"
                          aria-label={`View report for ${s.name}`}
                        >
                          <Eye className="h-4 w-4" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-navy-400">
                      No students match the selected filters.
                    </td>
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
