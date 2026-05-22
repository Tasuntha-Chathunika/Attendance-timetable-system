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

<table align="center" style="width: 100%;">
  <tr>
    <td align="center" width="50%">
      <b>Landing Page</b><br/>
      <img src="./screenshots/landing.png" alt="Landing Page" style="border-radius: 8px; margin-top: 10px;" />
    </td>
    <td align="center" width="50%">
      <b>Login Portal</b><br/>
      <img src="./screenshots/login.png" alt="Login Portal" style="border-radius: 8px; margin-top: 10px;" />
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <b>Registration Portal</b><br/>
      <img src="./screenshots/register.png" alt="Register Portal" style="border-radius: 8px; margin-top: 10px;" />
    </td>
    <td align="center" width="50%">
      <b>Admin Dashboard (Placeholder)</b><br/>
      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Admin Dashboard" style="border-radius: 8px; margin-top: 10px;" />
    </td>
  </tr>
</table>

---

## ✨ Core Features

- 🔐 **Secure Role-Based Architecture:** Intelligent routing and personalized data access for `Admin`, `Lecturer`, and `Student` tiers.
- 🎨 **Premium Enterprise UI:** Glassmorphism aesthetics, dynamic SVG iconography, fluid micro-interactions, and deep Tailwind CSS integrations.
- ⚡ **Real-Time Attendance Tracking:** Lecturers can mark attendance via intuitive toggle interfaces, updating central databases instantly.
- 📅 **Smart Timetable Management:** Effortless scheduling for admins. Faculty and students get immediate access to real-time academic calendars.
- 📊 **Dynamic Data Visualization:** High-level overview cards, circular progress indicators, and comprehensive user data tables.
- 🖼️ **Automated Avatars:** Integrated `ui-avatars` API to generate sleek, color-coded profile pictures dynamically.

---

## 💻 Tech Stack

<details>
  <summary><b>Click to expand architecture details</b></summary>
  <br/>
  
  **Frontend (Client-Side)**
  - **Framework:** React.js (Vite)
  - **Styling:** Tailwind CSS (Vanilla)
  - **State Management:** React Hooks (`useState`, `useEffect`)
  - **HTTP Client:** Axios

  **Backend (Server-Side & API)**
  - **Language:** PHP 8.x
  - **Architecture:** Custom RESTful API endpoints
  - **Security:** Prepared Statements (PDO), CORS headers, JSON responses

  **Database**
  - **Engine:** MySQL (MariaDB via XAMPP)
  - **Structure:** Relational schema optimized for attendance mapping.
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
3. Create a new database named `attendance_system`.
4. Import the provided `atms_schema.sql` file into the new database.

### 4. Backend Setup
1. Move the `backend` folder into your XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\Attendance-timetable-system`).
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