DROP TABLE IF EXISTS express;

CREATE TABLE express (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL
);

INSERT INTO express (name, age) 
VALUES
  ('Jay', 33),
  ('Haley', 28);

