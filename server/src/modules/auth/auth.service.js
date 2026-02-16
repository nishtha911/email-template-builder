const {
  createUser,
  findUserByEmail,
} = require("../../models/user.model");

const {
  hashPassword,
  comparePassword,
} = require("../../utils/hash");

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

module.exports = {
  registerUser,
  loginUser,
};
