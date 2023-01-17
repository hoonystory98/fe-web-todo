//for card sort, title change
import { makecardsection } from "./templates.js";

function modalmakecol() {
    const ModalHTML = document.createElement("div");
    ModalHTML.classList="Modal";
    ModalHTML.style="display:block";
    ModalHTML.innerHTML=`<div class="ModalAlert">
                            <div class="ModalMessage">새로운 칼럼의 제목을 입력해주세요.</div>
                            <input type="text" placeholder="제목을 입력하세요" class="ModalInput" maxlength="50"></input>
                            <div class="ModalButton">
                                <button class="ModalCancel">취소</button>
                                <button class="ModalConfirm" disabled="true">등록</button>
                            </div>
                        </div>`;
    document.body.append(ModalHTML);
    let ModalTarget=ModalHTML;
    let ModalInput=ModalHTML.getElementsByClassName("ModalInput")[0];
    let ModalCancel=ModalHTML.getElementsByClassName("ModalCancel")[0];
    let ModalConfirm=ModalHTML.getElementsByClassName("ModalConfirm")[0];
    ModalInput.focus();

    ModalTarget.addEventListener('click', (event) => {
        if (event.target === ModalTarget) {
            ModalTarget.remove();
        }
    });
    ModalInput.addEventListener('input', ()=>{
        if(ModalInput.value.length > 0){
            ModalConfirm.disabled=false;
        }
        else{
            ModalConfirm.disabled=true;
        }
    })
    ModalConfirm.addEventListener("click",()=>{
        let ColumnID="NewCol-"+new Date().getTime();
        let ColumnHTML=makecardsection(ModalInput.value,ColumnID,0);
        document.getElementsByClassName("ColumnSection")[0].innerHTML+=(ColumnHTML);
        ModalHTML.remove();
    });
    ModalCancel.addEventListener("click",()=>{
        ModalHTML.remove();
    });
}

function deletecolumn(TargetColumn){
    const ModalHTML = document.createElement("div");
    ModalHTML.classList="Modal";
    ModalHTML.style="display:block";
    ModalHTML.innerHTML=`<div class="ModalAlert">
                            <div class="ModalMessage">선택한 칼럼을 삭제할까요?</div>
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
        TargetColumn.remove();
        ModalHTML.remove();
    });
    ModalCancel.addEventListener("click",()=>{
        ModalHTML.remove();
    });
}

function changecoltitle(TargetTitle){
    let InputForm=document.createElement("input");
    InputForm.type="text";
    InputForm.placeholder=`${TargetTitle.textContent}`;
    InputForm.value=`${TargetTitle.textContent}`;
    InputForm.className="TitleInput";
    InputForm.maxLength="50";
    TargetTitle.innerHTML="";
    TargetTitle.append(InputForm);
    const inputform=TargetTitle.getElementsByClassName('TitleInput')[0];
    inputform.focus();

    function registertitle(){
        if(inputform.value.length > 0){
            TargetTitle.innerHTML=inputform.value;
        }
        else{
            return;
        }
    }

    inputform.addEventListener("focusout",registertitle);
}

const fabbutton=document.getElementsByClassName('FabColumn')[0];
fabbutton.addEventListener('click', modalmakecol);

export { modalmakecol,deletecolumn,changecoltitle };