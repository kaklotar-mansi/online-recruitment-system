const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { scoreContent } = require('../services/aiModeration');
const { logAction } = require('../middleware/auditLogger');

// GET /api/moderation/items?status=pending
// Lists content items, optionally filtered by status. Newest first.
router.get('/items', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM content_items';
    const params = [];
    if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY risk_score DESC, created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load content items' });
  }
});

// POST /api/moderation/items/:id/rescan
// Re-runs the AI scoring service on one item (e.g. after it was edited).
router.post('/items/:id/rescan', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM content_items WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

    const item = rows[0];
    const { score, reasons } = scoreContent(`${item.title} ${item.body}`);
    await pool.query(
      'UPDATE content_items SET risk_score = ?, risk_reasons = ? WHERE id = ?',
      [score, JSON.stringify(reasons), id]
    );

    await logAction({
      moderatorId: req.body.moderatorId,
      moderatorName: req.body.moderatorName,
      action: 'rescan',
      targetType: 'content_item',
      targetId: id,
      details: { newScore: score, reasons },
      ipAddress: req.ip,
    });

    res.json({ id, score, reasons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to rescan item' });
  }
});

// POST /api/moderation/items/:id/decision
// body: { decision: 'approve' | 'reject' | 'flag', moderatorId, moderatorName, note }
// This is the core moderation action endpoint. Every call writes an audit log row.
router.post('/items/:id/decision', async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, moderatorId, moderatorName, note } = req.body;

    const validDecisions = { approve: 'approved', reject: 'rejected', flag: 'flagged' };
    if (!validDecisions[decision]) {
      return res.status(400).json({ error: 'decision must be approve, reject, or flag' });
    }

    const [rows] = await pool.query('SELECT * FROM content_items WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const oldStatus = rows[0].status;
    const newStatus = validDecisions[decision];

    await pool.query('UPDATE content_items SET status = ? WHERE id = ?', [newStatus, id]);

    await logAction({
      moderatorId,
      moderatorName,
      action: decision,
      targetType: 'content_item',
      targetId: id,
      details: { oldStatus, newStatus, note: note || null },
      ipAddress: req.ip,
    });

    res.json({ id, status: newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record decision' });
  }
});

// POST /api/moderation/items
// Lets the CMS submit new content, which is scored immediately on arrival.
router.post('/items', async (req, res) => {
  try {
    const { title, body, author, content_type } = req.body;
    if (!title || !body || !author) {
      return res.status(400).json({ error: 'title, body, and author are required' });
    }
    const { score, reasons } = scoreContent(`${title} ${body}`);
    const initialStatus = score >= 60 ? 'flagged' : 'pending';

    const [result] = await pool.query(
      `INSERT INTO content_items (title, body, author, content_type, status, risk_score, risk_reasons)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, body, author, content_type || 'post', initialStatus, score, JSON.stringify(reasons)]
    );

    res.status(201).json({ id: result.insertId, status: initialStatus, score, reasons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create content item' });
  }
});

module.exports = router;
