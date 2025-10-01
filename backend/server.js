const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// koneksi MySQL (ganti user/pass sesuai XAMPP kamu)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'teman_tani_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

app.use(cors());
app.use(express.json());

// GET semua user
app.get('/users', (req, res) => {
  db.query('SELECT id, name, email, role, join_date FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST tambah user
app.post('/users', (req, res) => {
  const { name, email, password, role } = req.body;
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, role || 'BUYER'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, email, role: role || 'BUYER' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
