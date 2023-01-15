import { events } from "./init.js";
import { AddDeleteLogRegister } from "./sidemenu.js";

function ModalDelete(TargetCard) {
    const ModalHTML = document.createElement("div");
    ModalHTML.classList="Modal";
    ModalHTML.style="display:block";
    ModalHTML.innerHTML=`<div class="ModalAlert">
                            <div class="ModalMessage">선택한 카드를 삭제할까요?</div>
                            <div class="ModalButton">
                                <button class="ModalCancel">취소</button>
                                <button class="ModalConfirm">삭제</button>
                            </div>
                        </div>`;
    document.body.append(ModalHTML);
    let ModalTarget=ModalHTML;
    let ModalCancel=ModalHTML.getElementsByClassName("ModalCancel")[0];
    let ModalConfirm=ModalHTML.getElementsByClassName("ModalConfirm")[0];

    ModalTarget.addEventListener('click', (event) => {
        if (event.target === ModalTarget) {
            ModalTarget.remove();
        }
    });
    ModalConfirm.addEventListener("click",()=>{
        TargetCard.closest('.ColumnList').getElementsByClassName('CardCount')[0].innerHTML=TargetCard.closest('.ColumnList').getElementsByClassName('CardCount')[0].innerHTML-1;
        events.push({"ColumnName":TargetCard.closest('.ColumnList').getElementsByClassName('ColumnTitle')[0].innerText.split('\n')[0],"CardTitle":TargetCard.getElementsByClassName('CardTitle')[0].textContent,"EventType":"삭제","EventTime":new Date().getTime()});
        AddDeleteLogRegister(events[events.length - 1].ColumnName,events[events.length - 1].CardTitle,events[events.length - 1].EventType,events[events.length - 1].EventTime);
        TargetCard.remove();
        ModalHTML.remove();
    });
    ModalCancel.addEventListener("click",()=>{
        ModalHTML.remove();
    });
}

export { ModalDelete };