const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  // extract query string. Make different kinds of SQL statements
  // 1. get data from database table called books
  const result = await db.query('SELECT * FROM "books";');
  // 2. send back a response
  res.json({ books: result.rows });
});

router.get("/:id", async (req, res) => {
  // extract id from the path
  const id = req.params.id;
  // get data from the table
  const result = await db.query(`SELECT * FROM "books" WHERE id = ${id};`);
  const book = result.rows[0];
  // send back a response
  res.json({ book: book });
});

// router.post("/", async (req, res) => {
//   id++;
//   const book = { ...req.body, id: id };
//   //   id = book.length + 1;
//   users.push(book);
//   res.json({ book });
// });

router.post("/", async (req, res) => {
  // Add data using INSERT
  // get data from the table using SELECT
  // send back response
  const book = req.body;
  let query = `INSERT INTO books
    (title,
    type,
    author,
    topic,
    publicationDate,
    pages )
    VALUES ('${book.title}', '${book.type}', '${book.author}', '${book.topic}', '${book.publicationDate}', ${book.pages}) returning *`;

  const result = await db.query(query);
  //   console.log(result);
  res.json({ book: result.rows[0] });
});

// books: result.rows[0]
// if (type && topic) {
//     sqlString += ` WHERE type = '${type}' AND topic = '${topic}';`
//   } else if (type) {
//     sqlString += ` WHERE type = '${type}';`
//   } else if (topic) {
//     sqlString += ` WHERE topic = '${topic}';`
//   }

module.exports = router;
