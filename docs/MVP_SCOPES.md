# MVP Scope
## Ito ang pinakamaliit na version ng system na may saysay na gamitin.
### IN — Implemented
#### Authentication & User Management
* StatusPublic registration (open to all)
* Pending approval workflow
* Admin approval/rejection of users
* JWT login/logout 
* bcrypt password hashing 
* Role-based access (Admin, Mentor)
* Token expiry auto-logout

#### Member Management
* Add new follow-up member
* Auto-assign logged-in user as mentor
* View all members (all users)
* Edit own follow-up members
* Delete own follow-up members
* Admin can edit/delete all members
* Member detail page
* Search by name
* Filter by progress stage

#### Progress Monitoring
* 5-stage progress tracking
* Progress stage update
* Progress history log
* Visual progress badges

#### Mentor Dashboard
* View all mentors
* View mentor's follow-up members
* Progress stage summary per mentor

#### Dashboard
* Stat cards (Total, Pre-FIC, In Progress, CellDev)
* Recent members table

#### UI/UX
* Warm & Friendly design (TailwindCSS)
* Loading states (react-spinners)
* Toast notifications (react-hot-toast)
* Form validation (frontend + backend)
* Empty states
* Error states with retry
* 404 page
* Confirmation modal for delete

#### Technical
* Docker + Docker Compose setup
* PostgreSQL (3NF normalized schema)
* REST API (Node.js + Express)
* React + Vite frontend
* Git branching + signed-off commits
* Unit tests (Vitest) — 22 tests
* Integration tests (Jest) — 20 tests

### OUT — Future Features
* Member self-login portal - Complex
* Notifications / reminders - Nice to have
* Analytics / charts - Later phase
* Mobile app - Web muna
* Export to PDF/Excel - Later phase
* Advanced Search & Filters - Filter by mentor, date range, multiple stages
* Cloud Deployment - Online accessible (AWS, Railway, Render)
* Rate Limiting - Protection against brute-force

### Role Summary
ADMIN
* Same as Mentor (base features)
* Edit ANY member
* Delete ANY member
* Approve/reject pending users
* Delete active users

MENTOR
* View ALL members
* Add own follow-up members
* Edit OWN follow-ups only
* Delete OWN follow-ups only
* View Mentor Dashboard (read-only for others)