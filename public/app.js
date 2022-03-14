"use strict";
let pageNum = 1;
let limit = 8;
let totalRecords;
function getData(offset = 0, limit = 8) {
  fetch(`/api?offset=${offset}&limit=${limit}`)
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
      totalRecords = parseInt(data[0].count);
      const totalPages = Math.ceil(totalRecords / limit);
      const recordCounter = document.getElementById("record-count");
      recordCounter.innerHTML = "";
      recordCounter.innerHTML = `Displaying <strong>${limit}</strong> of <strong>${totalRecords}</strong> records`;
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
      <div><strong>NAME:</strong>  ${arr[card].name}</div>
      <div><strong>AGE:</strong>  ${arr[card].age}</div>
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

function submitData() {
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

const nextBtn = document.querySelector("#next");
const prevBtn = document.querySelector("#prev");
prevBtn.addEventListener("click", changePage);
nextBtn.addEventListener("click", changePage);

function changePage(e) {
  if (e.target.id === "next" && (pageNum + 1) * limit < totalRecords + limit) {
    let offset = pageNum * limit;
    pageNum++;
    getData(offset, limit);
  }
  if (e.target.id === "prev" && pageNum - 1 > 0) {
    pageNum--;
    let offset = (pageNum - 1) * limit;
    getData(offset, limit);
  }
}

getData();
