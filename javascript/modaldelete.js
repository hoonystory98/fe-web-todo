import { deletecardmodal } from "./templates.js";
import Server from "./server.js";
import {adddeletelogregister} from "./sidemenu.js";

function getDeleteCardModalElement() {
  const ModalHTML = document.createElement("div");
  ModalHTML.classList.add("Modal");
  ModalHTML.innerHTML = deletecardmodal();
  document.body.append(ModalHTML);
  return ModalHTML;
}

function subtractColumnCounter($cardCounter) {
  const newCount = parseInt($cardCounter.innerHTML) - 1;
  $cardCounter.innerHTML = `${newCount}`;
}

function getDeletionEvent(colName, cardTitle) {
  return {
    ColumnName: colName,
    CardTitle: cardTitle,
    EventType: "삭제",
    EventTime: new Date().getTime(),
  };
}

function setModalEvent($modal, $targetCard) {
  const $confirm = $modal.getElementsByClassName("ModalConfirm")[0];
  const $columnList = $targetCard.closest(".ColumnList");
  const $cardCounter = $columnList.getElementsByClassName("CardCount")[0];
  const $colTitle = $columnList.getElementsByClassName("ColumnTitle")[0];
  const $cardTitle = $targetCard.getElementsByClassName("CardTitle")[0];
  const $cardSection = $columnList.getElementsByClassName("CardSection")[0];

  $modal.addEventListener("click", ({ target }) => {
    if (!target.closest('.ModalAlert') ||
        !!target.closest('button'))
      $modal.remove();
  });

  $confirm.addEventListener("click", e => {
    subtractColumnCounter($cardCounter);
    const newEvent = getDeletionEvent(
        $colTitle.innerText.split("\n")[0],
        $cardTitle.textContent);
    Server.postNewEvent(newEvent).catch(console.log);
    Server.deleteCard($targetCard.id)
        .then($targetCard.remove())
        .catch(console.log);
    Server.fetchCardList(
        $columnList.id,
        Array.from($cardSection.children).map($card => $card.id),
    ).catch(console.log);
    adddeletelogregister(newEvent.ColumnName,newEvent.CardTitle,newEvent.EventType,newEvent.EventTime);
  });
}

function modaldeletecard(TargetCard) {
  const $modal = getDeleteCardModalElement();
  setModalEvent($modal, TargetCard);
}

export { modaldeletecard };
