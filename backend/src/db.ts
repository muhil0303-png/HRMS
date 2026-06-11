import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', 'hrms.db');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    head TEXT
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department_id INTEGER,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    join_date TEXT NOT NULL,
    avatar TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    UNIQUE(employee_id, date)
  );

  CREATE TABLE IF NOT EXISTS open_positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL
  );
`);

// Seed data if empty
const deptCount = db.prepare('SELECT COUNT(*) as count FROM departments').get() as { count: number };
if (deptCount.count === 0) {
  // Insert departments
  const insertDept = db.prepare('INSERT INTO departments (name, head) VALUES (?, ?)');
  insertDept.run('Engineering', 'Bob Johnson');
  insertDept.run('HR', 'Jane Smith');
  insertDept.run('Marketing', 'Alice Williams');
  insertDept.run('Sales', 'Charlie Brown');
  insertDept.run('Finance', 'Frank White');

  // Insert employees
  const insertEmp = db.prepare(`
    INSERT INTO employees (name, email, department_id, role, status, join_date, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Get department IDs
  const depts = db.prepare('SELECT id, name FROM departments').all() as { id: number; name: string }[];
  const deptMap = new Map(depts.map(d => [d.name, d.id]));

  insertEmp.run('John Doe', 'john.doe@company.com', deptMap.get('Engineering'), 'Senior Software Engineer', 'Active', '2023-01-15', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150');
  insertEmp.run('Jane Smith', 'jane.smith@company.com', deptMap.get('HR'), 'HR Manager', 'Active', '2022-06-10', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');
  insertEmp.run('Bob Johnson', 'bob.johnson@company.com', deptMap.get('Engineering'), 'Tech Lead', 'Active', '2021-03-20', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150');
  insertEmp.run('Alice Williams', 'alice.williams@company.com', deptMap.get('Marketing'), 'Marketing Specialist', 'Active', '2023-05-12', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150');
  insertEmp.run('Charlie Brown', 'charlie.brown@company.com', deptMap.get('Sales'), 'Sales Executive', 'Active', '2023-11-01', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');
  insertEmp.run('David Miller', 'david.miller@company.com', deptMap.get('Engineering'), 'Junior Developer', 'Onboarding', '2024-02-15', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150');
  insertEmp.run('Eva Green', 'eva.green@company.com', deptMap.get('HR'), 'HR Assistant', 'Onboarding', '2024-02-20', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
  insertEmp.run('Frank White', 'frank.white@company.com', deptMap.get('Finance'), 'Financial Analyst', 'Active', '2023-08-01', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150');
  insertEmp.run('Grace Lee', 'grace.lee@company.com', deptMap.get('Engineering'), 'QA Engineer', 'Active', '2023-09-15', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150');
  insertEmp.run('Henry Wilson', 'henry.wilson@company.com', deptMap.get('Sales'), 'Account Manager', 'Active', '2023-10-10', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150');

  // Insert attendance for today
  const today = new Date().toISOString().split('T')[0];
  const emps = db.prepare('SELECT id FROM employees').all() as { id: number }[];
  const insertAttendance = db.prepare('INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)');
  
  const statuses = ['Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Absent', 'Leave'];
  emps.forEach((emp, index) => {
    insertAttendance.run(emp.id, today, statuses[index % statuses.length]);
  });

  // Insert open positions
  const insertPosition = db.prepare('INSERT INTO open_positions (title, department, location, type, status) VALUES (?, ?, ?, ?, ?)');
  insertPosition.run('Senior React Developer', 'Engineering', 'Remote', 'Full-time', 'Open');
  insertPosition.run('Product Designer', 'Engineering', 'New York, NY', 'Full-time', 'Open');
  insertPosition.run('HR Specialist', 'HR', 'Chicago, IL', 'Full-time', 'Open');
  insertPosition.run('Content Marketer', 'Marketing', 'Remote', 'Contract', 'Open');
}

export default db;