"use strict";

const { Pool } = require("pg");
const format = require("pg-format");
const { makeFake } = require("./datagen");
// const sanitizeHtml = require("sanitize-html");

const pool = new Pool({
  ssl: {
    rejectUnauthorized: false,
  },
  connectionString: process.env.DATABASE_URL,
});
// const sanitizeOpt = { allowedtags: [], allowedAtrributes: {} };
const retrieve = (req, res) => {
  const query = format(
    "SELECT * FROM express ORDER BY %I %s LIMIT %L OFFSET %L",
    req.query.orderby,
    req.query.sort,
    req.query.limit,
    req.query.offset
  );
  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => console.error(err));
};
const remove = (req, res) => {
  pool
    .query("DELETE FROM express WHERE id = $1 RETURNING *", [req.body.id])
    .then((result) => res.json(result))
    .catch((err) => console.error(err));
};

const random = async (req, res) => {
  const animal = ["cat", "dog"];
  const fakeData = await makeFake(animal[Math.round(Math.random())]);
  const sql = format(
    "INSERT INTO express (firstname, avatar, favorite) VALUES %L",
    fakeData
  );
  console.log(sql);
  pool
    .query(sql)
    .then((result) => res.json(result))
    .catch((err) => console.error(err));
};

const count = (req, res) => {
  pool
    .query("SELECT count(firstname) FROM express")
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => console.error(err));
};

module.exports = { count, random, remove, retrieve };
