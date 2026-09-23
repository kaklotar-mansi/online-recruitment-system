const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/audit/logs?action=approve&moderator=Safrin&from=2026-01-01&to=2026-12-31
// Returns audit log entries, newest first, with optional filters.
router.get('/logs', async (req, res) => {
  try {
    const { action, moderator, from, to } = req.query;
    let sql = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (action) {
      sql += ' AND action = ?';
      params.push(action);
    }
    if (moderator) {
      sql += ' AND moderator_name LIKE ?';
      params.push(`%${moderator}%`);
    }
    if (from) {
      sql += ' AND created_at >= ?';
      params.push(from);
    }
    if (to) {
      sql += ' AND created_at <= ?';
      params.push(to);
    }

    sql += ' ORDER BY created_at DESC LIMIT 500';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load audit logs' });
  }
});

// GET /api/audit/logs/:targetId/history
// All audit entries for one specific content item, so an admin can see
// its full history (flagged -> rescanned -> approved, etc.)
router.get('/logs/item/:targetId', async (req, res) => {
  try {
    const { targetId } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM audit_logs WHERE target_type = 'content_item' AND target_id = ?
       ORDER BY created_at ASC`,
      [targetId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load item history' });
  }
});

// GET /api/audit/summary
// Quick counts for dashboard cards: total actions, breakdown by action type.
router.get('/summary', async (req, res) => {
  try {
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM audit_logs');
    const [byAction] = await pool.query(
      'SELECT action, COUNT(*) as count FROM audit_logs GROUP BY action'
    );
    const [[{ pendingCount }]] = await pool.query(
      "SELECT COUNT(*) as pendingCount FROM content_items WHERE status = 'pending'"
    );
    const [[{ flaggedCount }]] = await pool.query(
      "SELECT COUNT(*) as flaggedCount FROM content_items WHERE status = 'flagged'"
    );
    res.json({ totalActions: total, byAction, pendingCount, flaggedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load summary' });
  }
});

module.exports = router;
