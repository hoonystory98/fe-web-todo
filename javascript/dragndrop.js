//for card drag&drop
Card.onmousedown = function(event) {

    let shiftX = event.clientX - Card.getBoundingClientRect().left;
    let shiftY = event.clientY - Card.getBoundingClientRect().top;
  
    Card.style.position = 'absolute';
    Card.style.zIndex = 1000;
    document.body.append(Card);
  
    moveAt(event.pageX, event.pageY);
  
    function moveAt(pageX, pageY) {
      Card.style.left = pageX - shiftX + 'px';
      Card.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    document.addEventListener('mousemove', onMouseMove);
  
    Card.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      Card.onmouseup = null;
    };
  
  };
  
  Card.ondragstart = function() {
    return false;
  };