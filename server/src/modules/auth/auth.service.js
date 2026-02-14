const { createUser, findUserByEmail } = require("../../models/user.model");
const { hashPassword } = require("../../utils/hash");

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

module.exports = { registerUser };