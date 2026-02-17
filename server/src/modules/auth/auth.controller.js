const jwt = require("jsonwebtoken");
const authService = require("./auth.service");
const pool = require("../../config/db");

exports.register = async (req, res) => {
  try {
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
    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
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
    res.status(401).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
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
