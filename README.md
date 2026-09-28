# Campus Event Management System (CEMS)
### Simplified Full-Stack MERN Application (FSD-II Project)

A clean, beginner-friendly full-stack web application designed for simplicity, easy understanding, and effortless academic presentation.

---

## 📁 Clean & Simple File Structure

```
fsd-ii-project/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (Student, Faculty, Admin)
│   │   ├── Event.js         # Event schema (Title, Category, Date, Capacity)
│   │   └── Registration.js  # Registration schema (Student + Event reference)
│   ├── routes/
│   │   ├── auth.js          # Login, Register & Admin User Management
│   │   ├── events.js        # Get, Create & Delete events
│   │   └── registrations.js # Register, Cancel & Attendee Roster
│   ├── server.js            # Express server with automatic database fallback
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx   # Header with user role and navigation
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
*Backend runs on `http://localhost:5000` (auto-seeds demo data).*

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
