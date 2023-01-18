import { events,API_URL_Box,API_URL_Col } from "./main.js";
import { adddeletelogregister } from "./sidemenu.js";

function modaldeletecard(TargetCard) {
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
        adddeletelogregister(events[events.length - 1].ColumnName,events[events.length - 1].CardTitle,events[events.length - 1].EventType,events[events.length - 1].EventTime);

        let TColumn=TargetCard.closest('.ColumnList');
        let TargetCardId=TargetCard.id;
        
        fetch(`${API_URL_Box}/${TargetCardId}`,{
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({TargetCardId}),
        }).then((resp)=>resp.json()).then(()=>{
            console.log("Card Deleted")
        }).catch((error)=>console.error(error));

        TargetCard.remove();
        ModalHTML.remove();

        let Lists=[];
        Array.from(TColumn.getElementsByClassName('CardSection')[0].children).forEach(card=>Lists.push(card.id));
        fetch(`${API_URL_Col}/${TColumn.id}`,{
            method: "PATCH",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({Lists}),
        }).then((resp)=>resp.json()).then(()=>{
            console.log("Card Order Saved")
        }).catch((error)=>console.error(error));
    });
    ModalCancel.addEventListener("click",()=>{
        ModalHTML.remove();
    });
}

export { modaldeletecard };