//for card drag&drop
//import { MakeLogMove } from "./templates.js";
import { acolumn } from "./init.js";

let currentDroppable=null;

function DragCard(e){
    let TargetCard=e.target.closest('.ColumnCards');
    let shiftX = e.clientX - e.target.getBoundingClientRect().left;
    let shiftY = e.clientY - e.target.getBoundingClientRect().top;

    TargetCard.style.opacity='0.8';
    TargetCard.style.pointerEvents='none';
    TargetCard.style.boxShadow='0px 0px 4px rgba(204, 204, 204, 0.5), 0px 2px 4px rgba(0, 0, 0, 0.25)';
    TargetCard.style.backdropFilter='blur(2px)';
    TargetCard.style.margin='0px 0px 0px 0px';
    TargetCard.style.position='absolute';
    TargetCard.style.zIndex=1000;
    acolumn.append(TargetCard);

    moveAt(e.pageX, e.pageY);

    function moveAt(pageX, pageY) {
        TargetCard.style.left = pageX - shiftX + 'px';
        TargetCard.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event){
        moveAt(event.pageX, event.pageY);

        //TargetCard.hidden=true;
        let elemBelow=document.elementFromPoint(event.clientX,event.clientY);
        TargetCard.hidden=false;

        if(!elemBelow)
            return;
        
        let droppableBelow=elemBelow.closest('.CardSection');
        if(currentDroppable != droppableBelow){
            if(currentDroppable){
                leaveDroppable(currentDroppable);
            }
            currentDroppable=droppableBelow;
        }
    }

    document.addEventListener("mousemove",onMouseMove);

    TargetCard.onmouseup = function(){
        document.removeEventListener("mousemove",onMouseMove);
        TargetCard.style.opacity='1';
        TargetCard.style.position='relative';
        TargetCard.onmouseup=null;
    }
}

// document.getElementsByClassName("ColumnSection")[0].ondragstart=function(){
//     return false;
// }

export {DragCard};