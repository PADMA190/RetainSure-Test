import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import db from '../db.js';

const SALT_ROUNDS = 10;

export const getHome = (req, res) => {
  res.send('User Management System');
};

export const getAllUsers = (req, res) => {
  db.all('SELECT id, name, email FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
};

export const getUserById = (req, res) => {
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.params.user_id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) res.json(row);
    else res.status(404).json({ error: 'User not found' });
  });
};

export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ message: 'User created', userId: this.lastID });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email } = req.body;
  db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.user_id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated' });
  });
};

export const deleteUser = (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.user_id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  });
};

export const searchUsers = (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Please provide a name to search' });
  db.all('SELECT id, name, email FROM users WHERE name LIKE ?', [`%${name}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
};

export const login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ status: 'failed', error: 'Database error' });
    if (!user) return res.status(401).json({ status: 'failed', error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ status: 'success', user_id: user.id, message: 'Login successful!' });
    } else {
      res.status(401).json({ status: 'failed', error: 'Invalid credentials' });
    }
  });
}; 