# Campus Event Management System (CEMS)
### Full-Stack Web Application (FSD-II Project)

A centralized, responsive, role-based web application engineered to digitize college event planning, online seat registrations, and participant roster management.

---

## 🚀 Key Features

### 1. Student Experience
- **Event Discovery**: Real-time browsing of technical, cultural, sports, and academic events with live search and category tags.
- **Atomic Registration**: One-click seat booking with atomic capacity checks to prevent race condition overbooking.
- **Seat Management**: Track active and past registrations on a personalized student dashboard.
- **Frictionless Cancellation**: Opt-out before deadlines with automatic seat release for other students.

### 2. Faculty Coordinator Experience
- **Event Lifecycle Control**: Create, update, or cancel campus events with detailed dates, times, venues, and registration deadlines.
- **Live Attendance Auditing**: View real-time attendee rosters with student roll numbers, departments, and contact info.
- **Roster Export**: Instant client-side CSV export of participant lists for offline attendance checking.

### 3. Administrator Experience
- **Platform Analytics**: High-level KPI metrics across total users, active events, and registration fill rates.
- **User Directory**: Search and manage user accounts with role escalation controls (`student`, `faculty`, `admin`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios |
| **Backend** | Node.js, Express.js (REST API under `/api/v1` namespace) |
| **Database** | MongoDB with Mongoose ODM (includes in-memory fallback for zero-setup local dev) |
| **Security** | JWT (JSON Web Tokens), bcryptjs password hashing, Role-Based Access Control (RBAC) |

---

## 🔑 Pre-Configured Demo Accounts

For immediate evaluation, the login page features **1-Click Demo Fill Buttons**:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campus.edu` | `Password@123` | System-wide statistics, user directory, role management, all events |
| **Faculty Coordinator** | `faculty@campus.edu` | `Password@123` | Create/edit events, track student attendee rosters, CSV export |
| **Student** | `student@campus.edu` | `Password@123` | Discover events, reserve seats, view dashboard, cancel registrations |

---

## 💻 Quick Start & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
*The backend automatically connects to MongoDB (or boots an in-memory database fallback if no local MongoDB service is running) and auto-seeds demo events and accounts.*
- Backend runs on: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/v1/health`

### 2. Start the Frontend Client
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
- Frontend application runs on: `http://localhost:5173`

---

## 📡 REST API Reference (`/api/v1`)

### Authentication & Profile
- `POST /api/v1/auth/register` — Create student or faculty account
- `POST /api/v1/auth/login` — Sign in and receive JWT token
- `GET /api/v1/auth/me` — Get current authenticated user profile

### Events Catalog
- `GET /api/v1/events` — List events (supports `?category=`, `?search=`, `?status=`, `?upcoming=true`)
- `GET /api/v1/events/:id` — Get complete event details with live capacity
- `POST /api/v1/events` — `[Faculty/Admin]` Create a new event
- `PUT /api/v1/events/:id` — `[Faculty/Admin]` Update event details
- `DELETE /api/v1/events/:id` — `[Faculty/Admin]` Soft-cancel or delete event
- `GET /api/v1/events/faculty/my-events` — `[Faculty/Admin]` Get events coordinated by logged-in faculty

### Registrations
- `POST /api/v1/registrations/events/:eventId` — `[Student]` Atomically reserve seat
- `GET /api/v1/registrations/my` — `[Student]` Get personal registration history
- `PATCH /api/v1/registrations/:id/cancel` — `[Student]` Cancel registration & release seat
- `GET /api/v1/registrations/events/:eventId/attendees` — `[Faculty/Admin]` View participant roster

### Administration
- `GET /api/v1/admin/stats` — `[Admin]` System KPI analytics
- `GET /api/v1/admin/users` — `[Admin]` Search user directory
- `PATCH /api/v1/admin/users/:id/role` — `[Admin]` Modify user role
- `DELETE /api/v1/admin/users/:id` — `[Admin]` Delete user and cascade records
