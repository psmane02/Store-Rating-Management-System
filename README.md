# Store Rating Management System

A full-stack web application that allows users to view registered stores,
submit ratings from 1 to 5, and manage store ratings based on their roles.

This project was developed as a Full Stack Developer coding challenge.

---

## Developer

**Prachi Mane**

MCA Student | Full Stack Developer

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

```text
1 to 5