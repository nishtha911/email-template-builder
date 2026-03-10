import { createUser, findUserByEmail } from "../../models/user.model.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import crypto from "crypto";
import pool from "../../config/db.js";
import sendEmail from "../../utils/email.js";

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  const existing = await findUserByEmail(email);
  if (existing) {
    const error: any = new Error("Email already registered");
    error.code = "23505";
    throw error;
  }

  const hashed = await hashPassword(password);
  const user = await createUser(name, email, hashed);

  return user;
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const forgotPassword = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("No user found with that email");

  const resetToken = crypto.randomBytes(20).toString("hex");

  const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expiry = new Date(Date.now() + 3600000);
  await pool.query(
    "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
    [tokenHash, expiry, user.id]
  );

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  const message = `Forgot your password? Click here to reset: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message
    });
    return resetToken;
  } catch (err) {
    console.error("EMAIL ERROR:", (err as Error).message);
    console.error("FULL ERROR:", err);
    await pool.query(
      "UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE id = $1",
      [user.id]
    );
    throw new Error("Email could not be sent");
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const { rows } = await pool.query(
    "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
    [tokenHash]
  );

  const user = rows[0];
  if (!user) throw new Error("Token is invalid or has expired");

  const hashed = await hashPassword(newPassword);
  await pool.query(
    "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
    [hashed, user.id]
  );

  return user;
};

