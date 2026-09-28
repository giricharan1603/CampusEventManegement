# Product Requirements Document (PRD)

# Campus Event Management System

**Project Type:** Full-Stack Web Application\
**Target Users:** Students, Faculty Coordinators, System Administrators

------------------------------------------------------------------------

# 1. Introduction

Colleges conduct various technical, cultural, sports, and academic
events throughout the academic year. At present, event information,
student registrations, and participation records may be maintained
manually.

The **Campus Event Management System** is a full-stack web application
designed to digitize and simplify the complete event management process.
Students can view upcoming events, access event details, register
online, view their registered events, and cancel registrations when
permitted.

Faculty coordinators can create, update, and delete authorized events
and view registered students. System administrators manage users, roles,
and system-level settings.

The system provides a centralized platform for efficient event
organization, student participation, and registration management.

------------------------------------------------------------------------

# 2. Problem Statement

The existing manual event-management process creates several
difficulties:

-   Event information is difficult to maintain and distribute.
-   Students may not receive updated event information on time.
-   Manual registration requires additional effort.
-   Maintaining student registration records is time-consuming.
-   Faculty coordinators have difficulty tracking participants.
-   Updating or cancelling events requires manual communication.
-   Duplicate or incorrect registration records may occur.
-   There is no centralized database for event and participation
    information.

Therefore, a centralized **Campus Event Management System** is required
to automate event creation, registration, and participation management.

------------------------------------------------------------------------

# 3. Product Vision

To provide a simple, secure, and centralized digital platform through
which colleges can manage events efficiently and students can discover
and participate in college activities easily.

------------------------------------------------------------------------

# 4. Project Scope

The Campus Event Management System is a full-stack web application
designed to manage the complete lifecycle of college events, from event
creation and publication to student registration and participation
management.

The system will provide separate functionalities for **students**,
**faculty coordinators**, and **system administrators**, with role-based
access to ensure that each user can perform only the operations relevant
to their role.

## 4.1 In-Scope Features

### A. Student Management

Students will be able to:

-   Create an account and log in securely.
-   View upcoming college events.
-   Search and filter events.
-   View complete event details.
-   Register for available events.
-   View their registered events.
-   Cancel eligible registrations.
-   View and update basic profile information where permitted.

### B. Event Management

Faculty/admin users will be able to:

-   Create new events.
-   Add event descriptions and details.
-   Set event dates, times, venues, and registration deadlines.
-   Define maximum participant capacity.
-   Update event information.
-   Delete or cancel events.
-   View all events.
-   Monitor event status.

### C. Registration Management

The system will:

-   Allow students to register online.
-   Prevent duplicate registrations.
-   Check event capacity before registration.
-   Check registration deadlines.
-   Store registration records.
-   Allow eligible registrations to be cancelled.
-   Maintain current registration status.

### D. Participant Management

Faculty/admin users will be able to:

-   View students registered for an event.
-   View student details such as name, student ID, department, and year.
-   Monitor the number of registrations.
-   Track registration status.

### E. Authentication and Authorization

The system will provide:

-   Student authentication.
-   Faculty authentication.
-   Administrator authentication.
-   Secure password storage.
-   Role-based access control.
-   Protected pages and APIs.

### F. Database Management

The application will maintain centralized data for:

-   Users
-   Events
-   Registrations

MongoDB will be used to store and manage application data.

------------------------------------------------------------------------

## 4.2 Out-of-Scope Features for the Initial Version

The following features are not required in the first version (MVP) but
may be added in future releases:

-   Online payment processing.
-   QR-code event attendance.
-   Automatic certificate generation.
-   Advanced event analytics.
-   Native mobile application.
-   AI-based event recommendations.
-   Live event streaming.
-   Social media integration.
-   Online voting or competition evaluation.
-   Advanced SMS/WhatsApp notification systems.

------------------------------------------------------------------------

## 4.3 Scope Boundaries

The first version will focus specifically on:

**Event Discovery → Event Registration → Registration Management →
Faculty Event Management**

The system will not replace the college's complete academic management
system, student information system, examination system, or learning
management system.

------------------------------------------------------------------------

# 5. Project Objectives

The main objective is to create a centralized digital platform that
simplifies event management for faculty and makes event participation
easier for students.

## 5.1 Primary Objectives

1.  **Digitize Event Management**\
    Replace manual event-management processes with a centralized
    web-based system.

2.  **Simplify Event Discovery**\
    Allow students to easily view upcoming technical, cultural, sports,
    and academic events.

3.  **Provide Online Registration**\
    Enable students to register for events directly through the web
    application.

4.  **Reduce Manual Work**\
    Reduce the time and effort required by faculty to create events,
    maintain participant lists, and manage registrations.

5.  **Centralize Event Data**\
    Maintain event, student, and registration information in a
    structured database.

