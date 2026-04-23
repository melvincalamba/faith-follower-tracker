# Functional Specs
## Ito na ang pormal na listahan ng kung ano ang kaya ng system.
### Members Module

* Create, Read, Update, Delete (CRUD) ng member records
* Fields: Name, Progress, Mentor, Classification, Details

### Progress Stages (in order)
```bash
Pre-FIC → FIC1 → FIC2 → Pre-CellDev → CellDev
```
### Classification Options
```bash
Grade School | Junior High | Senior High | Undergrad | Professional | TBA
```
### Mentor Module

* Mag-assign ng mentor sa bawat member
* Mentor ay may sariling listahan ng mga assigned members

### Auth Module

* Admin login
* Mentor login
* Role-based view (Admin sees all, Mentor sees assigned only)