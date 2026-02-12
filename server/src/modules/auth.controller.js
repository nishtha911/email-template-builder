const { registerUser } = require("./auth.service");

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "User registered",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register };