6.  **Prevent Registration Errors**\
    Prevent duplicate registrations, late registrations, registrations
    when capacity is full, and invalid or incomplete registration data.

7.  **Improve Faculty Management**\
    Provide faculty coordinators with tools to create, update, delete,
    and monitor authorized events.

8.  **Improve Participant Management**\
    Allow faculty to quickly view and manage registered students.

9.  **Provide Secure Access**\
    Implement authentication and role-based authorization.

10. **Provide a Responsive Application**\
    Ensure the application works effectively on desktop, laptop, tablet,
    and mobile devices.

## 5.2 Measurable Objectives

  -----------------------------------------------------------------------
  Objective                           Target
  ----------------------------------- -----------------------------------
  Event creation                      Faculty can create events digitally

  Event discovery                     Students can view published
                                      upcoming events

  Registration                        Students can register online

  Duplicate prevention                A student cannot register twice for
                                      the same event

  Capacity management                 Registration stops when event
                                      capacity is reached

  Event management                    Authorized faculty can create,
                                      update, and delete events

  Participant management              Faculty can view registered
                                      students

  Data storage                        Events and registrations are stored
                                      in MongoDB

  Security                            Role-based access is implemented

  Responsiveness                      Application works on desktop and
                                      mobile
  -----------------------------------------------------------------------

## 5.3 Overall Project Goal

The overall goal is to develop a **secure, user-friendly, and scalable
Campus Event Management System** that connects students and faculty
through a single digital platform.

``` text
             CAMPUS EVENT MANAGEMENT SYSTEM
                         |
          +--------------+--------------+
          |                             |
       STUDENTS                    FACULTY/ADMIN
          |                             |
          v                             v
    Discover Events              Create Events
    View Details                 Update Events
    Register                     Delete Events
    My Registrations             View Registrations
    Cancel Registration           Manage Participants
          |                             |
          +--------------+--------------+
                         |
                         v
                  CENTRAL DATABASE
                     MongoDB
```

------------------------------------------------------------------------

# 6. Functional Requirements

## 6.1 Student Module

### FR-01: Student Registration

Students should be able to create an account using:

-   Student Name
-   Student ID/Roll Number
-   Email
-   Phone Number
-   Password
-   Department
-   Year/Section

The system should validate the information before creating the account.

### FR-02: Student Login

Students should be able to securely log in using registered credentials.

### FR-03: View Upcoming Events

Students should be able to view upcoming events.

Each event card should display:

-   Event Name
-   Event Category
-   Date
-   Time
-   Venue
-   Short Description
-   Registration Status

### FR-04: Search and Filter Events

Students should be able to search and filter events based on:

-   Event Name
-   Category
-   Date
-   Department
-   Event Status

Categories may include:

-   Technical
-   Cultural
-   Sports
-   Academic

### FR-05: View Event Details

Students should be able to view:

-   Event Name
-   Description
-   Category
-   Date
-   Start Time
-   End Time
-   Venue
-   Organizer
-   Registration Deadline
-   Maximum Participants
-   Eligibility Criteria
-   Event Rules
-   Contact Information

### FR-06: Register for Event

Students should be able to register for an available event.

The system should check:

-   Student is logged in.
-   Registration deadline has not passed.
-   Event capacity has not been reached.
-   Student has not already registered.

### FR-07: View Registered Events

Students should have a **My Registrations** section displaying:

-   Event Name
-   Date
-   Venue
-   Registration Date
-   Registration Status

### FR-08: Cancel Registration

Students should be able to cancel registration before the permitted
cancellation deadline.

------------------------------------------------------------------------

# 7. Faculty/Admin Module

## FR-09: Faculty Login

Faculty coordinators should have secure login access.

## FR-10: Add Event

Faculty should be able to create an event using:

-   Event Name
-   Description
-   Category
-   Date
-   Start Time
-   End Time
-   Venue
-   Registration Deadline
-   Maximum Participants
-   Eligibility
-   Rules
-   Coordinator Name
-   Contact Information

## FR-11: View All Events

Faculty should be able to view:

-   Event Name
-   Category
-   Date
-   Venue
-   Number of Registrations
-   Status
-   Actions

## FR-12: Update Event

Authorized faculty should be able to modify:

-   Date
-   Venue
-   Description
-   Registration deadline
-   Participant capacity
-   Other event information

## FR-13: Delete Event

Authorized faculty should be able to delete or cancel events after
confirmation.

If students are already registered, the system should display an
appropriate warning.

## FR-14: View Registered Students

Faculty should be able to view:

-   Student Name
-   Student ID
-   Department
-   Year
-   Email
-   Registration Date
-   Registration Status

------------------------------------------------------------------------

# 8. System Assumptions

The following assumptions are considered while designing and developing
the system.

## 8.1 General Assumptions

