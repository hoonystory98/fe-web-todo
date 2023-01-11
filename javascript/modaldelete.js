function ModalDelete(CardDeleteButton) {
    const ModalHTML = `<div class="Modal" id="ModalDeleteForm" style="display:block">
                            <div class="ModalAlert">
                                <div class="ModalMessage">선택한 카드를 삭제할까요?</div>
                                <div class="ModalButton"><button class="ModalCancel">취소</button><button class="ModalDelete">삭제</button></div>
                            </div>
                       </div>`;
    document.body.innerHTML+=ModalHTML;
    let ModalTarget=document.getElementById("ModalDeleteForm");
    let Card=TraversalFindCard(CardDeleteButton);
    let CardCategory=Card.id.split('-')[0];

    ModalTarget.addEventListener('click', (event) => {
        if (event.target === ModalTarget) {
            ModalTarget.remove();
        }
    });

    let ModalDeleteButton=document.getElementsByClassName("ModalDelete")[0];
    ModalDeleteButton.addEventListener("click",function(){
        document.getElementById(String(Card.id)).remove();
        document.getElementById("ModalDeleteForm").remove();
        document.getElementById(`Count-${CardCategory}`).innerHTML=parseInt(document.getElementById(`Count-${CardCategory}`).innerHTML)-1;
    });
    document.getElementsByClassName("ModalCancel")[0].addEventListener("click",()=>{
        document.getElementById("ModalDeleteForm").remove();
    });
}

function TraversalFindCard(dom){
    if(dom.classList.contains("ColumnCards")){
        return dom;
    }
    return TraversalFindCard(dom.parentElement);
}