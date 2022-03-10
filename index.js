"use strict";

require('dotenv').config()

const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  database: "express",
});

const PORT = process.env.port ?? 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get("/api", (req, res) => {
  pool.query('SELECT * FROM express')
    .then(result => res.send(result.rows))
});

app.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});