1.  The college has reliable internet connectivity.
2.  Users will access the system through a modern web browser.
3.  Students and faculty will have valid college credentials or
    registered accounts.
4.  Each student will have a unique Student ID.
5.  Each registered email address will belong to only one user account.
6.  Faculty users will be authorized by the college before receiving
    faculty access.
7.  Event information entered by faculty is assumed to be accurate.
8.  Students are responsible for providing correct personal information.
9.  The college will provide required event information.
10. MongoDB will be available during normal system operation.
11. The application will maintain centralized data.
12. Role-based access will separate student, faculty, and administrator
    functionality.

## 8.2 Student Assumptions

1.  Each student has a unique student ID.
2.  A student can register only when registration is open.
3.  A student cannot register for the same event more than once.
4.  Students can cancel only permitted registrations.
5.  Students can manage only their own registrations.
6.  Students must be authenticated for protected features.

## 8.3 Faculty/Admin Assumptions

1.  Faculty accounts are created or approved by an administrator.
2.  Faculty are responsible for maintaining accurate event information.
3.  Faculty can manage only authorized events.
4.  Faculty can view participant information only for authorized events.
5.  Administrative actions require appropriate authorization.

------------------------------------------------------------------------

# 9. System Constraints

## 9.1 Technical Constraints

1.  Frontend: React.js.
2.  Backend: Node.js and Express.js.
3.  Database: MongoDB.
4.  Communication: REST APIs.
5.  Internet connection is required for normal operation.
6.  Modern browsers are required.
7.  Initial system is a web application, not a native mobile
    application.

## 9.2 Functional Constraints

1.  Only authenticated students can register for events.
2.  Only authorized faculty/admin users can create, update, or delete
    events.
3.  Students cannot modify event information.
4.  Students cannot view private registrations of other students.
5.  Registration cannot occur after the deadline.
6.  Registration cannot exceed event capacity.
7.  Duplicate registration is not permitted.
8.  Event deletion may be restricted when active registrations exist.
9.  Online payment is outside the initial version.
10. Automated certificate generation is outside the initial version.

## 9.3 Security Constraints

1.  Passwords must not be stored as plain text.
2.  Protected APIs require authentication.
3.  Role-based authorization must be implemented.
4.  Students must not access faculty/admin APIs.
5.  User input must be validated.
6.  Sensitive information should not be unnecessarily exposed.
7.  Authentication tokens/sessions must be handled securely.

## 9.4 Operational Constraints

1.  Availability depends on hosting and internet connectivity.
2.  Database availability is required for event operations.
3.  Appropriate backup and recovery procedures should be maintained.
4.  The system should support multiple simultaneous users.
5.  Concurrent-user capacity depends on hosting infrastructure.

------------------------------------------------------------------------

# 10. User Roles and Responsibilities

The system will use **Role-Based Access Control (RBAC)**.

There are three logical roles:

``` text
                    SYSTEM
                       |
          +------------+------------+
          |            |            |
          v            v            v
       STUDENT       FACULTY      ADMIN
```

## 10.1 Student

### Role Description

A Student is a college student who uses the system to discover and
participate in college events.

### Responsibilities

-   Maintain accurate profile information.
-   View available events.
-   Read event requirements.
-   Register for events they intend to attend.
-   Cancel registrations when necessary.
-   Follow event rules.

### Permissions

  Feature                    Permission
  -------------------------- ------------
  Register/Login             Yes
  View upcoming events       Yes
  Search/filter events       Yes
  View event details         Yes
  Register for event         Yes
  View own registrations     Yes
  Cancel own registration    Yes
  View other registrations   No
  Create event               No
  Update event               No
  Delete event               No
  View admin dashboard       No

## 10.2 Faculty Coordinator

### Role Description

A Faculty Coordinator is a faculty member responsible for organizing and
managing one or more college events.

### Responsibilities

-   Create accurate event information.
-   Maintain event details.
-   Monitor event registrations.
-   Review registered students.
-   Update event information.
-   Cancel/remove authorized events.
-   Coordinate event participation.

### Permissions

  Feature                           Permission
  --------------------------------- ------------
  Login                             Yes
  View all events                   Yes
  Create event                      Yes
  Update authorized events          Yes
  Delete/cancel authorized events   Yes
  View registered students          Yes
  View registration count           Yes
  Register for event                No
  Manage student accounts           No
  Manage other faculty accounts     No
  Access system administration      No

### Faculty Registration Rule

For the initial MVP, the **Faculty Coordinator role is management-only**
and is not treated as a student participant.

Therefore:

> **Only users with the Student role can register for events in the
> MVP.**

If faculty participation is required in a future version, a separate
participant capability can be introduced without changing the core
faculty-management workflow.

## 10.3 System Administrator

### Role Description

The System Administrator manages the overall application, users,
permissions, and system-level configuration.

### Responsibilities

