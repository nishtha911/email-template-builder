const jwt = require("jsonwebtoken");
const authService = require("./auth.service");

exports.register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered",
      token,
      user,
    });

  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};