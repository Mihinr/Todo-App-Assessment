import db from '../config/database.js';

class Task {
  static async create(title, description) {
    const [result] = await db.execute(
      'INSERT INTO task (title, description) VALUES (?, ?)',
      [title, description]
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM task WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findRecent(limit = 5) {
    const limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue < 1) {
      throw new Error('Limit must be a positive integer');
    }
    const [rows] = await db.execute(
      `SELECT * FROM task 
       WHERE completed = FALSE 
       ORDER BY created_at DESC 
       LIMIT ${limitValue}`,
      []
    );
    return rows;
  }

  static async markAsCompleted(id) {
    await db.execute(
      'UPDATE task SET completed = TRUE WHERE id = ?',
      [id]
    );
    return this.findById(id);
  }

  static async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM task ORDER BY created_at DESC'
    );
    return rows;
  }

  static async countIncomplete() {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM task WHERE completed = FALSE'
    );
    return parseInt(rows[0].count, 10) || 0;
  }
}

export default Task;