-   Manage user accounts and roles.
-   Approve/manage faculty accounts.
-   Monitor system activity.
-   Manage application-level settings.
-   Handle system-level issues.
-   Maintain data and access controls.

### Permissions

  Feature                   Permission
  ------------------------- ------------
  Login                     Yes
  View all users            Yes
  Manage user roles         Yes
  Manage faculty accounts   Yes
  View all events           Yes
  Create events             Yes
  Update events             Yes
  Delete events             Yes
  View all registrations    Yes
  Manage system settings    Yes
  Access admin dashboard    Yes

------------------------------------------------------------------------

# 11. Role Permission Matrix

  Function                   Student   Faculty   Admin
  ------------------------- --------- --------- -------
  Login                         ✓         ✓        ✓
  View Events                   ✓         ✓        ✓
  Search Events                 ✓         ✓        ✓
  View Event Details            ✓         ✓        ✓
  Register for Event            ✓         ✗        ✗
  View Own Registrations        ✓         ✗        ✗
  Cancel Own Registration       ✓         ✗        ✗
  Create Event                  ✗         ✓        ✓
  Update Event                  ✗        ✓\*       ✓
  Delete Event                  ✗        ✓\*       ✓
  View Event Participants       ✗        ✓\*       ✓
  Manage Users                  ✗         ✗        ✓
  Manage Roles                  ✗         ✗        ✓
  System Configuration          ✗         ✗        ✓

\* Faculty permissions are limited to events they coordinate or have
explicitly been authorized to manage.

------------------------------------------------------------------------

# 12. Role-Based Access Flow

``` text
                         LOGIN
                           |
                           v
                   Authentication
                           |
                           v
                    Identify Role
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       STUDENT          FACULTY           ADMIN
          |                |                |
          v                v                v
   Student Dashboard Faculty Dashboard Admin Dashboard
          |                |                |
          v                v                v
    Registrations     Event Management  User Management
    View Events       Participants      System Settings
    Profile           Event Updates     All Events
```

The system will follow the principle of **least privilege**. Each user
receives only the permissions required to perform their role.

------------------------------------------------------------------------

# 13. Event Status

The system can maintain:

-   Upcoming
-   Registration Open
-   Registration Closed
-   Full
-   Ongoing
-   Completed
-   Cancelled

Status may be updated automatically or manually according to event
conditions.

------------------------------------------------------------------------

# 14. Dashboard Requirements

## 14.1 Student Dashboard

The dashboard should contain:

-   Welcome message
-   Upcoming Events
-   My Registrations
-   Event Categories
-   Search
-   Notifications
-   Profile

### Navigation

**Dashboard \| Events \| My Registrations \| Profile \| Logout**

## 14.2 Faculty Dashboard

The dashboard should contain:

-   Total Events
-   Upcoming Events
-   Total Registrations
-   Event Management
-   Registered Students
-   Profile
-   Logout

### Navigation

**Dashboard \| Events \| Add Event \| Registrations \| Profile \|
Logout**

## 14.3 Admin Dashboard

The dashboard should contain:

-   Total Users
-   Total Students
-   Total Faculty
-   Total Events
-   Total Registrations
-   User Management
-   Event Management
-   System Settings

------------------------------------------------------------------------

# 15. UI/UX Requirements

The application should have a modern, simple, and college-oriented
design.

## Student Interface

-   Responsive navigation bar
-   Event cards
-   Category filters
-   Search bar
-   Event details page
-   Registration button
-   My Registrations page
-   Profile page

## Faculty Interface

-   Dashboard with statistics
-   Event management table
-   Add Event form
-   Edit Event form
-   Delete confirmation
-   Registered student table

## Admin Interface

-   User management
-   Role management
-   Event management
-   System statistics
-   System settings

The UI should be responsive and usable on desktop, tablet, and mobile
devices.

------------------------------------------------------------------------

# 16. User Stories

## Student User Stories

**US-01:** As a student, I want to view upcoming events so that I can
participate in college activities.

**US-02:** As a student, I want to view complete event details so that I
can decide whether to register.

**US-03:** As a student, I want to register online so that I do not need
manual registration.

**US-04:** As a student, I want to view my registered events so that I
can track participation.

**US-05:** As a student, I want to cancel my registration so that I can
withdraw when necessary.

## Faculty User Stories

**US-06:** As a faculty coordinator, I want to create events so that
students can participate.

**US-07:** As a faculty coordinator, I want to update event information
so that students receive the latest details.

**US-08:** As a faculty coordinator, I want to delete or cancel events
so that incorrect or cancelled events can be managed.

**US-09:** As a faculty coordinator, I want to view registered students
so that I can manage participants.

## Administrator User Stories

**US-10:** As an administrator, I want to manage users so that system
access remains controlled.

**US-11:** As an administrator, I want to manage roles so that users
receive appropriate permissions.

