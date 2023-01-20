function getdom(className) {
  let domque = [];
  domque.push(document.body);
  DOMTokenList.prototype.find = Array.prototype.find;
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
  while (domque.length > 0) {
    const curnode = domque.shift();
    if (curnode.classList.find((cclass) => cclass === className)) {
      return curnode;
    }
    curnode.children.forEach((childnode) => {
      domque.push(childnode);
    });
  }

  return undefined;
}

function calctimelapse(value) {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "방금 전";
  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일 전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년 전`;
}

const issinglecharacter = function (text) {
  const strGa = 44032;
  const strHih = 55203;

  let lastStrCode = text.charCodeAt(text.length - 1);

  if (lastStrCode < strGa || lastStrCode > strHih) {
    return false;
  }
  return (lastStrCode - strGa) % 28 == 0;
};

const findcolumn = function (columnId) {
  console.log("Not Yet!");
};

//매직넘버 활용 이벤트 타입 부여

export { getdom, calctimelapse, issinglecharacter };
