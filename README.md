# Email Template Builder

A full-stack drag-and-drop email template builder with React + TypeScript on the frontend and Express + TypeScript on the backend.

## Prerequisites

- Node.js v18+
- PostgreSQL database

## Environment Setup

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASS=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/nishtha911/email-builder.git
cd email-template-builder
```

### 2. Server

```bash
cd server
npm start
```

Server runs at **http://localhost:5000**

### 3. Client

```bash
cd client
npm install
npm run dev
```

Client runs at **http://localhost:5173**

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, TypeScript, Vite, MUI v6      |
| Backend  | Node.js, Express 5, TypeScript, tsx     |
| Database | PostgreSQL (via `pg`)                   |
| Auth     | JWT, bcrypt                             |
| Email    | Nodemailer                              |