**US-12:** As an administrator, I want to monitor events and
registrations so that the system can be managed effectively.

------------------------------------------------------------------------

# 17. Business Rules

1.  A student must be logged in to register.
2.  A student cannot register for the same event more than once.
3.  Registration closes after the deadline.
4.  Registration stops when capacity is reached.
5.  Only authorized faculty/admin users can create, update, or delete
    events.
6.  Students can only manage their own registrations.
7.  Event information must be validated before saving.
8.  Deleting an event with existing registrations requires confirmation
    and appropriate authorization.
9.  Cancelled registrations do not count toward active participant
    capacity.
10. Faculty coordinators cannot register through the student
    registration workflow in the MVP.
11. Administrators can manage system-wide users and permissions.

------------------------------------------------------------------------

# 18. Validation Requirements

## Student Registration

-   Name cannot be empty.
-   Student ID must be unique.
-   Email must have a valid format.
-   Password must meet minimum security requirements.

## Event Creation

-   Event name is required.
-   Event date must be valid.
-   Registration deadline must be before the event date.
-   Maximum capacity must be greater than zero.
-   Required event information must be completed.

## Event Registration

``` text
Is user logged in?
       |
      Yes
       |
Is registration open?
       |
      Yes
       |
Is capacity available?
       |
      Yes
       |
Already registered?
       |
       No
       |
   REGISTER
```

------------------------------------------------------------------------

# 19. Notifications

The system may display notifications for:

-   Successful registration
-   Registration cancellation
-   Event update
-   Event cancellation
-   Registration deadline
-   Event capacity reached

Example:

> Registration successful! You are registered for the Technical
> Hackathon.

------------------------------------------------------------------------

# 20. Database Requirements

MongoDB will contain three primary collections:

``` text
Users
Events
Registrations
```

## 20.1 Users Collection

``` javascript
{
  _id: ObjectId,
  name: String,
  studentId: String,
  email: String,
  password: String,
  phone: String,
  department: String,
  year: Number,
  role: String,
  createdAt: Date
}
```

Possible roles:

``` text
student
faculty
admin
```

## 20.2 Events Collection

``` javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  date: Date,
  startTime: String,
  endTime: String,
  venue: String,
  registrationDeadline: Date,
  capacity: Number,
  eligibility: String,
  rules: String,
  coordinator: ObjectId,
  contactInformation: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 20.3 Registrations Collection

``` javascript
{
  _id: ObjectId,
  student: ObjectId,
  event: ObjectId,
  registrationDate: Date,
  status: String
}
```

Possible statuses:

``` text
Registered
Cancelled
Attended
```

------------------------------------------------------------------------

# 21. ER Diagram

``` text
                    +----------------+
                    |     USERS      |
                    +----------------+
                    | _id            |
                    | name           |
                    | email          |
                    | studentId      |
                    | department     |
                    | role           |
                    +-------+--------+
                            |
                            | 1
                            |
                            | registers
                            |
                            | M
                    +-------v--------+
                    | REGISTRATIONS  |
                    +----------------+
                    | _id            |
                    | student        |
                    | event          |
                    | registeredDate |
                    | status         |
                    +-------+--------+
                            |
                            | M
                            |
                            | belongs to
                            |
                            | 1
                    +-------v--------+
                    |     EVENTS     |
                    +----------------+
                    | _id            |
                    | title          |
                    | category       |
                    | date           |
                    | venue          |
                    | capacity       |
                    | coordinator    |
                    | status         |
                    +----------------+
```

### Relationships

-   One student can register for many events.
-   One event can have many student registrations.
-   One registration belongs to one student and one event.
-   One faculty coordinator can manage multiple events.

------------------------------------------------------------------------

# 22. High-Level System Architecture

``` text
                       CAMPUS EVENT MANAGEMENT SYSTEM
                                      |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
             STUDENT                                  FACULTY/ADMIN
                 |                                         |
                 +--------------------+--------------------+
                                      |
                                      v
                              REACT FRONTEND
                                      |
                                      | REST API
                                      v
                            NODE.JS + EXPRESS
                                      |
                    +-----------------+-----------------+
                    |                 |                 |
                    v                 v                 v
              Authentication      Events          Registrations
                    |                 |                 |
                    +-----------------+-----------------+
                                      |
                                      v
                                  MONGODB
                                      |
                 +--------------------+--------------------+
                 |                    |                    |
                 v                    v                    v
               Users                Events           Registrations
