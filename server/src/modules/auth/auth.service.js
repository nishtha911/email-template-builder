const { createUser, findUserByEmail } = require("../../models/user.model");
const { hashPassword } = require("../../utils/hash");
const { comparePassword } = require("../../utils/hash");

const registerUser = async (data) => {
  const { name, email, password } = data;

  const existing = await findUserByEmail(email);
  if (existing) {
    const error = new Error("Email already registered");
    error.code = "23505";
    throw error;
  }

  const hashed = await hashPassword(password);
  const user = await createUser(name, email, hashed);
  return user;
};

const loginUser = async (data) => {
  const { email, password } = data;
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error("Invalid email or password");
    error.code = "401";
    throw error;
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.code = "401";
    throw error;
  }
  return user;
};

module.exports = { registerUser, loginUser };