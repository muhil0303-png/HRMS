import React from 'react';
import Header from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import Dashboard from './pages/Dashboard';

/**
 * Root application component for the HRMS Dashboard.
 * Renders the global enterprise layout including the Header, main Dashboard content, and Footer.
 */
export default function App(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}