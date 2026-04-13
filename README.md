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

- 🟢 Node.js v18+ (for development)
- 🐘 PostgreSQL database (or Docker)

## 🐳 Docker Setup (Recommended)

### 1. 📝 Environment Configuration

Copy the provided `.env` file and update the values:

```bash
cp .env .env.local  # Optional: for local overrides
```

Update the following variables in `.env`:
- `DB_USER`, `DB_PASS`: Database credentials
- `JWT_SECRET`: A secure random string
- `EMAIL_USER`, `EMAIL_PASS`: Your email credentials

### 2. 🚀 Run with Docker Compose

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL with the `email_builder` database
- Run database migrations (schema.sql)
- Build and start the server on port 5000
- Build and start the client on port 5173

Access the application at **http://localhost:5173**

### 3. 🛑 Stop Services

```bash
docker-compose down
```

## 🔧 Manual Setup (Development)

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

## ️ Tech Stack

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
