# Campus Event Management System (CEMS)
### Clean Full-Stack Application with PostgreSQL & React (FSD-II Project)

A clean, beginner-friendly full-stack web application built using **Node.js, Express, PostgreSQL, and React (Vite)** designed for clarity, high performance, and effortless academic viva presentation.

---

## 📁 Clean & Simple File Structure

```
fsd-ii-project/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # User registration, login & admin role updates (SQL)
│   │   ├── events.js        # Event catalog, search, category filter & creation (SQL)
│   │   └── registrations.js # Event seat booking, cancellations & attendee roster (SQL)
│   ├── db.js                # PostgreSQL connection pool, table migration & seed data
│   ├── server.js            # Express API server entry point
│   ├── .env                 # Database configuration (PGHOST, PGUSER, PGPASSWORD, PGDATABASE)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx   # Header with role badge and navigation
│   │   ├── pages/
│   │   │   ├── EventList.jsx    # Home: Event cards with Search & Category filter
│   │   │   ├── EventDetail.jsx  # Event details + 1-Click Register & Cancel
│   │   │   ├── Auth.jsx         # Sign In & Sign Up with 1-Click Demo buttons
│   │   │   ├── MyEvents.jsx     # Student: My registered seats & cancellation
│   │   │   └── FacultyAdmin.jsx # Faculty/Admin: Publish events & view student roster
│   │   ├── App.jsx          # Clean Router and User State
│   │   ├── main.jsx         # React mounting
│   │   └── index.css        # Tailwind styling
│   ├── index.html
│   ├── vite.config.js       # Auto-proxies /api to http://localhost:5000
│   └── package.json
│
├── start.bat                # 1-Click Windows Launcher
└── README.md
```

---

## 🗄️ PostgreSQL Database Schema

The database automatically sets up 3 relational tables on startup:

1. **`users`**:
   - `id SERIAL PRIMARY KEY`
   - `name`, `email UNIQUE`, `password` (hashed with bcrypt)
   - `role` (`student` | `faculty` | `admin`)
   - `department`, `student_id`
   - `created_at TIMESTAMP`

2. **`events`**:
   - `id SERIAL PRIMARY KEY`
   - `title`, `description`, `category`
   - `date`, `time`, `venue`, `registration_deadline`
   - `capacity`, `registered_count INT DEFAULT 0`
   - `coordinator_id INT REFERENCES users(id)`
   - `image`, `created_at TIMESTAMP`

3. **`registrations`**:
   - `id SERIAL PRIMARY KEY`
   - `student_id INT REFERENCES users(id) ON DELETE CASCADE`
   - `event_id INT REFERENCES events(id) ON DELETE CASCADE`
   - `status` (`registered` | `cancelled`)
   - `registered_at TIMESTAMP`
   - `UNIQUE(student_id, event_id)` (Prevents duplicate seat bookings)

---

## ⚙️ Database Configuration

Open **`backend/.env`** and configure your PostgreSQL connection:

```env
PORT=5000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_postgres_password_here
PGDATABASE=cems
```

> **Note**: When the backend starts, it will automatically connect to PostgreSQL, verify or create the `cems` database, initialize the tables, and seed demo accounts and events.

---

## ⚡ 1-Click Demo Accounts

On the [Sign In page](http://localhost:5173/auth), click any of the **Quick Demo Fill** buttons:

| Role | Email | Password | What You Can Do |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `Password@123` | Browse events, 1-click register, view registrations, cancel seats |
| **Faculty Coordinator** | `faculty@campus.edu` | `Password@123` | Publish new events, track signups, inspect attendee roster |
| **Administrator** | `admin@campus.edu` | `Password@123` | All faculty features + view user directory and switch user roles |

---

## 🚀 How to Run

### Method 1: 1-Click Launch (Recommended)
Double-click **`start.bat`** in this project folder!
It will automatically launch both backend and frontend and open your browser to **`http://localhost:5173`**.

### Method 2: Manual Terminal Commands
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` (auto-seeds demo data into PostgreSQL).*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🌐 Simple API Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/users` | List all users (Admin) |
| `PATCH` | `/api/auth/users/:id/role` | Change user role (Admin) |
| `GET` | `/api/events` | List all events (optional `?category=` or `?search=`) |
| `GET` | `/api/events/:id` | Get single event details |
| `POST` | `/api/events` | Create new event (Faculty/Admin) |
| `DELETE`| `/api/events/:id` | Delete event (Faculty/Admin) |
| `POST` | `/api/registrations` | Register student for event |
| `GET` | `/api/registrations/student/:id` | View registrations for student |
| `PATCH` | `/api/registrations/:id/cancel` | Cancel seat registration |
| `GET` | `/api/registrations/event/:id` | View attendee roster for event |
