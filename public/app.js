"use strict";
let pageNum = 1;
let limit = 8;
let offset = 0;
let totalRecords;

function getData(offset, limit) {
  const order = submitForm[(name = "orderby")].value;
  const sort = submitForm[(name = "sort")].value;
  fetch(`/api?offset=${offset}&limit=${limit}&orderby=${order}&sort=${sort}`)
    .then((res) => res.json())
    .then((data) => {
      buildCards(data);
      updateCount();
    });
}

function updateCount() {
  fetch("/count")
    .then((res) => res.json())
    .then((data) => {
      let currCards = document.querySelector("section").children.length;
      totalRecords = parseInt(data[0].count);
      const totalPages = Math.ceil(totalRecords / limit);
      const recordCounter = document.getElementById("record-count");
      recordCounter.innerHTML = "";
      recordCounter.innerHTML = `Displaying <strong>${currCards}</strong> of <strong>${totalRecords}</strong> records`;
      const pageCounter = document.getElementById("page-count");
      pageCounter.innerHTML = "";
      pageCounter.innerHTML = `Page <strong>${pageNum}</strong> of <strong>${totalPages}</strong>`;
    });
}

function buildCards(arr) {
  let section = document.getElementsByTagName("section")[0];
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }
  for (let card in arr) {
    const cardEle = document.createElement("aside");
    cardEle.innerHTML = `
      <img src='${arr[card].avatar}'>
      <div><strong>NAME:</strong>  ${arr[card].firstname} ${arr[card].lastname}</div>
      <div><strong>AGE:</strong>  ${arr[card].age}</div>
      <div><strong>PHONE:</strong>  ${arr[card].phone}</div>
      <div><strong>EMAIL:</strong>  ${arr[card].email}</div>
      <div><strong>ZIP:</strong>  ${arr[card].zip}</div>
      <button class="delete" id="${arr[card].id}">Delete</button>
`;
    section.append(cardEle);
  }
  const deleteBtn = document.getElementsByClassName("delete");
  Array.from(deleteBtn).forEach((element) => {
    element.addEventListener("click", deleteData);
  });
}

const submitForm = document.getElementById("form-options");
submitForm.addEventListener("submit", submitData);
function submitData(e) {
  e.preventDefault();
  getData(offset, limit);
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
    .then(() => getData(offset, limit))
    .catch((err) => console.error(err));
}

const nextBtn = document.querySelector("#next");
const prevBtn = document.querySelector("#prev");
prevBtn.addEventListener("click", changePage);
nextBtn.addEventListener("click", changePage);

function changePage(e) {
  if (e.target.id === "next" && (pageNum + 1) * limit < totalRecords + limit) {
    offset = pageNum * limit;
    pageNum++;
    getData(offset, limit);
  }
  if (e.target.id === "prev" && pageNum - 1 > 0) {
    pageNum--;
    offset = (pageNum - 1) * limit;
    getData(offset, limit);
  }
}

const randomBtn = document.querySelector("#random");
randomBtn.addEventListener("click", getRandom);

function getRandom() {
  console.log("click the random button mofo");
  fetch("/random", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify({ num: 20 }),
  })
    .then((result) => console.log(result))
    .then(() => getData(offset, limit))
    .catch((err) => console.error(err));
}
getData(offset, limit);
