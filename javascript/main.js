import { modaldeletecard } from "./modaldelete.js";
import { makecardsection, makenewcardinner } from "./templates.js";
import {
  showregisterform,
  cardheightadjust,
  makenewcard,
  modifycard,
} from "./card.js";
import { deletecolumn, changecoltitle } from "./columns.js";
import { updatehistory } from "./sidemenu.js";
import { dragcard } from "./dragndrop.js";

const API_URL_Col = "http://localhost:3000/Columns";
const API_URL_Box = "http://localhost:3000/Cards";
const API_URL_Eve = "http://localhost:3000/Events";

let cards = [];
let events = [];
let dragAble = false;

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
      NewCardForm.id = `${TargetCard.id}`;
      NewCardForm.innerHTML = makenewcardinner(
        TargetCard.Title,
        TargetCard.Body,
        TargetCard.Author
      );
      document.getElementById("cards-" + Column.id).append(NewCardForm);
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

callinitcol();

const acolumn = document.getElementsByClassName("ColumnSection")[0];

acolumn.addEventListener("click", (e) => {
  const inputbuttons = e.target.closest(".ShowInputForm");
  if (inputbuttons != null) {
    const collist = inputbuttons.closest(".ColumnList");
    showregisterform(collist);
  }
});
acolumn.addEventListener("click", (e) => {
  const modifybuttons = e.target.closest(".CardModify");
  if (modifybuttons != null) {
    const targetcard = modifybuttons.closest(".ColumnCards");
    modifycard(targetcard);
  }
});
acolumn.addEventListener("input", (e) => {
  const inputarea = e.target.closest(".CardInput");
  if (inputarea != null) {
    cardheightadjust(inputarea);
  }
});
acolumn.addEventListener("click", (e) => {
  const deletebuttons = e.target.closest(".CardDelete");
  if (deletebuttons != null) {
    const targetcard = deletebuttons.closest(".ColumnCards");
    modaldeletecard(targetcard);
  }
});
acolumn.addEventListener("click", (e) => {
  const registerbutton = e.target.closest(".CardRegister");
  if (registerbutton != null) {
    const registerform = registerbutton.closest(".NewCard");
    if (registerform != null) {
      makenewcard(registerform);
    }
  }
});
acolumn.addEventListener("click", (e) => {
  const coldeletebuttons = e.target.closest(".ColumnDelete");
  if (coldeletebuttons != null) {
    const targetcolumn = coldeletebuttons.closest(".ColumnList");
    deletecolumn(targetcolumn);
  }
});
acolumn.addEventListener("dblclick", (e) => {
  const columntitle = e.target.closest(".ColumnTitle");
  if (columntitle != null) {
    changecoltitle(columntitle);
  }
});

acolumn.addEventListener("mousedown", (e) => {
  const cursoroncard = e.target.closest(".ColumnCards");
  if (cursoroncard != null) {
    dragAble = true;
  }
});
acolumn.addEventListener("mousemove", (e) => {
  const cursoroncard = e.target.closest(".ColumnCards");
  if (cursoroncard && dragAble) {
    dragcard(e);
    dragAble = false;
  }
});
acolumn.addEventListener("mouseup", (e) => {
  const colsec = e.target.closest(".ColumnSection");
  if (colsec != null) {
    dragAble = false;
  }
});

export { events, API_URL_Col, API_URL_Box, acolumn };
