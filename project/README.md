# Student Performance Analytics System

A modern academic analytics dashboard built for a college mini project. This is a **frontend prototype** using realistic fictional sample data. It is designed to be connected to a Python backend separately.

## Tech Stack

- React 18 + TypeScript
- Vite (dev server + build tool)
- Tailwind CSS (white background, navy text, soft lavender accents)
- React Router (navigation)
- Recharts (bar, pie, area, line, radar charts)
- lucide-react (icons)

## Pages

| Page | What it shows |
|------|---------------|
| Dashboard Overview | KPI cards (total students, class average, highest score, pass %), subject bar chart, semester trend, recent students |
| Student Records | Searchable, filterable table (by semester, subject, department) |
| Performance Analysis | Bar charts, pie (grade distribution), subject comparison, radar |
| Individual Student Report | Profile, subject averages, score trend, full grade breakdown |
| Insights & Recommendations | Auto-generated insights, at-risk students, top performers, recommendations |

## Getting Started (run locally)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The app runs at http://localhost:5173

### Other commands

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

## Project Structure

```
src/
  components/      # Reusable UI: Sidebar, Topbar, KpiCard, ChartCard, Select, etc.
  pages/           # One file per page (Dashboard, StudentRecords, Performance, ...)
  data.ts          # Fictional sample data + derived analytics helpers
  types.ts         # Shared TypeScript types
  App.tsx          # Routes
  main.tsx         # Entry point
```

## Connecting a Python Backend

The sample data lives in `src/data.ts`. To connect your Python backend:

1. Create API endpoints (e.g. Flask/FastAPI) that return student records and scores.
2. Replace the static `students` array in `src/data.ts` with `fetch` calls to your API.
3. Keep the `Student` / `SubjectScore` types in `src/types.ts` so the UI stays consistent.

The frontend expects each student to have: `id, rollNo, name, email, department, semester, attendance, scores[]`.

## Exporting the Source Code

This project is a standard Vite app. To export:

1. Copy the entire project folder (including `package.json`, `src/`, `index.html`, config files).
2. Exclude `node_modules/` and `dist/` (they regenerate with `npm install` and `npm run build`).
3. Open the folder in VS Code and run `npm install` then `npm run dev`.

> The `.gitignore` already excludes `node_modules`, `dist`, and `.env`.

## Notes

- No authentication, paid APIs, or backend are included — by design.
- All data is fictional and generated for the visual prototype only.
