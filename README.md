This is a demo Learning Management System (LMS) built to demonstrate core LMS features such as course management, assignment handling, and role-based access for students and instructors.

# Features:
# Student
- View available courses
- Enroll in courses
- Upload assignments
- View submitted assignments and deadlines

# Instructor
- Create and manage courses
- Create assignments
- View student submissions
- Delete or update assignments

# Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/lms-demo.git
cd lms-demo

2. Frontend 
npm run dev

3.Backend
npm run start:dev

## Project Structure

```txt
client/
 ├─ public/                # Static public files
 ├─ src/
 │   ├─ assets/            # Images and static assets
 │   ├─ components/        # Reusable React components
 │   ├─ App.jsx            # Main app component
 │   ├─ main.jsx           # Application entry point
 │   ├─ index.css          # Global styles
 │   └─ App.css            # App-specific styles
 ├─ index.html
 ├─ package.json
 └─ vite.config.js

server/
 ├─ src/
 │   ├─ auth/              # Authentication and authorization
 │   ├─ user/              # User management
 │   ├─ courses/           # Course-related logic
 │   ├─ assignments/       # Assignment creation and management
 │   ├─ submissions/       # Student assignment submissions
 │   ├─ app.module.ts      # Root application module
 │   └─ main.ts            # Server entry point
 ├─ uploads/               # Uploaded assignment files
 ├─ dist/                  # Compiled output
 ├─ package.json
 └─ README.md

