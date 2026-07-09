import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Placeholder from './pages/Placeholder/Placeholder';
import './App.css';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="app-main" role="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/employees"
              element={
                <Placeholder
                  title="Employees"
                  description="Employee management features are coming soon. You will be able to view, add, edit, and manage all employee records here."
                />
              }
            />
            <Route
              path="/departments"
              element={
                <Placeholder
                  title="Departments"
                  description="Department management features are coming soon. You will be able to organize and manage company departments here."
                />
              }
            />
            <Route
              path="/reports"
              element={
                <Placeholder
                  title="Reports"
                  description="Reporting features are coming soon. You will be able to generate and view HR analytics and reports here."
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Placeholder
                  title="Settings"
                  description="Application settings are coming soon. You will be able to configure system preferences and user settings here."
                />
              }
            />
            <Route
              path="*"
              element={
                <Placeholder
                  title="Page Not Found"
                  description="The page you are looking for does not exist. Please use the navigation menu to return to a valid page."
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;