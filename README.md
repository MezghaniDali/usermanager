Web Application Test – Laravel + React + MongoDB Atlas

Description

This project is a web application demonstrating user authentication and user management features using the following technologies:

Backend: Laravel API with MongoDB Atlas (using jenssegers/laravel-mongodb driver)

Frontend: React with ShadCN UI components (using Next.js)

Authentication: Laravel Sanctum for secure SPA authentication

Database: MongoDB Atlas


Features

User registration and login with secure authentication via Laravel Sanctum

Protected routes on backend and frontend

CRUD operations on users (Create, Read, Update, Delete)

Responsive UI with ShadCN design system


Installation

1. Clone the repository

git clone [your-repo-link]  
cd [repo-folder]


2. Backend setup

Copy .env.example to .env and update with your MongoDB Atlas connection string and other environment variables

Install dependencies and run migrations (if applicable)


composer install  
php artisan key:generate  
php artisan migrate  
php artisan serve


3. Frontend setup

Navigate to the frontend folder (if separate)

Install dependencies and start the development server


npm install  
npm run dev



Configuration

MongoDB Atlas:

Create a free MongoDB Atlas cluster

Whitelist your IP or allow access from anywhere for testing

Create a database and get the connection URI

Paste the URI in your .env file under MONGO_DB_URI or equivalent



Usage

Start backend server: php artisan serve

Start frontend server: npm run dev (or yarn dev)

Access the frontend at http://localhost:3000 (or specified port)

Register a new user or login with existing credentials

Manage users via the UI


Technical choices

Used Laravel Sanctum for secure API authentication, which integrates smoothly with single-page applications (SPA) like React

Chose MongoDB Atlas for scalable cloud database solution

Integrated ShadCN UI in React for modern, accessible, and responsive UI components

Structured API routes with middleware to protect resources


Notes

This project is a work in progress and will be updated until final delivery

For any questions or clarifications, feel free to contact me