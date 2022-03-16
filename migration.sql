DROP TABLE IF EXISTS express;

CREATE TABLE express (
  id SERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  avatar text NOT NULL,
  favorite BOOLEAN NOT NULL
);

