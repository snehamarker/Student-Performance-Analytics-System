
import { useEffect, useState } from "react";

type Analytics = {
  total_students: number;
  average_marks: number;
  average_attendance: number;
  at_risk_students: number;
};

export default function App() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/analytics")
      .then((response) => {
        if (!response.ok) throw new Error("API request failed");
        return response.json();
      })
      .then((result: Analytics) => setData(result))
      .catch(() => setError("Backend connect nahi hua. Python server check karo."));
  }, []);

  return (
    <main style={{
      fontFamily: "Arial, sans-serif",
      padding: "32px",
      background: "#f4f7fb",
      minHeight: "100vh",
      color: "#172033"
    }}>
      <h1>Student Performance Analytics</h1>
      <p>Student results and attendance dashboard</p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!data && !error && <p>Loading student analytics...</p>}

      {data && (
        <>
          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "24px"
          }}>
            {[
              ["Total Students", data.total_students],
              ["Average Marks", data.average_marks],
              ["Average Attendance", `${data.average_attendance}%`],
              ["At-Risk Students", data.at_risk_students]
            ].map(([label, value]) => (
              <article key={String(label)} style={{
                background: "white",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 3px 14px #0000000d"
              }}>
                <p style={{ color: "#64748b" }}>{label}</p>
                <h2 style={{ fontSize: "30px" }}>{value}</h2>
              </article>
            ))}
          </section>

          <p style={{ marginTop: "28px" }}>
            Data successfully loaded from the Python Flask backend.
          </p>
        </>
      )}
    </main>
  );
}

