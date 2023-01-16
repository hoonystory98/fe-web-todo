import { CalcTimeLapse,isSingleCharacter } from "./queryfunc.js";

function MakeCardSection(ColName, ColId, ColCards){
    return `<div class="ColumnList" id="${ColId}">
                <div class="ColumnHead">
                    <div class="ColumnTitle">${ColName}</div>
                    <div class="CardCount" id="count-${ColId}">${ColCards}</div>
                    <div class="ButtonGroup">
                        <i class="fa-solid fa-plus ShowInputForm"></i>
                        <i class="fa-solid fa-xmark ColumnDelete"></i>
                    </div>
                </div>
                <div class="NewCard" style="display:none">
                    <div class="CardTitle">
                        <input type="text" placeholder="제목을 입력하세요" class="TitleInput"></input>
                    </div>
                    <div class="CardBody">
                        <textarea type="text" placeholder="내용을 입력하세요" maxlength="500" class="CardInput"></textarea>
                    </div>
                    <div class="CardButton">
                        <button class="CardCancel ShowInputForm">취소</button>
                        <button class="CardRegister" disabled="false">등록</button>
                    </div>
                </div>
                <div class="CardSection" id="cards-${ColId}">
                </div>
            </div>`;
}

function MakeNewCard(CardTitle, CardBody, CardAuthor){
    CardBody=CardBody.replace(/\r\n|\n|\r/g,"<br>* ");
    if((/<br>/).test(CardBody)){
        CardBody = '* ' + CardBody;
    }
    return `<div class="CardTitle">${CardTitle}<i class="fa-solid fa-xmark CardDelete"></i></div>
            <div class="CardBody">${CardBody}<i class="fa-solid fa-pencil CardModify"></i></div>
            <div class="CardAuthor">author by ${CardAuthor}</div>`;
}

//Log 이동
function MakeLogAddDelete(ColumnName, CardTitle, EventType, EventTime){
    return `<span class="SmileIcon">🥳</span>
            <div class="LogContent">
                <div class="CardUser">@sam</div>
                <div class="CardBody"><b>${ColumnName}</b>에서 <b>${CardTitle}</b>${((isSingleCharacter(CardTitle))?("를"):("을"))} <b>${EventType}</b>하였습니다.</div>
                <div class="CardTime">${CalcTimeLapse(EventTime)}</div>
            </div>`;
}
function MakeLogModify(FromTitle, ToTitle, EventType, EventTime){
    return `<span class="SmileIcon">🥳</span>
            <div class="LogContent">
                <div class="CardUser">@sam</div>
                <div class="CardBody"><strong>${FromTitle}</strong>에서 <strong>${ToTitle}</strong>${((isSingleCharacter(ToTitle))?("로"):("으로"))} <strong>${EventType}</strong>하였습니다.</div>
                <div class="CardTime">${CalcTimeLapse(EventTime)}</div>
            </div>`;
}
function MakeLogMove(CardTitle,FromColumn,ToColumn,EventType,EventTime){
    return `<span class="SmileIcon">🥳</span>
            <div class="LogContent">
                <div class="CardUser">@sam</div>
                <div class="CardBody"><strong>${CardTitle}</strong>${((isSingleCharacter(CardTitle))?("를"):("을"))} <strong>${FromColumn}</strong>에서 <strong>${ToColumn}</strong>${((isSingleCharacter(ToColumn))?("로"):("으로"))} <strong>${EventType}</strong>하였습니다.</div>
                <div class="CardTime">${CalcTimeLapse(EventTime)}</div>
            </div>`;
}

function ModifyCardForm(BeforeTitle, BeforeBody){
    return `<div class="CardTitle">
                <input type="text" class="TitleInput" value="${BeforeTitle}" placeholder="${BeforeTitle}"></input>
            </div>
            <div class="CardBody">
                <textarea type="text" class="CardInput" maxlength="500" placeholder="${BeforeBody}">${BeforeBody}</textarea>
            </div>
            <div class="CardButton">
                <button class="CardCancel ModifyCancel">취소</button>
                <button class="CardRegister ModifyConfirm">수정</button>
            </div>`;
}

export {MakeCardSection, MakeNewCard, MakeLogAddDelete, MakeLogModify, MakeLogMove, ModifyCardForm};