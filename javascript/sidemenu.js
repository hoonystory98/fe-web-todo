//for side menu function, log sorting, time counting
import { MakeLogAddDelete,MakeLogModify } from "./templates.js";
import { events } from "./init.js";

const SideMenu = document.getElementsByClassName('SideMenu')[0];
const MenuLog = SideMenu.getElementsByClassName('MenuLog')[0];

function SideMenuShow(){
    MenuLog.innerHTML='';
    events.forEach(function(logevent){
        if(logevent.EventType=="변경"){
            ModifyLogRegister(logevent.FromTitle,logevent.ToTitle,logevent.EventType,logevent.EventTime);
        }
        else if(logevent.EventType=="이동"){
            console.log("Not Yet!");
        }
        else{
            AddDeleteLogRegister(logevent.ColumnName,logevent.CardTitle,logevent.EventType,logevent.EventTime);
        }
    });
    if(SideMenu.style.visibility != 'visible'){
        SideMenu.style.right = '0%';
        SideMenu.style.visibility = 'visible';
    }
    else{
        SideMenu.style.visibility = 'hidden';
        SideMenu.style.right = '-25%';
    }
}

function AddDeleteLogRegister(ColumnName,CardTitle,EventType,EventTime){
    let NewLogCard=document.createElement("div");
    NewLogCard.classList="LogCard";
    NewLogCard.innerHTML=MakeLogAddDelete(ColumnName,CardTitle,EventType,EventTime);
    MenuLog.prepend(NewLogCard);
}

function ModifyLogRegister(FromTitle,ToTitle,EventType,EventTime){
    let NewLogCard=document.createElement("div");
    NewLogCard.classList="LogCard";
    NewLogCard.innerHTML=MakeLogModify(FromTitle,ToTitle,EventType,EventTime);
    MenuLog.prepend(NewLogCard);
}

const menubuttons = document.getElementsByClassName("MenuButton");
Array.prototype.forEach.call(menubuttons, (el)=>{
    el.addEventListener("click",SideMenuShow);
});


export { SideMenuShow,MenuLog,AddDeleteLogRegister,ModifyLogRegister };