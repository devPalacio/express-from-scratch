"use strict";

const { Pool } = require("pg");
const { faker } = require("@faker-js/faker");
const format = require("pg-format");
const sanitizeHtml = require("sanitize-html");

const pool = new Pool({
  ssl: {
    rejectUnauthorized: false,
  },
  connectionString: process.env.DATABASE_URL,
});
const sanitizeOpt = { allowedtags: [], allowedAtrributes: {} };

function retrieve(req, res) {
  pool
    .query("SELECT * FROM express OFFSET $1 LIMIT $2", [
      req.query.offset,
      req.query.limit,
    ])
    .then((result) => {
      console.log(result);
      res.send(result.rows);
    });
}

const post = (req, res) => {
  pool
    .query(
      `INSERT INTO express (name,age) 
        VALUES ($1, $2) 
        RETURNING *;`,
      [
        sanitizeHtml(req.body.name, sanitizeOpt),
        sanitizeHtml(req.body.age, sanitizeOpt),
      ]
    )
    .then((result) => res.json(result));
};

const remove = (req, res) => {
  pool
    .query("DELETE FROM express WHERE id = $1 RETURNING *", [req.body.id])
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
};

const random = (req, res) => {
  //create a loop and generate fake data for number received from request
  const fakeData = [];
  for (let i = 0; i < req.body.num; i++) {
    const fakeUnit = [];
    const first = faker.name.firstName();
    const last = faker.name.lastName();
    fakeUnit.push(first);
    fakeUnit.push(last);
    fakeUnit.push(faker.phone.phoneNumber("###-###-####"));
    fakeUnit.push(faker.internet.email(first, last));
    fakeUnit.push(faker.datatype.number(80));
    fakeData.push(fakeUnit);
  }
  console.log(fakeData);
  const sql = format(
    "INSERT INTO express (name, phone, social, zip, age, avatar) VALUES %L",
    fakeData
  );
  pool.query(sql).then((result) => res.json(result));
};

const count = (req, res) => {
  pool.query("SELECT count(name) FROM express").then((result) => {
    console.log(result);
    res.send(result.rows);
  });
};

module.exports = { count, random, remove, post, retrieve };
