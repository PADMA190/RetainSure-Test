import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

export default db; 