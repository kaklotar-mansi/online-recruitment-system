# Online Recruitment System — Admin Module

A full-stack recruitment portal built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS**.

> This copy contains the **Admin module only** (frontend), so it can be developed independently on the `feature/admin-module` branch while a teammate builds the Applicant module on their own branch. The backend API supports both modules — see [Team Workflow](#team-workflow-2-3-members) below for how the two sides get merged.

## Modules

### 1. Admin Module (this copy)
- Register / Login as Admin
- Post / Edit / Delete job openings
- View all applications received for each job
- View / manage applicant records (with status: Pending, Shortlisted, Rejected, Hired)
- Dashboard with quick stats (total jobs, total applications, total applicants)

### 2. Applicant Module (built separately by teammate)
- Register / Login as Applicant
- Browse all active job listings
- View full job details
- Apply to a job (with resume link + cover note)
- Track status of submitted applications ("My Applications")

## Tech Stack

| Layer      | Technology                         |
|------------|-------------------------------------|
| Frontend   | React.js (Vite), Tailwind CSS, React Router, Axios |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB (Mongoose ODM)             |
| Auth       | JWT (JSON Web Tokens), bcrypt      |

## Project Structure

```
recruitment-system/
├── backend/            # Express + MongoDB API
│   ├── config/         # DB connection
│   ├── models/         # Mongoose schemas (User, Job, Application)
│   ├── middleware/      # JWT auth + role guard, error handler
│   ├── controllers/     # Route logic
│   ├── routes/          # API routes
│   └── server.js
└── frontend/            # React + Tailwind SPA
    └── src/
        ├── api/          # Axios instance
        ├── context/      # Auth context (JWT + role)
        ├── components/   # Reusable UI
        └── pages/        # Applicant + admin/ pages
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env     # then fill in your values
npm run dev               # starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                # starts on http://localhost:5173
```

### 3. Create the first Admin account
By default, new registrations are `applicant` role. To create an admin, either:
- Register normally, then in MongoDB manually set `role: "admin"` on that user document, OR
- Use the `/api/auth/register` route with `"role": "admin"` in the request body (see API docs below) — recommended only for local/dev setup.

## API Overview

| Method | Endpoint                         | Access        | Description                     |
|--------|-----------------------------------|---------------|----------------------------------|
| POST   | /api/auth/register                 | Public        | Register applicant or admin      |
| POST   | /api/auth/login                    | Public        | Login, returns JWT               |
| GET    | /api/auth/me                       | Private       | Get logged-in user profile       |
| GET    | /api/jobs                          | Public        | List active jobs                 |
| GET    | /api/jobs/:id                      | Public        | Job details                      |
| POST   | /api/jobs                          | Admin         | Create job                       |
| PUT    | /api/jobs/:id                      | Admin         | Update job                       |
| DELETE | /api/jobs/:id                      | Admin         | Delete job                       |
| POST   | /api/applications                  | Applicant     | Apply to a job                   |
| GET    | /api/applications/my               | Applicant     | Applicant's own applications     |
| GET    | /api/applications/job/:jobId       | Admin         | All applications for a job       |
| GET    | /api/applications                  | Admin         | All applications (applicant records) |
| PUT    | /api/applications/:id/status       | Admin         | Update application status        |

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recruitment_system
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Pushing to GitHub

```bash
cd recruitment-system
git init
git add .
git commit -m "Initial commit: Online Recruitment System (MERN + Tailwind)"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

> `.gitignore` already excludes `node_modules/`, `.env`, and build folders so secrets never get committed.

## Team Workflow (2-3 members)

This repo is structured so multiple people can work on it without stepping on each other:

```
recruitment-system/
├── backend/     ← shared API (models, routes, controllers)
└── frontend/
    └── src/pages/
        ├── admin/       ← Admin module owner works here
        └── (top-level)  ← Applicant module owner works here
                            (Login, Register, Home, JobDetails, MyApplications)
```

**Setup (one time):**
1. One team member creates the GitHub repo and pushes the initial code (steps above).
2. Repo owner goes to **Settings → Collaborators → Add people** and adds teammates.
3. Everyone clones the repo locally:
   ```bash
   git clone <repo-url>
   ```

**Day-to-day workflow:**
1. Each person works on their own branch:
   ```bash
   git checkout -b feature/admin-module       # admin module owner
   git checkout -b feature/applicant-module   # applicant module owner
   ```
2. Commit and push your branch regularly:
   ```bash
   git add .
   git commit -m "Add job posting form"
   git push origin feature/admin-module
   ```
3. When a module is ready, open a **Pull Request** into `main` on GitHub. Teammates review it, then merge.
4. To avoid merge conflicts, agree upfront on who edits shared files like `frontend/src/App.jsx` (routes) and `backend/server.js` (route mounting) — or take turns adding your own route lines and pull the latest `main` before you start each session:
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/admin-module
   git merge main
   ```

## Sharing One Database (MongoDB Atlas)

If everyone runs MongoDB locally, each person's data stays on their own machine — merging code does **not** merge data. To see the same jobs/applications across all your laptops, use a shared cloud database instead of local MongoDB:

1. **Create a free cluster** — one team member signs up at [mongodb.com/cloud/atlas/register](https://mongodb.com/cloud/atlas/register), then "Build a Database" → select the **M0 Free** tier.
2. **Create a database user** — Security → Database Access → Add New Database User. Set a username/password (this is for the app connection, separate from the Atlas login).
3. **Allow network access** — Security → Network Access → Add IP Address → choose **"Allow Access from Anywhere" (0.0.0.0/0)** so every teammate's machine can connect. (Fine for a college project; not recommended for production.)
4. **Get the connection string** — on the cluster, click "Connect" → "Drivers" → Node.js. You'll get something like:
   ```
   mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with the actual password and add the database name:
   ```
   mongodb+srv://username:password@cluster.xxxxx.mongodb.net/recruitment_system?retryWrites=true&w=majority
   ```
5. **Share it privately with your team** (WhatsApp/DM — never commit it to GitHub). Every teammate pastes the same string into their own `backend/.env` as `MONGO_URI=...`.
6. Now everyone's local backend (`npm run dev`) connects to the same cloud database — a job posted by the admin-module owner is instantly visible to the applicant-module owner, and vice versa.

## Roadmap / Nice-to-haves
- Resume file upload (Multer + Cloudinary/S3) instead of resume link
- Email notifications on status change
- Pagination + search/filter on jobs
- Admin analytics charts
