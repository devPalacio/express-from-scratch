"use strict";
const animals = require("random-animals-api");
const { faker } = require("@faker-js/faker");

//have function take in animal? cat or dog.
async function makeFake(animal) {
  const fakeData = [];
  for (let i = 0; i < 10; i++) {
    const fakeUnit = [];
    const first = faker.name.firstName();
    fakeUnit.push(first);
    if (animal === "cat") {
      await animals.cat().then((url) => fakeUnit.push(url));
    }
    if (animal === "dog") {
      await animals.dog().then((url) => fakeUnit.push(url));
    }
    fakeUnit.push(false);
    fakeData.push(fakeUnit);
  }
  // console.log(fakeData);
  return fakeData;
}
module.exports = { makeFake };
