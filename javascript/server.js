const API_BASE_URL = "http://localhost:3000";
const API_URL_Col = `${API_BASE_URL}/Columns`;
const API_URL_Box = `${API_BASE_URL}/Cards`;
const API_URL_Eve = `${API_BASE_URL}/Events`;
const API_URL_Dark = `${API_BASE_URL}/IsDarkMode`;

async function getIsDarkMode() {
  return (await fetch(API_URL_Dark)).json();
}

async function postNewEvent(newEvent) {
  return (await fetch(API_URL_Eve, {
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(newEvent),
  })).json();
}

async function postNewCard(newCard) {
  return (await fetch(API_URL_Box, {
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(newCard)
  })).json();
}

async function deleteCard(cardId) {
  return (await fetch(`${API_URL_Box}/${cardId}`, {
    method: "DELETE",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify({cardId}),
  })).json();
}

async function fetchCardList(columnId, newList) {
  return (await fetch(`${API_URL_Col}/${columnId}`, {
    method: "PATCH",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify({Lists: newList}),
  })).json();
}

const Server = {
  getIsDarkMode,
  postNewEvent,
  deleteCard,
  fetchCardList,
  postNewCard,
}

export default Server;
