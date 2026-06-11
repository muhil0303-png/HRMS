import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GET /api/dashboard/summary
app.get('/api/dashboard/summary', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalEmployees = (db.prepare('SELECT COUNT(*) as count FROM employees').get() as any).count;
    
    const presentToday = (db.prepare(`
      SELECT COUNT(*) as count FROM attendance 
      WHERE date = ? AND status = 'Present'
    `).get(today) as any).count;

    const onLeave = (db.prepare(`
      SELECT COUNT(*) as count FROM attendance 
      WHERE date = ? AND status = 'Leave'
    `).get(today) as any).count;

    const openPositions = (db.prepare(`
      SELECT COUNT(*) as count FROM open_positions 
      WHERE status = 'Open'
    `).get() as any).count;

    res.json({
      totalEmployees,
      presentToday,
      onLeave,
      openPositions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/dashboard/departments
app.get('/api/dashboard/departments', (req, res) => {
  try {
    const departments = db.prepare(`
      SELECT d.name, COUNT(e.id) as headcount
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      GROUP BY d.id
    `).all();
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/dashboard/recent-joiners
app.get('/api/dashboard/recent-joiners', (req, res) => {
  try {
    const recentJoiners = db.prepare(`
      SELECT e.id, e.name, e.email, d.name as department, e.role, e.status, e.join_date as joinDate, e.avatar
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.join_date DESC
      LIMIT 5
    `).all();
    res.json(recentJoiners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/dashboard/attendance
app.get('/api/dashboard/attendance', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM attendance 
      WHERE date = ? 
      GROUP BY status
    `).all() as { status: string; count: number }[];

    const result = {
      Present: 0,
      Absent: 0,
      Leave: 0
    };

    stats.forEach(row => {
      if (row.status === 'Present') result.Present = row.count;
      if (row.status === 'Absent') result.Absent = row.count;
      if (row.status === 'Leave') result.Leave = row.count;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});