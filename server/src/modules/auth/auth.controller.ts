import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import * as authService from "./auth.service.js";
import pool from "../../config/db.js";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await authService.registerUser(req.body);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered",
      token,
      user,
    });
  } catch (err) {
    if ((err as any).code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({
      message: "Server error",
      error: (err as Error).message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await authService.loginUser(req.body);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
};

export const getMe = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({ message: "Reset link sent to email" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(
      req.params.token as string,
      req.body.password
    );
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};