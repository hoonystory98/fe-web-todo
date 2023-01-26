import { makenewcardinner, modifycardform } from "./templates.js";
import { adddeletelogregister, modifylogregister } from "./sidemenu.js";
import { API_URL_Box, API_URL_Col, API_URL_Eve } from "./main.js";
import Server from "./server.js";

function toggleRegisterForm(Collist) {
  const CardForm = Collist.getElementsByClassName("NewCard")[0];
  if (CardForm.style.display !== "block") {
    CardForm.style.display = "block";
    CardForm.getElementsByClassName("TitleInput")[0].focus();
  } else {
    CardForm.style.display = "none";
  }
}

function cardheightadjust(InputArea) {
  const CardButton =
    InputArea.closest(".NewCard").getElementsByClassName("CardRegister")[0];
  CardButton.disabled = InputArea.value.trim().length <= 0;
  InputArea.style.height = "auto";
  InputArea.style.height = `${InputArea.scrollHeight}px`;
}

function makenewcard(CardRegisterForm) {
  const $newCardForm = document.createElement('div');
  $newCardForm.classList.add('ColumnCards');
  $newCardForm.id = new Date().getTime().toString();

  const $newTitle = CardRegisterForm.getElementsByClassName('TitleInput')[0];
  const $newBody = CardRegisterForm.getElementsByClassName("CardInput")[0];
  $newCardForm.innerHTML = makenewcardinner($newTitle.value, $newBody.value.trim(), 'web');

  const $columnList = CardRegisterForm.closest(".ColumnList");
  const $cardSection = $columnList.getElementsByClassName("CardSection")[0];
  $cardSection.prepend($newCardForm);

  const $registerButton = CardRegisterForm.getElementsByClassName("CardRegister")[0];
  $registerButton.disabled = true;

  CardRegisterForm.style.display = "none";
  const $cardCount = $columnList.getElementsByClassName("CardCount")[0]
  $cardCount.innerHTML = `${$cardSection.children.length}`;

  const $columnTitle = $columnList.getElementsByClassName("ColumnTitle")[0];
  const NewEvent = {
    ColumnName: $columnTitle.innerText.split("\n")[0],
    CardTitle: $newTitle.value,
    EventType: "등록",
    EventTime: new Date().getTime(),
  };
  Server.postNewEvent(NewEvent).catch(console.error);

  adddeletelogregister(
      NewEvent.ColumnName,
      NewEvent.CardTitle,
      NewEvent.EventType,
      NewEvent.EventTime
  );

  const NewCardObj = {
    id: parseInt($newCardForm.id),
    Title: $newTitle.value,
    Body: $newBody.value.trim(),
    Author: "web",
  };
  Server.postNewCard(NewCardObj).catch(console.error);

  const Lists = Array.from($cardSection.children).map(card => parseInt(card.id));
  Server.fetchCardList($columnList.id, Lists).catch(console.error);

  $newTitle.value = "";
  $newBody.value = "";
  cardheightadjust($newBody);
}

function modifycard(TargetCard) {
  let BeforeTitle = TargetCard.getElementsByClassName("CardTitle")[0].innerText;
  let BeforeBody = TargetCard.getElementsByClassName("CardBody")[0].innerText;

  TargetCard.className = "NewCard";
  TargetCard.innerHTML = modifycardform(BeforeTitle, BeforeBody);
  cardheightadjust(TargetCard.getElementsByClassName("CardInput")[0]);

  function cancelmodify() {
    TargetCard.innerHTML = makenewcardinner(BeforeTitle, BeforeBody, "web");
    TargetCard.style.height = "";
    TargetCard.className = "ColumnCards";
  }
  function confirmmodify() {
    let NewTitle = TargetCard.getElementsByClassName("TitleInput")[0].value;
    let NewBody =
      TargetCard.getElementsByClassName("CardInput")[0].value.trim();
    TargetCard.innerHTML = makenewcardinner(NewTitle, NewBody, "web");
    TargetCard.style.height = "";
    TargetCard.className = "ColumnCards";
    const NewEvent = {
      FromTitle: BeforeTitle,
      ToTitle: NewTitle,
      EventType: "변경",
      EventTime: new Date().getTime(),
    };
    fetch(API_URL_Eve, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(NewEvent),
    })
      .then((resp) => resp.json())
      .catch((error) => console.error(error));

    modifylogregister(
      NewEvent.FromTitle,NewEvent.ToTitle,NewEvent.EventType,NewEvent.EventTime
    );

    const NewCardObj = {
      Title: NewTitle,
      Body: NewBody,
      Author: "web",
    };
    fetch(`${API_URL_Box}/${TargetCard.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(NewCardObj),
    })
      .then((resp) => resp.json())
      .catch((error) => console.error(error));
  }

  TargetCard.getElementsByClassName("ModifyCancel")[0].addEventListener(
    "click",
    cancelmodify
  );
  TargetCard.getElementsByClassName("ModifyConfirm")[0].addEventListener(
    "click",
    confirmmodify
  );
}

export { toggleRegisterForm, cardheightadjust, makenewcard, modifycard };
