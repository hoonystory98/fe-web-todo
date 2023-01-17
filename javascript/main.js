import { modaldeletecard } from "./modaldelete.js";
import { makecardsection,makenewcardinner } from "./templates.js";
import { showregisterform,cardheightadjust,makenewcard,modifycard } from "./card.js";
import { deletecolumn, changecoltitle } from "./columns.js";
import { dragcard } from "./dragndrop.js";

const API_URL_Col="http://localhost:3000/Column";
const API_URL_Eve="http://localhost:3000/Events";

fetch(API_URL_Col).then((resp) => resp.json()).then((column) => makeinitcol(column)).catch((err)=>console.error(err));

let events = [];
let dragAble = false;

function makeinitcol(Column) {
  Column.forEach((Column) => {
    let ColumnCards = Column.Lists;
    let ColumnID = Column.id;
    let ColumnHTML = makecardsection(Column.Name, ColumnID, ColumnCards.length);
    document.getElementsByClassName("ColumnSection")[0].innerHTML += ColumnHTML;

    ColumnCards.forEach((Card) => {
      let NewCardForm = document.createElement("div");
      NewCardForm.classList = "ColumnCards";
      NewCardForm.id = `${Column.ID}-${Card.CardID}`;
      NewCardForm.innerHTML = makenewcardinner(Card.Title, Card.Body, Card.Author);
      document.getElementById("cards-" + ColumnID).prepend(NewCardForm);
    });
  });
}

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

export { events,API_URL_Col, acolumn };