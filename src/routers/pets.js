const express = require("express");
const router = express.Router();
const db = require("../../db");

// router.get("/", async (req, res) => {
//   // extract query string. Make different kinds of SQL statements
//   // 1. get data from database table called books
//   const result = await db.query('SELECT * FROM "pets";');
//   // 2. send back a response
//   res.json({ pets: result.rows });
// });

router.get("/", async (req, res) => {
  // extract query string. Make different kinds of SQL statements
  const type = req.query.type;
  const breed = req.query.breed;
  let sqlString = 'SELECT * FROM "pets"';

  if (type && breed) {
    sqlString += ` WHERE type = '${type}' AND breed = '${breed}';`;
  } else if (type) {
    sqlString += ` WHERE type = '${type}';`;
  } else if (breed) {
    sqlString += ` WHERE breed = '${breed}';`;
  }
  // 1. get data from database table called pets
  const result = await db.query(sqlString);
  // 2. send back a response
  res.json({ pets: result.rows });
});

router.get("/:id", async (req, res) => {
  // extract id from the path
  const id = req.params.id;
  // get data from the table
  const result = await db.query(`SELECT * FROM "pets" WHERE id = ${id};`);
  const pet = result.rows[0];
  // send back a response
  res.json({ pet: pet });
});

router.post("/", async (req, res) => {
  const pet = req.body;
  let query = `INSERT INTO pets
    (name,
    age,
    type,
    breed,
    microchip )
    VALUES ('${pet.name}', ${pet.age}, '${pet.type}', '${pet.breed}', '${pet.microchip}') returning *`;

  const result = await db.query(query);
  //   console.log(result);
  res.json({ pet: result.rows[0] });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM pets WHERE id=${id} RETURNING *`;

  const result = await db.query(query);

  res.json({ pet: result.rows[0] });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, age, type, breed, microchip } = req.body;
  const values = [name, age, type, breed, microchip, id];
  const query = `UPDATE pets SET name=$1, age=$2, type=$3, breed=$4, microchip=$5 
        WHERE id=$6 RETURNING *`;

  const result = await db.query(query, values);
  if (result.rows.length === 1) {
    res.json({ pet: result.rows[0] });
  } else {
    res.status(404).json(`error: pet with ID=${id} does not exist`);
  }
  //   res.body === {}
  //     ? res.status(500).json("error: pet does not exist")
  //     : res.json("Sve your changes");
  //   if (req.body === {}) {
  //     res.status(500).json("error: pet does not exist");
  //   }
  //   500 is when the data base broken
  //   400 bad request
});

module.exports = router;
