export type Semester = 1 | 2 | 3 | 4 | 5 | 6;

export interface SubjectScore {
  subject: string;
  semester: Semester;
  score: number;
  maxScore: number;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  semester: Semester;
  attendance: number;
  scores: SubjectScore[];
}

export const SUBJECTS = [
  "Mathematics",
  "Data Structures",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "Software Engineering",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const SEMESTERS: Semester[] = [1, 2, 3, 4, 5, 6];
