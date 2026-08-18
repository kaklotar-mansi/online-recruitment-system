# Online Recruitment System

A full-stack recruitment portal with an **Admin Module** (manage job posts, applications, applicant records) and an **Applicant Module** (view jobs, submit applications).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas — cloud, shared by the whole team) |
| Auth | JWT (JSON Web Tokens) |

---

## Project Structure

```
recruitment-system/
├── backend/                 # Express + MongoDB API
│   ├── config/db.js         # Database connection
│   ├── models/               # User, Job, Application schemas
│   ├── middleware/           # Auth + role checks, error handling
│   ├── controllers/          # Route logic
│   ├── routes/               # API routes
│   └── server.js
└── frontend/
    └── src/
        ├── api/               # Axios instance
        ├── context/           # Auth state (login/register/logout)
        ├── components/        # Shared UI (Navbar, ProtectedRoute, etc.)
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Home.jsx        # Job listing
            └── admin/          # Admin dashboard, manage jobs, applicant records
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/<owner-username>/online-recruitment-system.git
cd online-recruitment-system
```

---

## 2. Create Your Own Branch

Never work directly on `main`. Each person creates their own branch to work in:

```bash
git checkout -b feature/<short-name-for-your-work>
```

Example:
```bash
git checkout -b feature/admin-module
```

---

## 3. Database Setup (MongoDB Atlas)

The whole team shares **one** cloud database, so everyone sees the same jobs and applications instead of separate local copies.

### If the cluster already exists
Ask whoever set it up for the **connection string**, then skip to Step 3.5.

### If setting up from scratch:

1. Sign up free at [mongodb.com/cloud/atlas/register](https://mongodb.com/cloud/atlas/register)
2. **Build a Database** → select the **M0 (Free)** tier → **Create Deployment**
3. **Create a database user** — set a username and password (save these somewhere)
4. **Network Access → Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`) — needed since team members connect from different networks
5. On the cluster, click **Connect → Drivers → Node.js** to get the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?appName=<ClusterName>
   ```
6. Replace `<password>` with your actual password, and add a database name before the `?`:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/recruitment_system?retryWrites=true&w=majority&appName=<ClusterName>
   ```

### 3.5 — Connect your local project to the database

1. Go into the `backend` folder
2. Create a file named exactly `.env`
3. Paste this in, using the shared connection string (get it privately from your teammate — never from GitHub):
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/recruitment_system?retryWrites=true&w=majority&appName=<ClusterName>
   JWT_SECRET=any_long_random_string_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
4. Save. `.env` is already excluded in `.gitignore` — it should never be pushed to GitHub.

---

## 4. Install & Run

**Backend:**
```bash
cd backend
npm install
npm run dev
```
Expected output:
```
MongoDB connected: ...
Server running on port 5000
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
npm run dev
```
Opens at `http://localhost:5173`

> **Connection error `querySrv ECONNREFUSED`?** Some networks block the DNS lookup MongoDB uses. This is already handled in `backend/config/db.js` (forces Google DNS). If it still fails, try a mobile hotspot to confirm it's a network issue, or manually set your WiFi's DNS to `8.8.8.8` / `8.8.4.4`.

---

## 5. Viewing the Stored Data

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and log in
2. Open your project → your cluster
3. Click **Browse Collections**
4. You'll see the `recruitment_system` database with these collections:
   - **users** — registered accounts (admin + applicant)
   - **jobs** — posted job listings
   - **applications** — submitted applications and their status

This updates in real time — refresh the page after any register/post/apply action in the app to see the new data.

---

## 6. Saving & Pushing Your Work

```bash
git add .
git commit -m "describe what you changed"
git push origin feature/<your-branch-name>
```

### Before starting each work session, pull the latest changes:
```bash
git checkout main
git pull origin main
git checkout feature/<your-branch-name>
git merge main
```

---

## 7. Creating a Pull Request (merging your work into `main`)

1. Push your branch:
   ```bash
   git push origin feature/<your-branch-name>
   ```
2. On GitHub, open the repo → **Pull Requests** tab → **New Pull Request**
3. Set Base: `main`  ←  Compare: `feature/<your-branch-name>`
4. Click **Create Pull Request**
5. Review the changes together, then click **Merge Pull Request**

### Avoiding merge conflicts
- Work in your own files/folders as much as possible
- Be extra careful with shared files (like `App.jsx`) — only add your own lines, don't delete or rewrite someone else's routes
- If two people need to edit the same file, pull the latest `main` into your branch first before making changes

---

## 8. Quick Command Cheat Sheet

```bash
# One-time
git clone <repo-url>
git checkout -b feature/<your-branch-name>

# Start of every session
git checkout main
git pull origin main
git checkout feature/<your-branch-name>
git merge main

# After making changes
git add .
git commit -m "your message"
git push origin feature/<your-branch-name>

# When ready to merge
# → Open a Pull Request on GitHub → Review → Merge
```
