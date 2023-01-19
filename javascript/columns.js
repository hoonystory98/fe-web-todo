//for card sort, title change
import { API_URL_Col } from "./main.js";
import { newcolumnmodal, delcolmodal, makecardsection } from "./templates.js";

function modalmakecol() {
  const ModalHTML = document.createElement("div");
  ModalHTML.classList = "Modal";
  ModalHTML.innerHTML = newcolumnmodal();
  document.body.append(ModalHTML);
  let ModalTarget = ModalHTML;
  let ModalInput = ModalHTML.getElementsByClassName("ModalInput")[0];
  let ModalCancel = ModalHTML.getElementsByClassName("ModalCancel")[0];
  let ModalConfirm = ModalHTML.getElementsByClassName("ModalConfirm")[0];
  ModalInput.focus();

  ModalTarget.addEventListener("click", (event) => {
    if (event.target === ModalTarget) {
      ModalTarget.remove();
    }
  });
  ModalInput.addEventListener("input", () => {
    if (ModalInput.value.length > 0) {
      ModalConfirm.disabled = false;
    } else {
      ModalConfirm.disabled = true;
    }
  });
  ModalConfirm.addEventListener("click", () => {
    let ColumnID = "NewCol-" + new Date().getTime();
    let ColumnHTML = makecardsection(ModalInput.value, ColumnID, 0);
    const NewColumn = {
      Name: `${ModalInput.value}`,
      id: `${ColumnID}`,
      Lists: [],
    };
    document.getElementsByClassName("ColumnSection")[0].innerHTML += ColumnHTML;
    fetch(API_URL_Col, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(NewColumn),
    })
      .then((resp) => resp.json())
      .catch((error) => console.error(error));
    ModalHTML.remove();
  });
  ModalCancel.addEventListener("click", () => {
    ModalHTML.remove();
  });
}

function deletecolumn(TargetColumn) {
  const ModalHTML = document.createElement("div");
  ModalHTML.classList = "Modal";
  ModalHTML.style = "display:block";
  ModalHTML.innerHTML = delcolmodal();
  document.body.append(ModalHTML);
  let ModalTarget = ModalHTML;
  let ModalCancel = ModalHTML.getElementsByClassName("ModalCancel")[0];
  let ModalConfirm = ModalHTML.getElementsByClassName("ModalConfirm")[0];

  ModalTarget.addEventListener("click", (event) => {
    if (event.target === ModalTarget) {
      ModalTarget.remove();
    }
  });
  ModalConfirm.addEventListener("click", () => {
    const TargetColId = TargetColumn.id;
    console.log(TargetColId);
    TargetColumn.remove();
    fetch(`${API_URL_Col}/${TargetColId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ TargetColId }),
    })
      .then((resp) => resp.json())
      .catch((error) => console.error(error));
    ModalHTML.remove();
  });
  ModalCancel.addEventListener("click", () => {
    ModalHTML.remove();
  });
}

function changecoltitle(TargetTitle) {
  let InputForm = document.createElement("input");
  InputForm.type = "text";
  InputForm.placeholder = `${TargetTitle.textContent}`;
  InputForm.value = `${TargetTitle.textContent}`;
  InputForm.className = "TitleInput";
  InputForm.maxLength = "50";
  TargetTitle.innerHTML = "";
  TargetTitle.append(InputForm);
  const inputform = TargetTitle.getElementsByClassName("TitleInput")[0];
  inputform.focus();

  function registertitle() {
    if (inputform.value.length > 0) {
      const TargetColId = TargetTitle.closest(".ColumnList").id;
      const Name = inputform.value;
      TargetTitle.innerHTML = inputform.value;
      fetch(`${API_URL_Col}/${TargetColId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ Name }),
      }).catch((error) => console.error(error));
    } else {
      return;
    }
  }

  inputform.addEventListener("focusout", registertitle);
}

const fabbutton = document.getElementsByClassName("FabColumn")[0];
fabbutton.addEventListener("click", modalmakecol);

export { modalmakecol, deletecolumn, changecoltitle };
