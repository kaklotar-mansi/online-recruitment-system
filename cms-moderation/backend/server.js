require('dotenv').config();
const express = require('express');
const cors = require('cors');

const moderationRoutes = require('./routes/moderation');
const auditRoutes = require('./routes/audit');

const app = express();
app.use(cors());
app.use(express.json());

// Health check — visit http://localhost:5000/api/health to confirm the server is up
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/moderation', moderationRoutes);
app.use('/api/audit', auditRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Moderation & Audit backend running on http://localhost:${PORT}`);
});
