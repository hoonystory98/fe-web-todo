import { API_URL_Box, API_URL_Col, API_URL_Eve } from "./main.js";
import { deletecardmodal } from "./templates.js";

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

function postNewEvent(colName, cardTitle) {
  const NewEvent = {
    id: new Date().getTime(),
    ColumnName: colName,
    CardTitle: cardTitle,
    EventType: "삭제",
    EventTime: new Date().getTime(),
  };
  fetch(API_URL_Eve, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(NewEvent),
  })
      .then((resp) => resp.json())
      .catch((error) => console.error(error));
}

function deleteCard($targetCard) {
  const cardId = $targetCard.id;
  fetch(`${API_URL_Box}/${cardId}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ cardId }),
  })
      .then((resp) => resp.json())
      .catch((error) => console.error(error));
  $targetCard.remove();
}

function fetchCardList(columnId, newList) {
  fetch(`${API_URL_Col}/${columnId}`, {
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ Lists: newList }),
  })
      .then((resp) => resp.json())
      .catch((error) => console.error(error));
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
    postNewEvent(
        $colTitle.innerText.split("\n")[0],
        $cardTitle.textContent);
    deleteCard($targetCard);
    fetchCardList(
        $columnList.id,
        Array.from($cardSection.children).map($card => $card.id),
    );
  });
}

function modaldeletecard(TargetCard) {
  const $modal = getDeleteCardModalElement();
  setModalEvent($modal, TargetCard);
}

export { modaldeletecard };
