"use strict";

let pageNum = 1;
let limit = 5;
let offset = 0;
let totalRecords;

function getData(offset, limit) {
  /* eslint-disable */
  const order = submitForm[(name = "orderby")].value;
  console.log(order);
  const sort = submitForm[(name = "sort")].value;
  const favs = submitForm[(name = "favs")].checked;
  /* eslint-enable */
  fetch(
    `/api?offset=${offset}&limit=${limit}&orderby=${order}&sort=${sort}&fav=${favs}`
  )
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
  console.log(arr);
  let section = document.getElementsByTagName("section")[0];
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }
  for (let card in arr) {
    const cardEle = document.createElement("aside");
    const star = arr[card].favorite ? "⭐" : "";
    cardEle.innerHTML = `
      <img src='${arr[card].avatar}'>
      <h3 class='name'><strong>${arr[card].firstname}</strong> ${star} </h3>
      <div class="card-buttons">
        <button class="delete" id="d${arr[card].id}">Delete</button>
        <button class="favorite" id="f${arr[card].id}">Favorite</button>
      </div>
`;
    section.append(cardEle);
  }
  const deleteBtns = document.getElementsByClassName("delete");
  Array.from(deleteBtns).forEach((element) => {
    element.addEventListener("click", deleteData);
  });
  const favBtns = document.getElementsByClassName("favorite");
  Array.from(favBtns).forEach((button) => {
    button.addEventListener("click", saveFav);
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
  userData.id = event.target.id.slice(1);
  fetch("/api", {
    method: "DELETE",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(userData),
  })
    .then(() => getData(offset, limit))
    .catch((err) => console.error(err));
}

function saveFav(event) {
  const userData = {};
  userData.id = event.target.id.slice(1);
  fetch("/favs", {
    method: "PUT",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(userData),
  })
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
  fetch("/random", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=utf-8" },
  })
    .then((result) => console.log(result))
    .then(() => getData(offset, limit))
    .catch((err) => console.error(err));
}
getData(offset, limit);
