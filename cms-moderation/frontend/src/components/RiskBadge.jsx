// Shows a content item's AI risk score as a colored pill.
// Kept as its own component so the color logic isn't duplicated anywhere.

export default function RiskBadge({ score }) {
  let color = '#2e7d32'; // green = low risk
  let label = 'Low';

  if (score >= 60) {
    color = '#c62828'; // red = high risk
    label = 'High';
  } else if (score >= 30) {
    color = '#ef6c00'; // orange = medium risk
    label = 'Medium';
  }

  return (
    <span
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
      aria-label={`Risk score ${score}, ${label}`}
    >
      {label} · {score}
    </span>
  );
}
