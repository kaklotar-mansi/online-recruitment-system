# AI Moderation Dashboard & Audit Module

A standalone module for a Content Management System that lets moderators
review submitted content, see an AI-generated risk score with plain-English
reasons, and approve / reject / flag it — with every single action
automatically written to a permanent, filterable audit log.

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MySQL
- **AI scoring:** runs fully offline (no API key needed) using explainable
  rules — keyword matching, link density, shouting/caps detection, spam
  punctuation patterns. See `backend/services/aiModeration.js` if you want
  to tune the rules or swap in a real LLM call later.

---

## What's inside

```
cms-moderation/
├── backend/                 ← Express API + MySQL
│   ├── config/db.js
│   ├── middleware/auditLogger.js
│   ├── routes/moderation.js
│   ├── routes/audit.js
│   ├── services/aiModeration.js
│   ├── schema.sql           ← run this first to create tables + sample data
│   ├── server.js
│   ├── .env.example
│   └── Dockerfile
├── frontend/                ← React dashboard
│   ├── src/pages/ModerationDashboard.jsx
│   ├── src/pages/AuditLog.jsx
│   ├── src/components/ContentCard.jsx
│   ├── src/components/RiskBadge.jsx
│   ├── src/api/api.js
│   └── Dockerfile
└── docker-compose.yml       ← optional: run everything with one command
```

---

## Option A — Run it with Docker (easiest, no Node/MySQL install needed)

This assumes you already have **Docker Desktop** installed and running.

1. Unzip this project anywhere on your computer.
2. Open a terminal (Mac: **Terminal** app; Windows: **PowerShell** or
   **Command Prompt**) and navigate into the unzipped folder. Example:
   ```
   cd Downloads/cms-moderation
   ```
3. Run:
   ```
   docker compose up --build
   ```
4. Wait until you see the backend log line
   `Moderation & Audit backend running on http://localhost:5000`.
5. Open your browser to **http://localhost:5173** — that's the dashboard.
6. To stop everything, go back to the terminal and press `Ctrl + C`, then run:
   ```
   docker compose down
   ```

That's it — the database, backend, and frontend are all handled for you.

---

## Option B — Run it manually (without Docker)

### Step 1: Install prerequisites
- Install **Node.js** (version 18 or higher) from https://nodejs.org
- Install **MySQL** (version 8) from https://dev.mysql.com/downloads/
  — or use a MySQL instance you already have.

### Step 2: Create the database
1. Open a terminal and log into MySQL:
   ```
   mysql -u root -p
   ```
   (enter your MySQL root password when prompted)
2. With the schema file: exit MySQL (type `exit`), then from the project's
   `backend` folder run:
   ```
   mysql -u root -p < schema.sql
   ```
   This creates the `cms_moderation` database, its 3 tables, and a few
   sample rows so the dashboard isn't empty on first load.

### Step 3: Set up the backend
1. Open a terminal and navigate into the `backend` folder:
   ```
   cd cms-moderation/backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the example environment file:
   - Mac/Linux: `cp .env.example .env`
   - Windows: `copy .env.example .env`
4. Open the new `.env` file in any text editor and fill in your real MySQL
   password on the `DB_PASSWORD=` line.
5. Start the backend:
   ```
   npm start
   ```
   You should see: `Moderation & Audit backend running on http://localhost:5000`
   Leave this terminal window open — closing it stops the server.

### Step 4: Set up the frontend
1. Open a **second, separate** terminal window (keep the backend one running).
2. Navigate into the `frontend` folder:
   ```
   cd cms-moderation/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the frontend:
   ```
   npm run dev
   ```
5. Open your browser to the address it prints — usually **http://localhost:5173**.

---

## How the module works

### Moderation Dashboard (`/`)
- Lists content items, sorted by risk score (highest risk first).
- Filter tabs: All / Pending / Flagged / Approved / Rejected.
- Each card shows the AI's score, a plain-language list of *why* it was
  flagged, and 4 buttons: **Approve**, **Reject**, **Flag**, **Rescan**.
- "Rescan" re-runs the scoring rules — useful if content was edited.

### Audit Log (`/audit`)
- Every single action taken on the dashboard (approve/reject/flag/rescan)
  is written here automatically — the moderator can never skip this step
  because logging happens inside the same backend route as the action itself.
- Filterable by action type and moderator name.
- Each row shows: timestamp, moderator, action, target content item, and
  a JSON details blob (old status → new status, or the new risk score).

### Testing content submission
New content normally comes from your CMS, but you can simulate it with
a tool like Postman, or `curl`:
```
curl -X POST http://localhost:5000/api/moderation/items \
  -H "Content-Type: application/json" \
  -d '{"title":"Test post","body":"Buy cheap followers now!!! http://a.com http://b.com","author":"tester"}'
```
It will come back already scored and (if risky enough) auto-placed in the "flagged" status.

---

## Connecting real authentication later
Right now `CURRENT_MODERATOR` in `frontend/src/pages/ModerationDashboard.jsx`
is hardcoded to a demo moderator. When you add login to your CMS, replace
that constant with the actual logged-in user's ID and name so the audit
log records who really took each action.

## Notes
- The AI scoring is intentionally rule-based and explainable rather than a
  black-box model — every score comes with human-readable reasons, which
  matters for an audit trail. Swap `aiModeration.js` for a real LLM call
  if you need smarter detection later; keep the same `{ score, reasons }`
  return shape and nothing else needs to change.
- Audit log rows are never updated or deleted by the app — that's what
  makes it a real audit trail.
