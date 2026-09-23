// Writes one row to audit_logs. Called directly from route handlers
// (not wired as generic Express middleware) so each call can record
// exactly what changed, in plain language, for the audit trail.

const pool = require('../config/db');

async function logAction({ moderatorId, moderatorName, action, targetType, targetId, details, ipAddress }) {
  await pool.query(
    `INSERT INTO audit_logs
      (moderator_id, moderator_name, action, target_type, target_id, details, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      moderatorId || null,
      moderatorName || 'Unknown',
      action,
      targetType,
      targetId,
      details ? JSON.stringify(details) : null,
      ipAddress || null,
    ]
  );
}

module.exports = { logAction };
