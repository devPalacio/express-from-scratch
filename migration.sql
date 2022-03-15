DROP TABLE IF EXISTS express;

CREATE TABLE express (
  id SERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  zip INTEGER NOT NULL,
  age INTEGER NOT NULL,
  avatar text NOT NULL
);

