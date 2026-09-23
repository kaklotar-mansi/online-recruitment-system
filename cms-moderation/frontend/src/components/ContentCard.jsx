import RiskBadge from './RiskBadge';

// Renders one content item in the moderation queue with its AI risk info
// and the approve/reject/flag/rescan action buttons.
export default function ContentCard({ item, onDecision, onRescan, busy }) {
  let reasons = [];
  try {
    reasons = item.risk_reasons ? JSON.parse(item.risk_reasons) : [];
  } catch {
    reasons = [];
  }

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3>{item.title}</h3>
        <RiskBadge score={item.risk_score} />
      </div>

      <p className="content-card-meta">
        by <strong>{item.author}</strong> · {item.content_type} · status: <em>{item.status}</em>
      </p>

      <p className="content-card-body">{item.body}</p>

      {reasons.length > 0 && (
        <ul className="content-card-reasons">
          {reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      <div className="content-card-actions">
        <button disabled={busy} onClick={() => onDecision(item.id, 'approve')} className="btn btn-approve">
          Approve
        </button>
        <button disabled={busy} onClick={() => onDecision(item.id, 'reject')} className="btn btn-reject">
          Reject
        </button>
        <button disabled={busy} onClick={() => onDecision(item.id, 'flag')} className="btn btn-flag">
          Flag
        </button>
        <button disabled={busy} onClick={() => onRescan(item.id)} className="btn btn-rescan">
          Rescan
        </button>
      </div>
    </div>
  );
}
