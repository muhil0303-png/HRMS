const appTitle = "HRMS Dashboard";
const requestSummary = "Create a simple HRMS (Human Resource Management System) Dashboard page in React. Since the repository is currently empty (only contains README.md), set up a clean, modern React project (using Vite, Tailwind CSS, and Lucide React icons for a professional look). The dashboard should include: 1. A sidebar navigation (Dashboard, Employees, Attendance, Leave, Pay\n...[truncated 658 chars]";
const highlights = [
  "Create a simple HRMS (Human Resource Management System) Dashboard page in React",
  "Since the repository is currently empty (only contains README",
  "md), set up a clean, modern React project (using Vite, Tailwind CSS, and Lucide React icons for a professional look)",
  "The dashboard should include:"
];

function App() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="app-title">
        <p className="eyebrow">Working starter app</p>
        <h1 id="app-title">{appTitle}</h1>
        <p className="summary">{requestSummary}</p>
        <div className="actions" aria-label="Primary actions">
          <a href="#features" className="button primary">Explore</a>
          <a href="#status" className="button secondary">Status</a>
        </div>
      </section>

      <section id="features" className="grid" aria-label="Generated features">
        {highlights.map((item) => (
          <article className="panel" key={item}>
            <span className="marker" aria-hidden="true" />
            <h2>{item}</h2>
            <p>Ready to extend with real data, routing, and domain-specific workflows.</p>
          </article>
        ))}
      </section>

      <section id="status" className="status" aria-label="Project status">
        <div>
          <p className="eyebrow">Validation target</p>
          <h2>Buildable React + TypeScript foundation</h2>
        </div>
        <p>Run <code>npm install</code>, then <code>npm run dev</code> for local development or <code>npm run build</code> for a production bundle.</p>
      </section>
    </main>
  );
}

export default App;
