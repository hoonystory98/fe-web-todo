//for card sort, title change, column register
window.onload = function(){
    init.Column.forEach(Column=>{
        let ColumnCards=Column.Lists;
        let ColumnID="cards-"+Column.ID;
        let ColumnHTML=`<div class="ColumnList">
                        <div class="ColumnHead">
                            <div class="ColumnTitle">${Column.Name}<span class="CardCount" id="Count-${Column.ID}">${Column.Lists.length}</span></div>
                            <div class="ButtonGroup">
                                <i class="fa-solid fa-plus" onclick="RegisterFormShow(this)"></i>
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                        <div class="NewCard">
                            <div class="CardTitle"><input type="text" placeholder="제목을 입력하세요" class="TitleInput"></input></div>
                            <div class="CardBody"><textarea type="text" placeholder="내용을 입력하세요" maxlength="500" class="CardInput" onkeydown="CardHeightAdjust(this)" onkeyup="CardHeightAdjust(this)"></textarea></div>
                            <div class="CardButton"><button class="CardCancel" onclick="RegisterFormShow(this)">취소</button><button class="CardRegister" data-section="${Column.ID}" disabled="false" onclick="CardMaking(this)">등록</button></div>
                        </div>
                        <div class="CardSection" id="cards-${Column.ID}">
                        </div>
                    </div>`;
        
        document.getElementsByClassName("ColumnSection")[0].innerHTML+=(ColumnHTML);
        
        ColumnCards.forEach(Card=>{
            let CardBody=Card.Body.trim().replace(/\n\n/g,"").replace(/\r\n|\n|\r/g,"<br>* ");
            if((/<br>/).test(CardBody)){
                CardBody = '* ' + CardBody;
            }

            let CardHTML=`<div class="ColumnCards" id="${Column.ID}-${Card.CardID}" draggable="true" ondblclick="CardModifying(this)">
                            <div class="CardTitle">${Card.Title}<i class="fa-solid fa-xmark" onclick="ModalDelete(this)"></i></div>
                            <div class="CardBody">${CardBody}</div>
                            <div class="CardAuthor">author by ${Card.Author}</div>
                          </div>`;
            
            document.getElementById(ColumnID).innerHTML+=(CardHTML);
        })
    });
}