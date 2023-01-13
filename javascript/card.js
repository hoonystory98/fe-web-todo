import { MakeNewCard,ModifyCardForm } from "./templates.js";
import { AddDeleteLogRegister,ModifyLogRegister } from "./sidemenu.js";
import { events } from "./init.js";

function RegisterFormShow(Collist){
    const CardForm = Collist.getElementsByClassName('NewCard')[0];
    
    if(CardForm.style.display != 'block'){
        CardForm.style.display = 'block';
        CardForm.getElementsByClassName('TitleInput')[0].focus();
    }
    else{
        CardForm.style.display = 'none';
    }
}

function CardHeightAdjust(InputArea){
    const CardButton = InputArea.closest('.NewCard').getElementsByClassName('CardRegister')[0];

    if(InputArea.value.trim().length > 0){
        CardButton.disabled = false;
    }
    else{
        CardButton.disabled = true;
    }

    InputArea.style.height = '1px';
    InputArea.style.height = (24 + InputArea.scrollHeight) + 'px';
}

function CardMaking(CardRegisterForm){
    let NewCardForm = document.createElement("div");
    NewCardForm.classList="ColumnCards";
    let NewCardIDNum = new Date().getTime();
    NewCardForm.id=`${CardRegisterForm.closest('.ColumnList').id}-${NewCardIDNum}`;
    let NewTitle=CardRegisterForm.getElementsByClassName('TitleInput')[0].value;
    let NewBody=CardRegisterForm.getElementsByClassName('CardInput')[0].value.trim();
    NewCardForm.innerHTML=MakeNewCard(NewTitle,NewBody,"web");
    
    CardRegisterForm.closest('.ColumnList').getElementsByClassName('CardSection')[0].prepend(NewCardForm);
    CardRegisterForm.getElementsByClassName('TitleInput')[0].value='';
    CardRegisterForm.getElementsByClassName('CardInput')[0].value='';
    CardHeightAdjust(CardRegisterForm.getElementsByClassName('CardInput')[0])
    CardRegisterForm.getElementsByClassName('CardRegister')[0].disabled=true;
    CardRegisterForm.style.display='none';
    CardRegisterForm.closest('.ColumnList').getElementsByClassName('CardCount')[0].innerHTML=CardRegisterForm.closest('.ColumnList').getElementsByClassName('CardSection')[0].children.length;
    events.push({"ColumnName":CardRegisterForm.closest('.ColumnList').getElementsByClassName('ColumnTitle')[0].innerText.split('\n')[0],"CardTitle":NewTitle,"EventType":"등록","EventTime":new Date().getTime()});
    AddDeleteLogRegister(events[events.length - 1].ColumnName,events[events.length - 1].CardTitle,events[events.length - 1].EventType,events[events.length - 1].EventTime);
}

function CardModifying(TargetCard){
    let BeforeTitle=TargetCard.getElementsByClassName('CardTitle')[0].innerText;
    let BeforeBody=TargetCard.getElementsByClassName('CardBody')[0].innerText.replace(/\*\n/g,"\n").replace(/\* /g,"");

    TargetCard.className='NewCard';
    TargetCard.innerHTML=ModifyCardForm(BeforeTitle,BeforeBody);
    CardHeightAdjust(TargetCard.getElementsByClassName('CardInput')[0]);

    function CancelModify(){
        TargetCard.innerHTML=MakeNewCard(BeforeTitle,BeforeBody,"web");
        TargetCard.style.height='';
        TargetCard.className='ColumnCards';
    }
    function ConfirmModify(){
        let NewTitle=TargetCard.getElementsByClassName('TitleInput')[0].value;
        let NewBody=TargetCard.getElementsByClassName('CardInput')[0].value.trim();
        TargetCard.innerHTML=MakeNewCard(NewTitle,NewBody,"web");
        TargetCard.style.height='';
        TargetCard.className='ColumnCards';
        events.push({"FromTitle":BeforeTitle,"ToTitle":NewTitle,"EventType":"변경","EventTime":new Date().getTime()});
        ModifyLogRegister(events[events.length - 1].FromTitle,events[events.length - 1].ToTitle,events[events.length - 1].EventType,events[events.length - 1].EventTime)
    }
    
    TargetCard.getElementsByClassName('ModifyCancel')[0].addEventListener("click",CancelModify);
    TargetCard.getElementsByClassName('ModifyConfirm')[0].addEventListener("click",ConfirmModify);
}

export { RegisterFormShow,CardHeightAdjust,CardMaking,CardModifying }