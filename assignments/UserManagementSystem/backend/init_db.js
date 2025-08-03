import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run("DELETE FROM users"); // Clear existing data for repeatable init

  db.run("INSERT INTO users (name, email, password) VALUES ('John Doe', 'john@example.com', 'password123')");
  db.run("INSERT INTO users (name, email, password) VALUES ('Jane Smith', 'jane@example.com', 'secret456')");
  db.run("INSERT INTO users (name, email, password) VALUES ('Bob Johnson', 'bob@example.com', 'qwerty789')");

  console.log('Database initialized with sample data');
  db.close();
}); 