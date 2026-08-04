// https://stackoverflow.com/a/53999418
const textarea = document.querySelector('textarea')!;
textarea.addEventListener('keypress',        checkcaret); // Every character written
textarea.addEventListener('mousedown',       checkcaret); // Click down
textarea.addEventListener('touchstart',      checkcaret); // Mobile
textarea.addEventListener('input',           checkcaret); // Other input events
textarea.addEventListener('paste',           checkcaret); // Clipboard actions
textarea.addEventListener('cut',             checkcaret);
textarea.addEventListener('mousemove',       checkcaret); // Selection, dragging text
textarea.addEventListener('select',          checkcaret); // Some browsers support this event
textarea.addEventListener('selectionchange', checkcaret); // Some browsers support this event

let pos = 0;
function checkcaret() {
  const newPos = textarea.selectionStart;
  if (newPos !== pos) {
    console.log('change to ' + newPos);
    pos = newPos;
  }
}
