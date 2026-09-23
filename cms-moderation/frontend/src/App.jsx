import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ModerationDashboard from './pages/ModerationDashboard';
import AuditLog from './pages/AuditLog';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="app-nav">
          <span className="app-nav-title">CMS Moderation Module</span>
          <div className="app-nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to="/audit" className={({ isActive }) => (isActive ? 'active' : '')}>
              Audit Log
            </NavLink>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<ModerationDashboard />} />
            <Route path="/audit" element={<AuditLog />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
