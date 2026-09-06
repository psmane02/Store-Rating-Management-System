# Store Rating Management System

A full-stack web application that allows users to view registered stores,
submit ratings from 1 to 5, and manage store ratings based on their roles.

This project was developed as a Full Stack Developer coding challenge.

---

## Developer

**Prachi Suryakant Mane**

MCA Student 

---

## Project Overview

The Store Rating Management System is a role-based web application
designed to manage stores, users, and store ratings.

The application provides a single login system and gives different
functionalities to users based on their roles.

### User Roles

1. System Administrator
2. Normal User
3. Store Owner

---

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Git
- GitHub
- MySQL / phpMyAdmin

---

## Features

---

## Screenshots

### Login Page

![Login Page](screenshots/login.png)

### Signup Page

![Signup Page](screenshots/signup.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### User Dashboard within the admin panel

![User Dashboard](screenshots/user-dashboard.png)

### Store Listing & Rating within the admin panel

![Store Listing](screenshots/store-dashboard.png)

### Add Users within the admin panel

![Store Listing](screenshots/add-user.png)

### Add Stores within the admin panel

![Store Listing](screenshots/add-store.png)

### Change Password

![Change Password](screenshots/change-password.png)

### Owner Dashboard

![Owner Dashboard](screenshots/owner-dashboard.png)

### The image below the Owner Dashboard

![Owner Dashboard](screenshots/owner-dashboard2.png)

### User Dashboard

![User Dashboard](screenshots/user-dashboard-og.png)

---

---

## 🗄️ Database Screenshots

### Database Structure

![Database Structure](screenshots/database-structure.png)

### Users Table

![Users Table](screenshots/users.png)

### Stores Table

![Stores Table](screenshots/stores.png)

### Ratings Table

![Ratings Table](screenshots/ratings.png)

---

### Authentication

- Single login system for all users
- JWT-based authentication
- Role-based authorization
- Secure password hashing using bcrypt
- Change password functionality
- Logout functionality

---

## System Administrator

The administrator can:

- View dashboard statistics
- View total users
- View total stores
- View total submitted ratings
- Add new stores
- Add normal users
- Add admin users
- View users
- View stores
- Filter users
- Filter stores
- Sort records in ascending and descending order
- View user details
- View store owner ratings

---

## Normal User

Normal users can:

- Sign up
- Login
- View all registered stores
- Search stores by name
- Search stores by address
- View overall store rating
- View their submitted rating
- Submit a rating from 1 to 5
- Modify their submitted rating
- Change password
- Logout

---

## Store Owner

Store owners can:

- Login
- View their store
- View average store rating
- View customers who submitted ratings
- View customer details
- Change password
- Logout

---

## Rating System

Users can submit ratings between:

1 to 5
Users can also modify their previously submitted rating.

---

## Admin Dashboard

The Admin Dashboard provides an overview of the entire system.

It includes:

- Total number of users
- Total number of stores
- Total number of ratings
- User management
- Store management
- Add new users
- Add new stores
- Search and filtering
- Ascending and descending sorting

---

## Store Search & Filtering

Users and administrators can easily find records using search and filters.

---

### User Filters

- Name
- Email
- Address
- Role

---

### Store Filters

- Store Name
- Email
- Address

Records can also be sorted in:

- Ascending order
- Descending order

---

## Security

The application implements several security practices:

- JWT authentication
- Role-based access control
- Password hashing using bcrypt
- Protected API routes
- Input validation
- Environment variables for sensitive configuration
- Unique email validation
- Unique user-store rating constraint

---

## Database Design

The application uses MySQL as the database.

---

### Main Tables

Relationships
User ───────< Ratings >─────── Store

- One user can rate multiple stores.
- One store can receive ratings from multiple users.
- A user can submit only one rating for a particular store.
- Users, stores, and ratings are connected using foreign keys.

---

## Project Structure

```text
Store Rating Management System
│
├── backend
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── storeController.js
│   │   └── ratingController.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── storeRoutes.js
│   │   └── ratingRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── database
│   └── schema.sql
│
├── .gitignore
└── README.md
```

---

## Installation & Setup

1. Clone the Repository-

git clone https://github.com/psmane02/Store-Rating-Management-System.git

2. Open the Project-

cd Store-Rating-Management-System

---

## Database Setup

- Open MySQL or phpMyAdmin.
- Run the SQL file:

  database/schema.sql

- This will create the required database and tables.

---

## Backend Setup

- Open a terminal inside the backend folder:
  cd backend

- Install dependencies:
  npm install

- Create a .env file:
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=roxiler_store_rating
    JWT_SECRET=your_jwt_secret

- Start the backend:
    node server.js

- The backend will run on:
    http://localhost:5000

---

## Frontend Setup

- Open another terminal:
    cd frontend

- Install dependencies:
    npm install

- Start the React application:
    npm run dev

- The frontend will run on the Vite development server.

---

## API Health Check

- After starting the backend, open:
    http://localhost:5000/api/health

- A successful response should indicate that the database is connected.

---

## Default Roles

- The application supports three roles:
Role                Access
ADMIN - Manage users, stores and system data
USER - View stores and submit ratings
OWNER - View own store and customer ratings

---

## Important Note

- The .env file contains sensitive configuration and is excluded from GitHub using .gitignore.

- Do not upload passwords, secret keys, or other sensitive credentials to GitHub.

---

## Project Objective

The main objective of this project is to demonstrate practical knowledge of:
    - React.js
    - Node.js
    - Express.js
    - MySQL
    - REST APIs
    - JWT Authentication
    - Role-Based Authorization
    - CRUD Operations
    - Database Relationships
    - Form Validation
    - Responsive UI Development

---

## Developer

Prachi Suryakant Mane
MCA Student
GitHub: psmane02

---

## Project

- This project was developed as part of the Roxiler Systems Pvt Ltd Full Stack Developer – Trainee Coding Challenge.