# Functional Specs
## Formal List of the functionality of the System
### Members Module

* Create, Read, Update, Delete (CRUD) of a Member (Follow-up)
* Fields: Name, Progress, Mentor, Classification, Details
* View all member details
* Search and Filter

### Admin Module
* View Users who is pending or active
* Approve User
* Reject/Delete User
* Default Role

### Progress Stages (in order)
```bash
Pre-FIC → FIC1 → FIC2 → Pre-CellDev → CellDev
```
### Classification Options
```bash
Grade School | Junior High | Senior High | Undergrad | Professional | TBA
```
### Mentor Dashboard
* View other Mentors
* View Mentor's Follow ups

### Dashboard Module
* Stat Cards - Total Members, Pre-FIC, In Progress, Cell Dev
* Recent Members Table

### UI/UX Specifications 
* Design System
* Loading States
* Error States
* Empty States
* Form Validation
* 404 Page

### Authentication Module

* Registration
* Login
* Logout
* Password Security

### Security Specifications
* Password hashing - bcrypt (10 salt rounds)
* Authentication - JWT (7-day expiry)
* Authorization - Role-based middleware
* Token storage - localStorage
* Token expiry handling - Auto-redirect sa login page
* Protected routes - Frontend + Backend validation
* Admin-only routes - adminOnly middleware
* Ownership check - mentor_id === req.user.id