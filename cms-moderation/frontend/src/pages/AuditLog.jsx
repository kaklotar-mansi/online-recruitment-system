import { useEffect, useState } from 'react';
import { api } from '../api/api';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ action: '', moderator: '' });

  async function loadLogs() {
    setLoading(true);
    setError('');
    try {
      // Drop empty filter values so we don't send ?action=&moderator=
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      );
      const data = await api.getAuditLogs(cleanFilters);
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterSubmit(e) {
    e.preventDefault();
    loadLogs();
  }

  return (
    <div className="page">
      <h1>Audit Log</h1>
      <p className="page-subtitle">
        Every approve / reject / flag / rescan action taken in the moderation
        dashboard is recorded here and cannot be edited or deleted.
      </p>

      <form className="filter-form" onSubmit={handleFilterSubmit}>
        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
        >
          <option value="">All actions</option>
          <option value="approve">Approve</option>
          <option value="reject">Reject</option>
          <option value="flag">Flag</option>
          <option value="rescan">Rescan</option>
        </select>
        <input
          type="text"
          placeholder="Filter by moderator name"
          value={filters.moderator}
          onChange={(e) => setFilters({ ...filters, moderator: e.target.value })}
        />
        <button type="submit" className="btn">Apply filters</button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading audit log…</p>
      ) : (
        <table className="audit-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Moderator</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>{log.moderator_name}</td>
                <td>
                  <span className={`action-tag action-${log.action}`}>{log.action}</span>
                </td>
                <td>
                  {log.target_type} #{log.target_id}
                </td>
                <td>
                  <code className="details-cell">{log.details}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
