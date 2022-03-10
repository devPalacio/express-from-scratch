fetch("/api")
  .then((res) => res.json())
  .then((data) => buildCards(data));

function buildCards(arr) {
  //for each object in array, place data in card and append
  let section = document.getElementsByTagName("section")[0];

  for (let card in arr) {
    const cardEle = document.createElement("aside");

    cardEle.innerHTML = `
      <div>ID: ${arr[card].id}</div>
      <div>NAME: ${arr[card].name}</div>
      <div>AGE: ${arr[card].age}</div>`;
    section.append(cardEle);
  }
}
