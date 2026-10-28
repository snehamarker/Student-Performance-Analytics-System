import { SEMESTERS, SUBJECTS, type Student, type SubjectScore, type Semester } from "./types";

// Fictional sample data for visual prototyping only.
// Replace by connecting to your Python backend.

const DEPARTMENTS = ["CSE", "ECE", "IT", "MECH"];

const FIRST_NAMES = [
  "Aarav", "Diya", "Vivaan", "Ananya", "Reyansh", "Ishaan", "Saanvi", "Advik",
  "Kabir", "Myra", "Arjun", "Aadhya", "Rohan", "Sara", "Karthik", "Neha",
  "Dhruv", "Anika", "Riya", "Varun", "Ira", "Krish", "Tara", "Nikhil",
  "Meera", "Aryan", "Zara", "Rahul", "Pari", "Siddharth",
];

const LAST_NAMES = [
  "Sharma", "Nair", "Reddy", "Iyer", "Kapoor", "Menon", "Gupta", "Rao",
  "Pillai", "Bose", "Verma", "Singh", "Das", "Joshi", "Mehta", "Chowdhury",
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

const rand = seeded(42);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function makeScores(studentSem: Semester): SubjectScore[] {
  const scores: SubjectScore[] = [];
  for (const subject of SUBJECTS) {
    for (const sem of SEMESTERS) {
      if (sem > studentSem) continue;
      // base ability bias per subject to create realistic spread
      const bias = (SUBJECTS.indexOf(subject) % 3) * 4;
      const score = Math.min(100, Math.max(35, randInt(55, 92) + bias - randInt(0, 12)));
      scores.push({ subject, semester: sem, score, maxScore: 100 });
    }
  }
  return scores;
}

function buildStudents(count: number): Student[] {
  const students: Student[] = [];
  for (let i = 0; i < count; i++) {
    const semester = pick(SEMESTERS);
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const dept = pick(DEPARTMENTS);
    const id = `STU${(i + 1).toString().padStart(3, "0")}`;
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}.${dept.toLowerCase()}@college.edu`;
    students.push({
      id,
      rollNo: `${dept}-${(i + 1).toString().padStart(3, "0")}`,
      name,
      email,
      department: dept,
      semester,
      attendance: randInt(72, 98),
      scores: makeScores(semester),
    });
  }
  return students;
}

export const students: Student[] = buildStudents(48);

// Derived helpers used across pages

export function averageScore(student: Student): number {
  if (student.scores.length === 0) return 0;
  return Math.round(
    student.scores.reduce((sum, s) => sum + s.score, 0) / student.scores.length
  );
}

export function highestScore(student: Student): number {
  return student.scores.reduce((max, s) => Math.max(max, s.score), 0);
}

export function isPassing(score: number, threshold = 40): boolean {
  return score >= threshold;
}

export function overallAverage(allStudents: Student[]): number {
  const all = allStudents.flatMap((s) => s.scores);
  if (all.length === 0) return 0;
  return Math.round(all.reduce((sum, s) => sum + s.score, 0) / all.length);
}

export function overallHighest(allStudents: Student[]): number {
  return allStudents.reduce((max, s) => Math.max(max, highestScore(s)), 0);
}

export function passPercentage(allStudents: Student[], threshold = 40): number {
  const all = allStudents.flatMap((s) => s.scores);
  if (all.length === 0) return 0;
  const passed = all.filter((s) => s.score >= threshold).length;
  return Math.round((passed / all.length) * 100);
}

export function subjectAverages(allStudents: Student[]): { subject: string; average: number }[] {
  return SUBJECTS.map((subject) => {
    const all = allStudents.flatMap((s) => s.scores.filter((sc) => sc.subject === subject));
    const avg =
      all.length === 0 ? 0 : Math.round(all.reduce((sum, s) => sum + s.score, 0) / all.length);
    return { subject, average: avg };
  });
}

export function semesterAverages(
  allStudents: Student[]
): { semester: string; average: number }[] {
  return SEMESTERS.map((sem) => {
    const all = allStudents.flatMap((s) => s.scores.filter((sc) => sc.semester === sem));
    const avg =
      all.length === 0 ? 0 : Math.round(all.reduce((sum, s) => sum + s.score, 0) / all.length);
    return { semester: `Sem ${sem}`, average: avg };
  }).filter((d) => d.average > 0);
}

export function gradeDistribution(allStudents: Student[]): { grade: string; count: number; color: string }[] {
  const buckets = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  const all = allStudents.flatMap((s) => s.scores);
  for (const sc of all) {
    if (sc.score >= 85) buckets.A++;
    else if (sc.score >= 70) buckets.B++;
    else if (sc.score >= 55) buckets.C++;
    else if (sc.score >= 40) buckets.D++;
    else buckets.F++;
  }
  return [
    { grade: "A (85-100)", count: buckets.A, color: "#9770f0" },
    { grade: "B (70-84)", count: buckets.B, color: "#5a72a6" },
    { grade: "C (55-69)", count: buckets.C, color: "#3d5487" },
    { grade: "D (40-54)", count: buckets.D, color: "#ac8efb" },
    { grade: "F (<40)", count: buckets.F, color: "#e07b9b" },
  ];
}
