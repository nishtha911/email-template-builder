import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import templateRoutes from "./modules/templates/template.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/upload", uploadRoutes);

import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), '../uploads')));

export default app;