```

------------------------------------------------------------------------

# 23. REST API Design

## 23.1 Authentication APIs

### Register Student

``` http
POST /api/auth/register
```

### Login

``` http
POST /api/auth/login
```

### Get Current User

``` http
GET /api/auth/me
```

### Logout

``` http
POST /api/auth/logout
```

## 23.2 Event APIs

### Get All Events

``` http
GET /api/events
```

### Get Upcoming Events

``` http
GET /api/events/upcoming
```

### Get Event by ID

``` http
GET /api/events/:id
```

### Create Event

``` http
POST /api/events
```

### Update Event

``` http
PUT /api/events/:id
```

### Delete Event

``` http
DELETE /api/events/:id
```

## 23.3 Registration APIs

### Register for Event

``` http
POST /api/events/:eventId/register
```

### Get My Registrations

``` http
GET /api/registrations/my
```

### Cancel Registration

``` http
DELETE /api/events/:eventId/register
```

### View Event Registrations

``` http
GET /api/events/:eventId/registrations
```

The last API is restricted to authorized faculty/admin users.

------------------------------------------------------------------------

# 24. API Authorization

``` text
                 LOGIN
                   |
                   v
              Authenticate
                   |
          +--------+--------+
          |                 |
       Student           Faculty/Admin
          |                 |
          v                 v
 Student APIs        Event/Admin APIs
```

### Student Permissions

Students can:

-   View events.
-   View event details.
-   Register.
-   View their registrations.
-   Cancel their registrations.

### Faculty Permissions

Faculty can:

-   Create events.
-   View events.
-   Update authorized events.
-   Delete/cancel authorized events.
-   View registered students.

### Administrator Permissions

Administrators can:

-   Manage users.
-   Manage roles.
-   Manage all events.
-   View all registrations.
-   Manage system settings.

------------------------------------------------------------------------

# 25. React Frontend

React.js will be used to build the frontend.

## Suggested Folder Structure

``` text
frontend/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── EventCard.jsx
│   │   ├── EventForm.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── Events.jsx
│   │   ├── EventDetails.jsx
│   │   ├── MyRegistrations.jsx
│   │   ├── FacultyDashboard.jsx
│   │   ├── ManageEvents.jsx
│   │   ├── AddEvent.jsx
│   │   └── RegisteredStudents.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

------------------------------------------------------------------------

# 26. Node.js + Express Backend

Node.js and Express.js will handle:

-   Authentication
-   Authorization
-   Event management
-   Registration management
-   Database communication
-   API requests
-   Validation
-   Error handling

## Suggested Backend Structure

``` text
backend/
│
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── registrationController.js
│
├── models/
│   ├── User.js
│   ├── Event.js
│   └── Registration.js
│
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── registrationRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
│
├── config/
│   └── database.js
│
├── server.js
└── package.json
```

------------------------------------------------------------------------

# 27. MongoDB Database

MongoDB will store:

-   Student accounts
-   Faculty accounts
-   Administrator accounts
-   Event information
-   Registration records

The application will connect to MongoDB using **Mongoose**.

``` text
React Frontend
      |
      | HTTP / REST API
      v
Node.js + Express
      |
      | Mongoose
      v
MongoDB
```

------------------------------------------------------------------------

# 28. Frontend-Backend Integration

``` text
Student clicks
"Register"
       |
       v
React sends
POST /api/events/:eventId/register
       |
       v
Express receives request
       |
       v
Authentication check
       |
       v
Registration validation
       |
       v
MongoDB
       |
       v
Registration saved
       |
       v
Backend sends response
       |
       v
React displays
"Registration Successful"
```

------------------------------------------------------------------------

# 29. Authentication Flow

JWT-based authentication can be used.

``` text
Student Login
      |
      v
POST /api/auth/login
      |
      v
Backend verifies credentials
      |
      v
JWT Token Generated
      |
      v
Token sent to Frontend
      |
      v
Frontend stores authentication state
      |
      v
Protected API Requests
      |
      v
Backend verifies JWT
      |
      v
Access Granted
```

------------------------------------------------------------------------

# 30. Main User Flows

## 30.1 Student Flow

``` text
Open Website
     |
     v
Login / Register
     |
     v
Student Dashboard
     |
     v
View Upcoming Events
     |
     v
Select Event
     |
     v
View Event Details
     |
     v
Register
     |
     v
Registration Confirmation
     |
     v
My Registrations
     |
     v
Cancel Registration (if permitted)
```

## 30.2 Faculty Flow

``` text
Faculty Login
      |
      v
Faculty Dashboard
      |
      +-------------------+
      |                   |
      v                   v
  Add Event          View Events
                          |
                    +-----+-----+
                    |           |
                    v           v
                 Update       Delete/Cancel
                    |
                    v
            View Registrations
                    |
                    v
             Registered Students
```

------------------------------------------------------------------------

# 31. UI/UX Screens

## 31.1 Common Screens

### Splash/Loading Screen

Displays the application logo and name.

### Login Screen

Fields:

-   Email/Student ID
-   Password
-   Login button
-   Forgot password

### Registration Screen

Fields:

-   Full Name
-   Student ID
-   Email
-   Phone Number
-   Department
-   Year
-   Password
-   Confirm Password

