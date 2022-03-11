"use strict";

require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const morgan = require('morgan')

const pool = new Pool({
  database: "express",
});

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(morgan("combined"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api", (req, res) => {
  pool.query("SELECT * FROM express").then((result) => res.send(result.rows));
});
app.post("/api", (req, res) => {
  pool
    .query("INSERT INTO express (name,age) VALUES ($1, $2) RETURNING *;", [
      req.body.name,
      req.body.age,
    ])
    .then((result) => res.redirect("/"));
});

app.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});
