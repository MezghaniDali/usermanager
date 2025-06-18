# User Manager – Technical Test

## Description
A full-stack web application for user management, built as part of a technical test. The stack includes:
- **Backend:** Laravel 12 (API mode) with MongoDB Atlas 
- **Frontend:** React with ShadCN UI
- **Styling:** ShadCN UI components and Tailwind CSS utility classes
- **Authentication:** Custom token system (see below for explanation)

---

## 🚀 Quick Start

### 1. Clone the repository
bash
git clone https://github.com/MezghaniDali/usermanager.git
cd usermanager


### 2. Backend Setup (Laravel API)
bash
cd backend
# Copy environment file
# On Windows PowerShell:
Copy-Item .env.example .env
# On Mac/Linux:
cp .env.example .env

- Open .env and set your MongoDB Atlas URI and credentials (see below).

bash
composer install
php artisan key:generate
php artisan migrate   # (if needed)
php artisan serve

- The backend will run at http://localhost:8000 by default.

### 3. Frontend Setup (React)
bash
cd ../frontend
npm install
npm run dev

- The frontend will run at http://localhost:5173 by default.

> **Note:** Keep both the backend and frontend servers running in separate terminals for the app to work properly.

---

## ⚙️ MongoDB Atlas Configuration
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Whitelist your IP address in the Atlas dashboard 
- Copy your connection string and update the DB_URI in your .env file:
  
env
  DB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority"
  DB_DATABASE=usermanager


---

## Features
- **User Authentication:**
  - Registration and login (secure password hashing)
  - API authentication with custom token system (see below)
  - Middleware-protected routes 
- **User Management :**
  - List, create, update, and delete users
  - Responsive user table (ShadCN UI)
  - All actions interact with the Laravel API and MongoDB Atlas
- **Security:**
  - Passwords hashed with bcrypt
  - Admin-only routes protected by middleware
  - Input validation 

---

## 👤 User Roles & Access
- **First registered user** automatically receives admin privileges
- **Admin users** can:
  - Access user management (CRUD operations via "Manage Users" button)
  - View comprehensive dashboard with stats
- **Regular users** have:
  - Limited dashboard showing only their personal information
  - No access to user management features

--


## Why not Sanctum?
> **Note:** I initially implemented Laravel Sanctum for authentication, as recommended. However, I encountered integration issues between Sanctum and MongoDB (via jenssegers/laravel-mongodb). Sanctum is designed for Eloquent (SQL) and requires extra workarounds for MongoDB, which can be unstable or time-consuming. To keep the project on track, I implemented a custom token system with secure middleware and validation. In a real-world SQL-based Laravel project, I would use Sanctum or Passport for authentication.

---

## Security Notes
- All sensitive routes are protected by authentication and admin middleware
- Passwords are always hashed
- user input is validated

---

## Screenshots

![Admin Dashboard](screenshots/dashboard-admin.png)
![User Dashboard](screenshots/dashboard-user.png)
![Home Page](screenshots/home.png)
![Login Page](screenshots/login.png)
![Manage Users](screenshots/manageUsers.png)
![Edit User Modal](screenshots/editModal.png)
![Register Page](screenshots/register.png)

---

## Technical Choices & Trade-offs
- **Sanctum:** Attempted but replaced due to MongoDB integration issues. Custom token system used for demo purposes.
- **jenssegers/laravel-mongodb:** Used for MongoDB Eloquent support.
- **ShadCN UI:** For modern, accessible React components.


---

## License
MIT