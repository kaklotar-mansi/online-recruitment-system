import { useEffect, useState } from 'react';
import { api } from '../api/api';
import ContentCard from '../components/ContentCard';

// Change this to the logged-in moderator's real info once you have auth wired up.
const CURRENT_MODERATOR = { moderatorId: 1, moderatorName: 'Safrin' };

export default function ModerationDashboard() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [summary, setSummary] = useState(null);

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const data = await api.getItems(filter);
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadSummary() {
    try {
      const data = await api.getSummary();
      setSummary(data);
    } catch {
      // Summary is a nice-to-have; ignore failures silently here.
    }
  }

  useEffect(() => {
    loadItems();
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleDecision(id, decision) {
    setBusyId(id);
    try {
      await api.decideItem(id, { decision, ...CURRENT_MODERATOR });
      await loadItems();
      await loadSummary();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRescan(id) {
    setBusyId(id);
    try {
      await api.rescanItem(id, CURRENT_MODERATOR);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="page">
      <h1>AI Moderation Dashboard</h1>

      {summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-number">{summary.pendingCount}</span>
            <span>Pending</span>
          </div>
          <div className="summary-card">
            <span className="summary-number">{summary.flaggedCount}</span>
            <span>Flagged</span>
          </div>
          <div className="summary-card">
            <span className="summary-number">{summary.totalActions}</span>
            <span>Total actions logged</span>
          </div>
        </div>
      )}

      <div className="filter-bar">
        {['all', 'pending', 'flagged', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading queue…</p>
      ) : items.length === 0 ? (
        <p>No content items in this view.</p>
      ) : (
        <div className="content-list">
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onDecision={handleDecision}
              onRescan={handleRescan}
              busy={busyId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
