import { events } from "./main.js";
import { movelogregister } from "./sidemenu.js";

let currentDroppable=null;

function dragcard(e){
    let TargetCard=e.target.closest('.ColumnCards');
    const BeforeColumn=TargetCard.closest('.ColumnList');
    let IllusionCard=TargetCard.cloneNode(true);
    let shiftX = e.clientX - e.target.getBoundingClientRect().left;
    let shiftY = e.clientY - e.target.getBoundingClientRect().top;

    TargetCard.classList.add('ShadowCard');
    IllusionCard.classList.add('FloatingCard');
    document.body.style.cursor="move";
    document.body.style.userSelect="none";
    IllusionCard.style.pointerEvents="none";
    TargetCard.style.pointerEvents="none";
    document.body.append(IllusionCard);

    moveAt(e.pageX, e.pageY);

    function moveAt(pageX, pageY) {
        IllusionCard.style.left = pageX - shiftX + 'px';
        IllusionCard.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event){
        moveAt(event.pageX, event.pageY);

        let elemBelow=document.elementFromPoint(event.clientX,event.clientY);

        if(!elemBelow)
            return;
        
        let droppableBelow=elemBelow.closest('.CardSection');
        let cardbetween=elemBelow.closest('.ColumnCards');
        if(cardbetween != null){
            let cardmid=(cardbetween.getBoundingClientRect().top + cardbetween.getBoundingClientRect().bottom) / 2;
            if(event.pageY > cardmid){
                cardbetween.insertAdjacentElement("afterend",TargetCard);
            }
            else{
                cardbetween.insertAdjacentElement("beforebegin",TargetCard);
            }
        }
        if(currentDroppable != droppableBelow){
            if(currentDroppable != null){
                droppableBelow.append(TargetCard);
            }
            currentDroppable=droppableBelow;
        }
    }

    document.addEventListener("mousemove",onMouseMove);

    function onMouseup(){
        document.removeEventListener("mousemove",onMouseMove);
        document.body.style.cursor='';
        document.body.style.userSelect='';
        IllusionCard.remove();
        TargetCard.classList.remove('ShadowCard');
        const AfterColumn=TargetCard.closest('.ColumnList');
        TargetCard.style.pointerEvents='';

        BeforeColumn.getElementsByClassName('CardCount')[0].innerHTML=BeforeColumn.getElementsByClassName('CardSection')[0].children.length;
        AfterColumn.getElementsByClassName('CardCount')[0].innerHTML=AfterColumn.getElementsByClassName('CardSection')[0].children.length;
        events.push({"CardTitle":TargetCard.getElementsByClassName('CardTitle')[0].innerText,"FromColumn":BeforeColumn.getElementsByClassName('ColumnTitle')[0].innerHTML,"ToColumn":AfterColumn.getElementsByClassName('ColumnTitle')[0].innerHTML,"EventType":"이동","EventTime":new Date().getTime()});
        movelogregister(TargetCard.getElementsByClassName('CardTitle')[0].innerText,BeforeColumn.getElementsByClassName('ColumnTitle')[0].innerHTML,AfterColumn.getElementsByClassName('ColumnTitle')[0].innerHTML,events[events.length - 1].EventType,events[events.length - 1].EventTime);
        document.removeEventListener("mouseup",onMouseup);
    }

    document.addEventListener("mouseup",onMouseup);
}

export {dragcard};