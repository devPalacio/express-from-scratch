"use strict"

const { Pool } = require("pg");

const pool = new Pool({
  database: "express",
  ssl: {
    rejectUnauthorized: true
  }
});

function retrieve(req, res) {
  pool.query("SELECT * FROM express").then((result) => res.send(result.rows));
}

const post = (req, res) => {
  pool
    .query("INSERT INTO express (name,age) VALUES ($1, $2) RETURNING *;", [
      req.body.name,
      req.body.age,
    ])
    .then((result) => res.json(result));
}

const remove = (req, res) => {
  pool.query("DELETE FROM express WHERE id = $1 RETURNING *", [req.body.id])
    .then((result) => res.json(result))
}
module.exports = { remove, post, retrieve }
