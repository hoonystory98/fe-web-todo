import { modalmakecol } from "./columns.js";
import { getdom } from "./util.js";
import { MenuLog } from "./sidemenu.js";
import { API_BASE_URL, API_URL_Eve } from "./main.js";

function showfabmenu(fabbtn) {
  let maxheight = 90 - getdom(document.body, "FabMenu").children.length * 10;
  fabbtn.classList.toggle("FabMenuOn");
  if (fabbtn.classList.contains("FabMenuOn")) {
    Array.from(getdom(document.body, "FabMenu").children).forEach((fab) => {
      fab.style.top = `${maxheight}%`;
      fab.style.boxShadow =
        "0px 0px 4px rgba(204, 204, 204, 0.5),0px 2px 4px rgba(0, 0, 0, 0.25)";
      maxheight += 10;
    });
  } else {
    Array.from(getdom(document.body, "FabMenu").children).forEach((fab) => {
      fab.style.boxShadow = "0px 0px 0px";
      fab.style.top = `90%`;
    });
  }
}

function darkmode() {
  document.body.classList.toggle("Dark");
  getdom(document.body, "FabMenu").classList.toggle("LightMode");
}

function clearHistory() {
  const Events = {};
  fetch(`${API_URL_Eve}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(),
  })
    .then((resp) => resp.json())
    .catch((error) => console.error(error));
  MenuLog.innerHTML = "";
}

const fabbuttoncolumn = document.getElementsByClassName("FabColumn")[0];
fabbuttoncolumn.addEventListener("click", modalmakecol);
getdom(document.body, "ToggleDark").addEventListener("click", darkmode);
getdom(document.body, "ClearHistory").addEventListener("click", clearHistory);

export { showfabmenu, darkmode };
