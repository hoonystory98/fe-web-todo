//for side menu function, log sorting, time counting
import { makelogadddelete, makelogmodify, makelogmove } from "./templates.js";
import { events } from "./main.js";

const SideMenu = document.getElementsByClassName("SideMenu")[0];
const MenuLog = SideMenu.getElementsByClassName("MenuLog")[0];

function updatehistory() {
  MenuLog.innerHTML = "";
  events.forEach(function (logevent) {
    if (logevent.EventType === "변경") {
      modifylogregister(
        logevent.FromTitle,
        logevent.ToTitle,
        logevent.EventType,
        logevent.EventTime
      );
    } else if (logevent.EventType === "이동") {
      movelogregister(
        logevent.CardTitle,
        logevent.FromColumn,
        logevent.ToColumn,
        logevent.EventType,
        logevent.EventTime
      );
    } else {
      adddeletelogregister(
        logevent.ColumnName,
        logevent.CardTitle,
        logevent.EventType,
        logevent.EventTime
      );
    }
  });
}

function showsidemenu() {
  SideMenu.classList.toggle("HiddenSideMenu");
}

function adddeletelogregister(ColumnName, CardTitle, EventType, EventTime) {
  let NewLogCard = document.createElement("div");
  NewLogCard.classList = "LogCard";
  NewLogCard.innerHTML = makelogadddelete(
    ColumnName,
    CardTitle,
    EventType,
    EventTime
  );
  MenuLog.prepend(NewLogCard);
}

function modifylogregister(FromTitle, ToTitle, EventType, EventTime) {
  let NewLogCard = document.createElement("div");
  NewLogCard.classList = "LogCard";
  NewLogCard.innerHTML = makelogmodify(
    FromTitle,
    ToTitle,
    EventType,
    EventTime
  );
  MenuLog.prepend(NewLogCard);
}

function movelogregister(
  CardTitle,
  FromColumn,
  ToColumn,
  EventType,
  EventTime
) {
  let NewLogCard = document.createElement("div");
  NewLogCard.classList = "LogCard";
  NewLogCard.innerHTML = makelogmove(
    CardTitle,
    FromColumn,
    ToColumn,
    EventType,
    EventTime
  );
  MenuLog.prepend(NewLogCard);
}

const menubuttons = document.getElementsByClassName("MenuButton");
Array.prototype.forEach.call(menubuttons, (el) => {
  el.addEventListener("click", showsidemenu);
});

export {
  showsidemenu,
  updatehistory,
  MenuLog,
  adddeletelogregister,
  modifylogregister,
  movelogregister,
};
