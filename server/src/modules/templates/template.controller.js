const pool = require("../../config/db");

exports.saveTemplate = async (req, res) => {
  try {
    const { id, name, content } = req.body;
    const userId = req.userId;

    if (id) {
      const updateQuery = `
        UPDATE templates 
        SET name = $1, content = $2, updated_at = NOW()
        WHERE id = $3 AND user_id = $4
        RETURNING *;
      `;
      const { rows } = await pool.query(updateQuery, [name, JSON.stringify(content), id, userId]);
      
      if (rows.length === 0) return res.status(404).json({ message: "Template not found" });
      return res.status(200).json({ message: "Template updated", template: rows[0] });
    } else {
      const insertQuery = `
        INSERT INTO templates (user_id, name, content)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const { rows } = await pool.query(insertQuery, [userId, name || "Untitled", JSON.stringify(content)]);
      return res.status(201).json({ message: "Template created", template: rows[0] });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const userId = req.userId;
    const { rows } = await pool.query(
      "SELECT id, name, created_at FROM templates WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { rows } = await pool.query(
      "SELECT * FROM templates WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    await pool.query("DELETE FROM templates WHERE id = $1 AND user_id = $2", [id, userId]);
    res.status(200).json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};