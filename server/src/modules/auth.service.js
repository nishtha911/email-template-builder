const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

exports.createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email;
  `;

  const values = [name, email, hashedPassword];
  const { rows } = await pool.query(query, values);

  return rows[0];
};
