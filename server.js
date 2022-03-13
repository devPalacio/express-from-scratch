"use strict";

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api", routes.retrieve);

app.post("/api", routes.post);
app.delete("/api", routes.remove);
app.post("/random", routes.random);

app.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`);
});
