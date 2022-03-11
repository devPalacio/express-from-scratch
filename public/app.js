"use strict";

function getData() {
  fetch("/api")
    .then((res) => res.json())
    .then((data) => buildCards(data));
}

function buildCards(arr) {
  let section = document.getElementsByTagName("section")[0];
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }
  for (let card in arr) {
    const cardEle = document.createElement("aside");

    cardEle.innerHTML = `
      <div>ID: ${arr[card].id}</div>
      <div>NAME: ${arr[card].name}</div>
      <div>AGE: ${arr[card].age}</div>
      <button class="delete" id="${arr[card].id}">Delete</button>
`;
    section.append(cardEle);
  }
  const deleteBtn = document.getElementsByClassName("delete");
  Array.from(deleteBtn).forEach((element) => {
    element.addEventListener("click", deleteData);
  });
}

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", submitData);

function submitData(event) {
  const userData = {};
  userData.name = document.getElementById("name").value;
  userData.age = document.getElementById("age").value;
  if (!userData.name || !userData.age) {
    window.alert("Name and Age required");
    return;
  }
  fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(userData),
  })
    .then(getData)
    .catch((err) => console.error(err));
}

function deleteData(event) {
  const userData = {};
  userData.id = event.target.id;
  fetch("/api", {
    method: "DELETE",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(userData),
  })
    .then((result) => console.log(result))
    .then(getData)
    .catch((err) => console.error(err));
}


getData();
