# 📧 Email Template Builder

A full-stack drag-and-drop email template builder with React + TypeScript on the frontend and Express + TypeScript on the backend. Create, edit, and manage email templates effortlessly with a user-friendly interface.

## ✨ Features

- 🖱️ **Drag-and-Drop Editor**: Intuitive canvas for building email templates.
- 🤖 **AI Assistant**: Generate email content and sections with integrated AI chat.
- 📝 **Template Management**: Create, read, update, and delete email templates.
- 🔐 **Authentication**: Secure login, registration, forgot/reset password.
- 📧 **Email Sending**: Send emails using Nodemailer integration.
- 🎨 **Customizable Elements**: Text, images, buttons, and more with property panels.
- 📱 **Responsive Design**: Built with Material-UI for a modern UI.

## 📋 Prerequisites

- 🟢 Node.js v18+
- 🐘 PostgreSQL database

## ⚙️ Environment Setup

Create `.env` files in the respective directories.

### Server Environment (`server/.env`)

```env
CORS_ALLOWED_ORIGIN=http://localhost:3000
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

### Client Environment (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Installation & Running

### 1. 📥 Clone the repository

```bash
git clone https://github.com/nishtha911/email-template-builder.git
cd email-template-builder
```

### 2. 🖥️ Server Setup

```bash
cd server
npm install
npm start
```

Server runs at **http://localhost:5000**

### 3. 🌐 Client Setup

```bash
cd client
npm install
npm run dev
```

Client runs at **http://localhost:3000**

## 🛠️ Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| 🎨 Frontend | React 18, TypeScript, Vite, Material-UI |
| ⚙️ Backend  | Node.js, Express 5, TypeScript, tsx     |
| 🗄️ Database | PostgreSQL (via `pg`)                   |
| 🔐 Auth     | JWT, bcrypt                             |
| 📧 Email    | Nodemailer                              |

## 📁 Project Structure

```
email-template-builder/
├── 📁 client/          # React frontend
├── 📁 server/          # Express backend
├── 📁 db/              # Database schema
└── 📄 README.md        # This file
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
| Auth     | JWT, bcrypt                             |
| Email    | Nodemailer                              |
