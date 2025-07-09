const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tracker.db');

function setupDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY,
      user_id TEXT,
      category TEXT,
      description TEXT,
      calories REAL,
      protein REAL,
      carbs REAL,
      fat REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY,
      user_id TEXT,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS water_logs (
      id INTEGER PRIMARY KEY,
      user_id TEXT,
      amount_ml INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS care_logs (
      id INTEGER PRIMARY KEY,
      user_id TEXT,
      type TEXT,
      done INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // ✅ NEW: Routine logs table (for wake up, hair wash, etc)
    // db.run(`CREATE TABLE IF NOT EXISTS routine_logs (
    //   id INTEGER PRIMARY KEY,
    //   user_id TEXT,
    //   routine_type TEXT,  -- e.g., 'wake_up', 'hair_wash'
    //   value TEXT,         -- optional (time, status, etc)
    //   created_at TEXT DEFAULT CURRENT_TIMESTAMP
    // )`);
  });
}

module.exports = {
  db,
  setupDatabase
};