## 31.2 Student Screens

### Student Dashboard

Displays:

-   Welcome message
-   Upcoming events
-   Event categories
-   Search
-   Registered event count
-   Recent registrations

### Events Screen

Event cards display:

-   Event image
-   Event name
-   Category
-   Date
-   Venue
-   Registration status
-   View Details button

### Event Details Screen

Displays:

-   Event name
-   Description
-   Date
-   Time
-   Venue
-   Organizer
-   Registration deadline
-   Available seats
-   Eligibility
-   Rules
-   Register button

### My Registrations Screen

Displays:

-   Event name
-   Date
-   Venue
-   Registration date
-   Status
-   Cancel Registration button

### Student Profile Screen

Displays:

-   Student name
-   Student ID
-   Email
-   Department
-   Year
-   Phone number

## 31.3 Faculty Screens

### Faculty Dashboard

Displays:

``` text
+------------------+------------------+
| Total Events     | Upcoming Events  |
+------------------+------------------+
| Registrations    | Active Events    |
+------------------+------------------+
```

Quick actions:

-   Add Event
-   Manage Events
-   View Registrations

### Manage Events Screen

  Event       Category    Date       Venue     Registrations   Status   Actions
  ----------- ----------- ---------- --------- --------------- -------- -------------
  Hackathon   Technical   10/10/26   Block A   85              Open     Edit/Delete
  Cricket     Sports      15/10/26   Ground    60              Open     Edit/Delete

### Add Event Screen

Fields:

-   Event Name
-   Description
-   Category
-   Date
-   Start Time
-   End Time
-   Venue
-   Registration Deadline
-   Maximum Participants
-   Eligibility
-   Rules
-   Coordinator
-   Contact Information

### Registered Students Screen

``` text
Event: Technical Hackathon

+------+----------------+------------+------------+----------------+
| No.  | Student Name   | Student ID | Department | Registered On  |
+------+----------------+------------+------------+----------------+
| 1    | Student A      | 23CSE001   | CSE        | 01/10/26       |
| 2    | Student B      | 23CSE002   | CSE        | 02/10/26       |
+------+----------------+------------+------------+----------------+
```

------------------------------------------------------------------------

# 32. Development Roadmap

The development process will convert the PRD into a complete working
full-stack web application.

``` text
Product Requirements
        ↓
UI/UX Design
        ↓
Database Schema & ER Diagram
        ↓
REST API Development
        ↓
React Frontend
        ↓
Node.js + Express Backend
        ↓
MongoDB Database
        ↓
Integration & Testing
        ↓
Deployment
```

## 32.1 Development Phases

### Phase 1 --- Requirement Analysis

-   Finalize requirements.
-   Identify users.
-   Define functional requirements.
-   Define non-functional requirements.
-   Finalize scope and constraints.

### Phase 2 --- UI/UX Design

-   Design wireframes.
-   Design student dashboard.
-   Design faculty dashboard.
-   Design admin dashboard.
-   Design event pages.
-   Design registration pages.

### Phase 3 --- Database Design

-   Create database schema.
-   Create collections.
-   Define relationships.
-   Create indexes.
-   Define validation rules.

### Phase 4 --- Backend Development

-   Setup Node.js.
-   Setup Express.js.
-   Connect MongoDB.
-   Create models.
-   Create REST APIs.
-   Implement authentication.
-   Implement authorization.

### Phase 5 --- Frontend Development

-   Setup React.
-   Create components.
-   Create pages.
-   Implement routing.
-   Connect APIs.
-   Implement authentication.
-   Implement responsive design.

### Phase 6 --- Integration

-   Connect React with Express.
-   Connect Express with MongoDB.
-   Test complete user flows.
-   Fix integration issues.

### Phase 7 --- Testing

Testing should cover:

-   Unit testing.
-   API testing.
-   Authentication testing.
-   Registration testing.
-   Role/permission testing.
-   UI testing.
-   Responsive testing.
-   Integration testing.

### Phase 8 --- Deployment

The completed application can be deployed using suitable cloud hosting
services.

``` text
Frontend
   ↓
Web Hosting

Backend
   ↓
Cloud Server

Database
   ↓
MongoDB Cloud
```

------------------------------------------------------------------------

# 33. Recommended MVP Development Order

1.  Create MongoDB database.
2.  Create User, Event, and Registration models.
3.  Build authentication APIs.
4.  Build Event CRUD APIs.
5.  Build Registration APIs.
6.  Build React login/register pages.
7.  Build Student Dashboard.
8.  Build Events and Event Details pages.
9.  Build Registration and My Registrations pages.
10. Build Faculty Dashboard.
11. Build Add/Edit/Delete Event pages.
12. Build Registered Students page.
13. Build Admin Dashboard and user management.
14. Connect all frontend pages with APIs.
15. Perform testing.
16. Deploy the application.

