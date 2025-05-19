const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'WT'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Add book
app.post('/add_book', (req, res) => {
  const { name, author, price } = req.body;
  const query = `INSERT INTO books (book_name, book_author, book_price) VALUES (?, ?, ?)`;
  connection.query(query, [name, author, price], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add book' });
    res.status(201).json({ message: 'Book added', bookId: result.insertId });
  });
});

// Get all books
app.get('/books', (req, res) => {
  const query = `SELECT * FROM books`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch books' });
    const books = results.map(row => ({
      id: row.id,
      name: row.book_name,
      author: row.book_author,
      price: row.book_price
    }));
    res.json(books);
  });
});

// Add to cart
app.post('/cart/add', (req, res) => {
  const { user_id, book_id, quantity } = req.body;
  if (!user_id || !book_id) return res.status(400).json({ error: 'Missing user_id or book_id' });

  const query = `
    INSERT INTO cart (user_id, book_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?
  `;
  connection.query(query, [user_id, book_id, quantity || 1, quantity || 1], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to add to cart' });
    res.json({ message: 'Book added to cart' });
  });
});

// Get cart
app.get('/cart/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  const query = `
    SELECT b.id, b.book_name, b.book_author, b.book_price, c.quantity
    FROM cart c
    JOIN books b ON c.book_id = b.id
    WHERE c.user_id = ?
  `;
  connection.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch cart' });
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});




// CREATE DATABASE IF NOT EXISTS WT;
// USE WT;

// CREATE TABLE IF NOT EXISTS books (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   book_name VARCHAR(255),
//   book_author VARCHAR(255),
//   book_price DECIMAL(10,2)
// );

// CREATE TABLE IF NOT EXISTS cart (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   user_id VARCHAR(100),
//   book_id INT,
//   quantity INT DEFAULT 1,
//   UNIQUE KEY unique_user_book (user_id, book_id),
//   FOREIGN KEY (book_id) REFERENCES books(id)
// );
