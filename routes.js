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
  const query = JSON.parse(req.query.fav)
    ? format(
        "SELECT * FROM express WHERE favorite = true ORDER BY %I %s LIMIT %L OFFSET %L",
        req.query.orderby,
        req.query.sort,
        req.query.limit,
        req.query.offset
      )
    : format(
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
  const animal = ["cat", "dog", "panda", "duck"];
  const fakeData = await makeFake(animal[Math.round(Math.random() * 3)]);
  const sql = format(
    "INSERT INTO express (firstname, avatar, favorite) VALUES %L",
    fakeData
  );
  pool
    .query(sql)
    .then((result) => res.json(result.rowCount))
    .catch((err) => console.error(err));
};

const count = (req, res) => {
  const query = JSON.parse(req.query.fav)
    ? "SELECT count(firstname) FROM express WHERE favorite = true"
    : "SELECT count(firstname) FROM express";
  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => console.error(err));
};

const favs = (req, res) => {
  pool
    .query(
      "UPDATE express SET favorite = NOT favorite WHERE id = $1 RETURNING *",
      [req.body.id]
    )
    .then((result) => res.json(result.rows))
    .catch((err) => console.error(err));
};

module.exports = { favs, count, random, remove, retrieve };
