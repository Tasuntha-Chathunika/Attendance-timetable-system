<div align="center">

  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" alt="ATMS Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  # 🎓 Attendance & Timetable Management System (ATMS)

  **A Premium, Enterprise-Grade SaaS Platform for Modern Educational Institutes.**

  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.php.net/"><img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" /></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" /></a>
    <img src="https://img.shields.io/badge/Version-2.0.0-success?style=for-the-badge" alt="Version 2.0.0" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License MIT" />
  </p>

  <p align="center">
    <a href="#-overview">Overview</a> •
    <a href="#-ui-showcase">UI Showcase</a> •
    <a href="#-core-features">Features</a> •
    <a href="#-installation--setup">Installation</a> •
    <a href="#-author">Author</a>
  </p>
</div>

---

## 🚀 Overview

> **"Say goodbye to manual roll calls and spreadsheet schedules. Experience the future of academic management."**

ATMS is a robust, highly secure, and visually breathtaking Full-Stack web application designed to eliminate administrative friction in educational environments. 

Built with a lightning-fast React frontend and a reliable PHP/MySQL backend, ATMS provides a unified ecosystem where Administrators, Lecturers, and Students can interact seamlessly through dedicated, role-based dashboards.

---

## 📸 UI Showcase

We believe enterprise software should be as beautiful as it is functional. Here is a glimpse of our premium design system in action:

### 🏠 Landing Page & Portal Access
Beautiful, modern landing page with smooth gradients and glassmorphism elements to welcome users into the system.
<p align="center">
  <img src="./screenshots/home.png" alt="ATMS Landing Page" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 900px;" />
</p>

### 🛡️ Administrator Command Center
Full control over the institution. Manage users, courses, schedules, and analytics from a centralized, elegant dashboard.
<p align="center">
  <img src="./screenshots/admin.png" alt="Admin Dashboard" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 900px;" />
</p>

### 👨‍🏫 Faculty & Lecturer Dashboard
Dedicated workspace for faculty members to view their specific schedules and seamlessly mark student attendance.
<p align="center">
  <img src="./screenshots/lecturer.png" alt="Lecturer Dashboard" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 900px;" />
</p>

### 🎓 Student Portal
An interactive hub for students to track their overall attendance percentage, view upcoming classes, and stay updated.
<p align="center">
  <img src="./screenshots/student.png" alt="Student Dashboard" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 900px;" />
</p>

---

## ✨ Core Features

- 🔐 **Secure Role-Based Architecture:** Intelligent routing and personalized data access for `Admin`, `Lecturer`, and `Student` tiers with automated session management.
- 🎨 **Premium Enterprise UI:** Glassmorphism aesthetics, dynamic SVG iconography, fluid micro-interactions, and deep Tailwind CSS integrations designed for maximum visual impact.
- ⚡ **Real-Time Attendance Tracking:** Lecturers can mark attendance via intuitive toggle interfaces, updating central databases instantly.
- 📅 **Smart Timetable Management:** Effortless scheduling for admins. Faculty and students get immediate access to real-time academic calendars.
- 🔔 **Instant Notifications:** Integrated notification panels for students and staff to receive critical updates and alerts.
- 📊 **Dynamic Data Visualization:** High-level overview cards, circular progress indicators for attendance tracking, and comprehensive user data tables.
- 🖼️ **Automated Avatars:** Integrated `ui-avatars` API to generate sleek, color-coded profile pictures dynamically based on user roles.

---

## 💻 Tech Stack

<details open>
  <summary><b>Click to expand architecture details</b></summary>
  <br/>
  
  **Frontend (Client-Side)**
  - **Framework:** React.js (Vite)
  - **Styling:** Tailwind CSS (Vanilla)
  - **State Management:** React Hooks (`useState`, `useEffect`)
  - **HTTP Client:** Axios
  - **Routing:** Conditional Component Rendering

  **Backend (Server-Side & API)**
  - **Language:** PHP 8.x
  - **Architecture:** Custom RESTful API endpoints
  - **Security:** Prepared Statements (PDO & MySQLi), CORS headers, JSON responses

  **Database**
  - **Engine:** MySQL (MariaDB via XAMPP)
  - **Structure:** Advanced relational schema optimized for multi-role attendance and timetable mapping.
</details>

---

## ⚙️ Installation & Setup

Want to run this project locally? Follow these steps:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18+) & **npm**
- **XAMPP** (or equivalent Apache/MySQL server)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/Tasuntha-Chathunika/Attendance-timetable-system.git
cd Attendance-timetable-system
```

### 3. Database Configuration
1. Start **Apache** and **MySQL** from your XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Create a new database named `atms_db`.
4. Import the provided `atms_schema.sql` and `atms_schema_v2.sql` files into the new database.

### 4. Backend Setup
1. Move the entire project folder into your XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\Attendance-timetable-system`).
2. Ensure the API endpoint routes in your React code map correctly to `http://localhost/Attendance-timetable-system/backend/api/`.

### 5. Frontend Setup
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173/` in your browser. You're all set! 🎉

---

## 👨‍💻 Author

<div align="center">
  <img src="https://ui-avatars.com/api/?name=S.D.+Tasuntha&background=6366f1&color=fff&size=100&bold=true" style="border-radius: 50%; margin-bottom: 10px;" alt="S.D. Tasuntha" />
  
  **Designed & Developed by S.D. Tasuntha**
  
  *Open Source Enthusiast | Full Stack Developer | UI/UX Engineer*
</div>

---
<p align="center">Made with ❤️ and clean code.</p>