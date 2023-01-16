import { ModalDelete } from "./modaldelete.js";
import { MakeCardSection,MakeNewCard } from "./templates.js";
import { RegisterFormShow,CardHeightAdjust,CardMaking,CardModifying } from "./card.js";
import { DeleteColumn,ChangeColTitle } from "./columns.js";
import { DragCard } from "./dragndrop.js";

let init={
    "Column":[
        {
            "Name":"해야할 일",
            "ID":"todo",
            "Lists":[{
                "CardID":1,
                "Title":"블로그에 포스팅할 것",
                "Body":"GitHub 공부내용\n모던 자바스크립트 공부내용",
                "Author":"web"
            },{
                "CardID":2,
                "Title":"GitHub 공부하기",
                "Body":"add, commit, push",
                "Author":"web"
            }]
        },
        {
            "Name":"하고있는 일",
            "ID":"doing",
            "Lists":[{
                "CardID":3,
                "Title":"Javascript 공부하기",
                "Body":"addEventListener",
                "Author":"web"
            }]
        },
        {
            "Name":"완료한 일",
            "ID":"done",
            "Lists":[]
        }
    ]
};
let events=[];
let dragAble=false;

function MakeInitCol(){
    init.Column.forEach(Column=>{
        let ColumnCards=Column.Lists;
        let ColumnID=Column.ID;
        let ColumnHTML=MakeCardSection(Column.Name,ColumnID,ColumnCards.length);
        document.getElementsByClassName("ColumnSection")[0].innerHTML+=(ColumnHTML);

        ColumnCards.forEach(Card=>{
            let NewCardForm = document.createElement("div");
            NewCardForm.classList="ColumnCards";
            NewCardForm.id=`${Column.ID}-${Card.CardID}`;
            NewCardForm.innerHTML=MakeNewCard(Card.Title,Card.Body,Card.Author);
            document.getElementById("cards-"+ColumnID).prepend(NewCardForm);
        });
    });
}

MakeInitCol();

const acolumn = document.getElementsByClassName('ColumnSection')[0];

acolumn.addEventListener('click', (e) => {
    const inputbuttons = e.target.closest('.ShowInputForm');
    if(inputbuttons != null){
        const collist = inputbuttons.closest('.ColumnList');
        RegisterFormShow(collist);
    }
});
acolumn.addEventListener('click', (e) => {
    const modifybuttons = e.target.closest('.CardModify');
    if(modifybuttons != null){
        const targetcard = modifybuttons.closest('.ColumnCards');
        CardModifying(targetcard);
    }
});
acolumn.addEventListener('input', (e) => {
    const inputarea = e.target.closest('.CardInput');
    if(inputarea != null){
        CardHeightAdjust(inputarea);
    }
});
acolumn.addEventListener('click', (e) => {
    const deletebuttons = e.target.closest('.CardDelete');
    if(deletebuttons != null){
        const targetcard = deletebuttons.closest('.ColumnCards');
        ModalDelete(targetcard);
    }
});
acolumn.addEventListener('click', (e) => {
    const registerbutton = e.target.closest('.CardRegister');
    if(registerbutton != null){
        const registerform = registerbutton.closest('.NewCard');
        if(registerform != null){
            CardMaking(registerform);
        }
    }
});
acolumn.addEventListener('click', (e) => {
    const coldeletebuttons = e.target.closest('.ColumnDelete');
    if(coldeletebuttons != null){
        const targetcolumn = coldeletebuttons.closest('.ColumnList');
        DeleteColumn(targetcolumn);
    }
});
acolumn.addEventListener('dblclick', (e) => {
    const columntitle = e.target.closest('.ColumnTitle');
    if(columntitle != null){
        ChangeColTitle(columntitle);
    }
})


acolumn.addEventListener('mousedown', (e) => {
    const cursoroncard = e.target.closest('.ColumnCards');
    if(cursoroncard != null){
        console.log("Really drag?")
        dragAble=true;
    }
});
acolumn.addEventListener('mousemove', (e) => {
    const cursoroncard = e.target.closest('.ColumnCards');
    if(cursoroncard && dragAble){
        console.log("You are trying to drag card!")
        DragCard(e);
        dragAble=false;
    }
});
acolumn.addEventListener('mouseup', (e) => {
    const colsec = e.target.closest('.ColumnSection');
    if(colsec!=null){
        dragAble=false;
    }
});
// acolumn.addEventListener('mousedown', (e) => {
//     const cardundercursor = e.target.closest('.ColumnCards');
//     if(cardundercursor != null){
//         dragchecker=true;
//         start_drag(e,cardundercursor);
//     }
// });
// acolumn.addEventListener('mousemove', (e) => {
//     const cursoroncard = e.target.closest('.FloatingCard');
//     if(cursoroncard && dragchecker){
//         console.log(e.pageX,e.pageY);
//         on_drag(e,cursoroncard)
//     }
// });
// acolumn.addEventListener('mouseup', (e) => {
//     const cursoroncard = e.target.closest('.ColumnCards');
//     if(cursoroncard && dragchecker){
//         console.log("Drag Done!")
//         dragchecker=false;
//     }
// });

export {events,acolumn};