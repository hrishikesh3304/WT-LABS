const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // change to your username
  password: '',       // change to your password
  database: 'electricity'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Calculate bill based on slabs
function calculateBill(units) {
  if (units <= 50) return units * 3.5;
  if (units <= 150) return 50 * 3.5 + (units - 50) * 4.0;
  if (units <= 250) return 50 * 3.5 + 100 * 4.0 + (units - 150) * 5.2;
  return 50 * 3.5 + 100 * 4.0 + 100 * 5.2 + (units - 250) * 6.5;
}

// POST /generate_bill
app.post('/generate_bill', (req, res) => {
  const { id, units } = req.body;
  const bill = calculateBill(units);
  const date = new Date().toISOString().slice(0, 10);

  const query = `INSERT INTO bills (id, date, bill) VALUES (?, ?, ?)`;
  db.query(query, [id, date, bill], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// GET /bills/:id
app.get('/bills/:id', (req, res) => {
  const id = req.params.id;
  db.query(`SELECT date, bill FROM bills WHERE id = ? ORDER BY transaction_id DESC`, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});


// CREATE DATABASE electricity;

// USE electricity;

// CREATE TABLE consumer (
//   id VARCHAR(50) PRIMARY KEY,
//   name VARCHAR(100)
// );

// CREATE TABLE bills (
//   transaction_id INT AUTO_INCREMENT PRIMARY KEY,
//   id VARCHAR(50),
//   date DATE,
//   bill DECIMAL(10, 2),
//   FOREIGN KEY (id) REFERENCES consumer(id)
// );
