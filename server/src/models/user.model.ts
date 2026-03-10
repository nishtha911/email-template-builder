import pool from "../config/db.js";

const createUser = async (name: string, email: string, passwordHash: string) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;

  const values = [name, email, passwordHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email: string) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return rows[0];
};

export {
  createUser,
  findUserByEmail,
};
