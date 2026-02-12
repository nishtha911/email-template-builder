const { createUser, findUserByEmail } = require("../../models/user.model");
const { hashPassword } = require("../../utils/hash");

const registerUser = async (data) => {
  const { name, email, password } = data;

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const hashed = await hashPassword(password);

  const user = await createUser(name, email, hashed);
  return user;
};

module.exports = { registerUser };