------------------------------------------------------------------------

# 34. Testing Requirements

## Functional Testing

Verify that:

-   Students can register/login.
-   Students can view events.
-   Students can register.
-   Duplicate registration is prevented.
-   Students can cancel eligible registrations.
-   Faculty can create events.
-   Faculty can update authorized events.
-   Faculty can delete/cancel authorized events.
-   Faculty can view registered students.
-   Admin can manage users and roles.

## Security Testing

Verify that:

-   Unauthorized users cannot access protected APIs.
-   Students cannot access faculty/admin functionality.
-   Faculty cannot access system administration.
-   Passwords are securely stored.
-   Authentication tokens are handled securely.

## Performance Testing

Verify:

-   Event pages load efficiently.
-   API responses are acceptable under normal load.
-   Multiple users can use the application simultaneously.

------------------------------------------------------------------------

# 35. Future Enhancements

## Phase 2

-   Email notifications.
-   Push notifications.
-   QR-code event check-in.
-   Digital participation certificates.
-   Event attendance tracking.

## Phase 3

-   Event feedback system.
-   Event analytics.
-   Student participation history.
-   Leaderboards.
-   Department-wise participation reports.
-   Calendar integration.

## Phase 4

-   Native/mobile application.
-   AI-based event recommendations.
-   Automated event reminders.
-   QR-based certificate verification.

------------------------------------------------------------------------

# 36. Success Metrics

The success of the system can be measured using:

-   Number of events managed digitally.
-   Number of student registrations.
-   Reduction in manual registration work.
-   Registration completion rate.
-   Number of active students.
-   Number of successfully managed events.
-   System response time.
-   User satisfaction.
-   Number of duplicate registrations prevented.

------------------------------------------------------------------------

# 37. MVP --- Minimum Viable Product

## Student

-   Registration/Login
-   View upcoming events
-   View event details
-   Register for events
-   View registered events
-   Cancel registration

## Faculty

-   Login
-   Add event
-   View events
-   Update event
-   Delete/cancel event
-   View registered students

## Administrator

-   Login
-   Manage users
-   Manage roles
-   View all events
-   Manage system settings

## Backend

-   Authentication
-   Event APIs
-   Registration APIs
-   Database
-   Role-based authorization

------------------------------------------------------------------------

# 38. Acceptance Criteria

The product will be considered successful when:

1.  Students can create accounts and log in successfully.
2.  Students can view upcoming events.
3.  Students can view complete event details.
4.  Students can register for available events.
5.  Duplicate registrations are prevented.
6.  Students can view their registrations.
7.  Students can cancel eligible registrations.
8.  Faculty can create authorized events.
9.  Faculty can update authorized events.
10. Faculty can delete/cancel authorized events.
11. Faculty can view registered students.
12. Administrators can manage users and roles.
13. Unauthorized users cannot access protected functions.
14. Event and registration information is stored correctly in MongoDB.
15. The application works on desktop and mobile screens.
16. Faculty cannot register through the student registration workflow in
    the MVP.

------------------------------------------------------------------------

# 39. Project Deliverables

The development team should deliver:

-   Responsive frontend application.
-   Backend REST API.
-   MongoDB database.
-   Authentication system.
-   Student module.
-   Faculty module.
-   Administrator module.
-   Event management module.
-   Registration management module.
-   API documentation.
-   Database schema.
-   ER diagram.
-   Testing documentation.
-   Deployment-ready application.
-   Complete project documentation.

------------------------------------------------------------------------

# 40. Complete Development Pipeline

``` text
                    PRD
                     ↓
                UI/UX Design
                     ↓
              Wireframes & Screens
                     ↓
             Database Schema
                     ↓
                 ER Diagram
                     ↓
              MongoDB Setup
                     ↓
           Node.js + Express Setup
                     ↓
               REST APIs
                     ↓
             Authentication
                     ↓
              React Frontend
                     ↓
           Frontend/API Integration
                     ↓
             Testing & Debugging
                     ↓
                 Deployment
                     ↓
            CAMPUS EVENT MANAGEMENT
                    SYSTEM
```

------------------------------------------------------------------------

# 41. Conclusion

The **Campus Event Management System** will transform the traditional
manual event-management process into a centralized digital platform.

The system will make event discovery and registration easier for
students while providing faculty coordinators with efficient tools for
creating, updating, cancelling, and monitoring events. System
administrators will maintain users, roles, and system-level settings.

The proposed architecture using **React.js, Node.js, Express.js,
MongoDB, REST APIs, and role-based authentication** provides a clear
foundation for developing a secure, maintainable, and scalable
full-stack application.

The project will follow the development sequence:

**UI Screens → Database Schema/ER Diagram → REST APIs → React Frontend →
Node/Express Backend → MongoDB → Integration → Testing → Deployment.**
