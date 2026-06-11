const appTitle = "HRMS Dashboard";
const requestSummary = "Create a modern and professional HRMS (Human Resource Management System) dashboard using HTML and CSS. The dashboard should include: 1. A sidebar navigation with a logo, navigation links (Dashboard, Employees, Attendance, Leave, Payroll, Performance, Settings), and a user profile summary. 2. A top header with a search bar, notification badge, current date (J\n...[truncated 886 chars]";
const highlights = [
  "Create a modern and professional HRMS (Human Resource Management System) dashboard using HTML and CSS",
  "The dashboard should include:",
  "A sidebar navigation with a logo, navigation links (Dashboard, Employees, Attendance, Leave, Payroll, Performance, Settings), and a user profile summary",
  "A top header with a search bar, notification badge, current date (June 11, 2026), and user profile avatar"
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
