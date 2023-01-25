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
import { showfabmenu } from "./fabmenu.js";
import Server from "./server.js";

const API_BASE_URL = "http://localhost:3000";
const API_URL_Col = `${API_BASE_URL}/Columns`;
const API_URL_Box = `${API_BASE_URL}/Cards`;
const API_URL_Eve = `${API_BASE_URL}/Events`;

let cards = [];
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

function addEvent(eventType, selector, listener) {
  document.addEventListener(eventType, e => {
    const target = e.target.closest(selector);
    if (!target) return;
    listener(e);
  });
}

addEvent('click', '.FabButton', e => {
  const fabbtn = e.target.closest(".FabButton");
  showfabmenu(fabbtn);
});

addEvent('click', '.ShowInputForm', e => {
  const collist = e.target.closest(".ColumnList");
  if (!collist) return;
  showregisterform(collist);
});

addEvent('click', '.CardModify', e => {
  const targetcard = e.target.closest(".ColumnCards");
  if (!targetcard) return;
  modifycard(targetcard);
});

addEvent('input', '.CardInput', e => {
  const inputarea = e.target.closest(".CardInput");
  if (!inputarea) return;
  cardheightadjust(inputarea);
});

addEvent('click', '.CardDelete', e => {
  const targetcard = e.target.closest(".ColumnCards");
  if (!targetcard) return;
  modaldeletecard(targetcard);
});

addEvent('click', '.CardRegister', e => {
  const registerform = e.target.closest(".NewCard");
  if (!registerform) return;
  makenewcard(registerform);
});

addEvent('click', '.ColumnDelete', e => {
  const targetcolumn = e.target.closest(".ColumnList");
  deletecolumn(targetcolumn);
});

addEvent('dblclick', '.ColumnTitle', e => {
  const columntitle = e.target.closest(".ColumnTitle");
  if (!columntitle) return
  changecoltitle(columntitle);
});

addEvent('mousedown', '.ColumnCards', e => {
  dragAble = true;
});

addEvent('mousemove', '.ColumnCards', e => {
  if (dragAble) {
    dragcard(e);
    dragAble = false;
  }
});

addEvent('mouseup', '.ColumnSection', e => {
  dragAble = false;
});

callinitcol();

Server.getIsDarkMode().then(({ IsDarkMode }) => {
  if (IsDarkMode)
    document.body.classList.toggle("Dark");
}).catch(console.log);

export { API_BASE_URL, API_URL_Col, API_URL_Box, API_URL_Eve };
