const API_BASE_URL = "http://localhost:3000";
const API_URL_Col = `${API_BASE_URL}/Columns`;
const API_URL_Box = `${API_BASE_URL}/Cards`;
const API_URL_Eve = `${API_BASE_URL}/Events`;
const API_URL_Dark = `${API_BASE_URL}/IsDarkMode`;

let cards = [];

function getIsDarkMode() {
  return fetch(API_URL_Dark)
      .then((resp) => resp.json());
}

function makecardarr(card) {
  cards.push(card);
}

function makeinitcol(Columns) {
  Columns.forEach((Column) => {
    let ColumnCards = Column.Lists;
    let ColumnHTML = makecardsection(
      Column.Name,
      Column.id,
      ColumnCards.length
    );
    document.getElementsByClassName("ColumnSection")[0].innerHTML += ColumnHTML;

    if (ColumnCards.length === 0) return;
    ColumnCards.forEach((CardNum) => {
      let NewCardForm = document.createElement("div");
      let TargetCard = cards.find((card) => {
        return card["id"] === CardNum;
      });
      NewCardForm.classList = "ColumnCards";
      NewCardForm.id = TargetCard.id;
      NewCardForm.innerHTML = makenewcardinner(
        TargetCard.Title,
        TargetCard.Body,
        TargetCard.Author
      );
      document.getElementById(`cards-${Column.id}`).append(NewCardForm);
    });
  });
}

async function getCardinfo() {
  await fetch(API_URL_Box)
    .then((resp) => resp.json())
    .then((boxes) => boxes.forEach((card) => makecardarr(card)))
    .catch((err) => console.error(err));
}
async function getColumninfo() {
  await fetch(API_URL_Col)
    .then((resp) => resp.json())
    .then((column) => makeinitcol(column))
    .catch((err) => console.error(err));
}
async function getEventinfo() {
  await fetch(API_URL_Eve)
    .then((resp) => resp.json())
    .then((history) => updatehistory(history))
    .catch((err) => console.error(err));
}
async function callinitcol() {
  await getCardinfo();
  await getColumninfo();
  await getEventinfo();
}

export {getIsDarkMode};
