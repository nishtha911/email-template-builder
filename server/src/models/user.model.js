const pool = require("../config/db");

const createUser = async (name, email, password) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;

  const values = [name, email, password];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  return rows[0];
};

module.exports = { createUser, findUserByEmail };
