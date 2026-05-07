# 🙏 Faith Follower Tracker

A discipleship progress tracking system for cell groups and mentors.
Built as a capstone project using the PERN stack.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

---

## Overview

Faith Follower Tracker is a web-based system designed to help
cell leaders and mentors track the discipleship journey of their
follow-up members — from Pre-FIC all the way to Cell Development.

---

## ✨ Features

- 🔐 JWT Authentication with role-based access
- 👥 Member management (Add, Edit, Delete)
- 📈 Progress tracking (Pre-FIC → FIC1 → FIC2 → Pre-CellDev → CellDev)
- 📝 Progress history — tracks every stage change
- 👤 Mentor dashboard — view all mentors and their follow-ups
- ✅ Admin approval workflow for new user registrations
- 🔍 Search and filter members
- 📱 Responsive UI with warm & friendly design

---

## 🛠 Tech Stack

| Layer          | Technology              |
|----------------|-------------------------|
| Frontend       | React 18, Vite, TailwindCSS |
| Backend        | Node.js, Express        |
| Database       | PostgreSQL 15           |
| Auth           | JWT, bcryptjs           |
| Containerization | Docker, Docker Compose |
| Testing        | Vitest, Jest, Supertest |

---

## 🏗 System Architecture

```
faith-follower-tracker/
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── test/         # Unit tests
│   │   └── utils/        # Validation utilities
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth middleware
│   │   └── routes/       # API routes
├── database/          # SQL migration files
└── docker-compose.yml # Container orchestration
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js LTS](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. I-clone ang repository
git clone https://github.com/YOUR_USERNAME/faith-follower-tracker.git
cd faith-follower-tracker

# 2. I-start ang database
docker compose up db -d

# 3. I-setup ang backend
cd backend
npm install
npm run dev

# 4. I-setup ang frontend (bagong terminal)
cd frontend
npm install
npm run dev
```

Buksan ang browser sa **http://localhost:5173**

---

## 🔑 Environment Variables

Gumawa ng `.env` file sa `backend/` folder:

```env
PORT=3001
DB_USER=fft_user
DB_PASSWORD=fft_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=faith_follower_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

---

## 📡 API Documentation

### Auth Endpoints
| Method | Endpoint             | Description              | Auth |
|--------|----------------------|--------------------------|------|
| POST   | /api/auth/register   | Register new user        | ❌   |
| POST   | /api/auth/login      | Login                    | ❌   |
| GET    | /api/auth/me         | Get current user         | ✅   |

### Members Endpoints
| Method | Endpoint                  | Description           | Auth |
|--------|---------------------------|-----------------------|------|
| GET    | /api/members              | Get all members       | ✅   |
| GET    | /api/members/:id          | Get member by ID      | ✅   |
| POST   | /api/members              | Create member         | ✅   |
| PUT    | /api/members/:id          | Update member         | ✅   |
| DELETE | /api/members/:id          | Delete member         | ✅   |
| GET    | /api/members/:id/history  | Get progress history  | ✅   |

### Mentors Endpoints
| Method | Endpoint                    | Description                | Auth |
|--------|-----------------------------|----------------------------|------|
| GET    | /api/mentors                | Get all mentors            | ✅   |
| GET    | /api/mentors/:id/members    | Get members of a mentor    | ✅   |

### Users Endpoints (Admin Only)
| Method | Endpoint                  | Description           | Auth  |
|--------|---------------------------|-----------------------|-------|
| GET    | /api/users                | Get all users         | Admin |
| PATCH  | /api/users/:id/approve    | Approve pending user  | Admin |
| DELETE | /api/users/:id            | Delete user           | Admin |

---

## 👥 User Roles

### Admin & Mentor (Same Base Features)
- ✅ View all members
- ✅ Add follow-up members
- ✅ Edit own follow-ups
- ✅ Delete own follow-ups
- ✅ View Mentor Dashboard

### Admin (Additional)
- ✅ Edit all members
- ✅ Delete all members
- ✅ Approve/reject new user registrations
- ✅ User management

---

## 🧪 Running Tests

```bash
# Frontend tests
cd frontend
npm run test:run

# Backend tests
cd backend
npm test
```

Expected output:
```
Frontend: 22/22 tests passed ✅
Backend:  21/21 tests passed ✅
```

---

## 🐳 Deployment

```bash
# Production build
docker compose up --build -d

# Stop all containers
docker compose down
```

---

## 👨‍💻 Developer

Built with 🙏 as a Capstone Project