import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import templateRoutes from "./modules/templates/template.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ALLOWED_ORIGIN,
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);

export default app;