
function calculateVCaretContainerCoords(vCaretContainerEl: HTMLTextAreaElement ): { left: number, top: number } {
  const vCaretContainerRect = vCaretContainerEl.getBoundingClientRect();
  return {
    left: vCaretContainerRect.x,
    top:  vCaretContainerRect.y,
  };
}

function moveVCaretToOffset(offset: number, vCaretContainerEl: HTMLTextAreaElement, vCaretEl: HTMLDivElement): void {
  const x = offsetToX(offset, vCaretContainerContentWidth(vCaretContainerEl));
  const y = offsetToY(offset, vCaretContainerContentWidth(vCaretContainerEl), lineHeight(vCaretContainerEl));
  console.log(`(${x},${y})`);
  moveVCaretTo(x, y, vCaretEl);
}

function animateVCaretToOffset(offset: number, vCaretContainerEl: HTMLTextAreaElement, vCaretEl: HTMLDivElement): void {
  const x = offsetToX(offset, vCaretContainerContentWidth(vCaretContainerEl));
  const y = offsetToY(offset, vCaretContainerContentWidth(vCaretContainerEl), lineHeight(vCaretContainerEl));
  animateVCaretTo(x, y, vCaretEl);
}

function animateVCaretTo(x: number, y: number, vCaretEl: HTMLDivElement): void {
  const vCaretRect = vCaretEl.getBoundingClientRect();
  const keyframes = [
    { left: `${vCaretRect.left}px` }, { left: `${vCaretStartX + x}px` }
  ]
  const animation = {
    duration: 100,
    easing:   "linear",
  }
  vCaretEl.animate(keyframes, animation);
  vCaretEl.style.left = `calc(${vCaretStartX + x}px)`;
  vCaretEl.style.top  = `calc(${vCaretStartY + y}px)`;
}

function offsetToX(offset: number, lineWidth: number): number {
  const chars = offset % vCaretPositionsPerLine(charsPerLine(lineWidth, charWidth()))
  return chars * charWidth();
}
function offsetToY(offset: number, lineWidth: number, lineHeight: number): number {
  const lines = Math.floor(offset/vCaretPositionsPerLine(charsPerLine(lineWidth, charWidth())));
  return lines * lineHeight;
}

function lineHeight(vCaretContainerEl: HTMLTextAreaElement): number {
  const propName = "line-height";
  const propValue = window.getComputedStyle(vCaretContainerEl).getPropertyValue(propName);
  return isNaN(parseFloat(propValue))
    // TODO: don't hardcode
    ? 16
    // TODO: what about relative units?
    : parseFloat(propValue);
}

function charWidth(): number {
  // TODO: don't hardcode, refer https://developer.mozilla.org/en-US/docs/Glossary/Advance_measure
  return 8;
}

function charsPerLine(lineWidth: number, charWidth: number): number {
  return Math.floor(lineWidth/charWidth);
}

function vCaretPositionsPerLine(charsPerLine: number): number {
  return charsPerLine + 1;
}

function moveVCaretTo(x: number, y: number, vCaretEl: HTMLDivElement) {
  const vCaretLeft = getVCaretStartX().concat(" + ").concat(`${x}px`);
  const vCaretTop  = getVCaretStartY().concat(" + ").concat(`${y}px`);
  vCaretEl.style.left = `calc(${vCaretLeft})`;
  vCaretEl.style.top  = `calc(${vCaretTop})`;
}

function vCaretContainerContentWidth(vCaretContainerEl: HTMLTextAreaElement): number {
  return  vCaretContainerEl.scrollWidth;
}

function vCaretContainerBorderLeftWidth(vCaretContainerEl: HTMLTextAreaElement): string {
  const vCaretContainerComputedStyles = window.getComputedStyle(vCaretContainerEl);
  return vCaretContainerComputedStyles.getPropertyValue("border-left-width");
}
function vCaretContainerBorderRightWidth(vCaretContainerEl: HTMLTextAreaElement): string {
  const vCaretContainerComputedStyles = window.getComputedStyle(vCaretContainerEl);
  return vCaretContainerComputedStyles.getPropertyValue("border-right-width");
}
function vCaretContainerBorderTopWidth(vCaretContainerEl: HTMLTextAreaElement): string {
  const vCaretContainerComputedStyles = window.getComputedStyle(vCaretContainerEl);
  return vCaretContainerComputedStyles.getPropertyValue("border-top-width");
}
function vCaretContainerPaddingLeft(vCaretContainerEl: HTMLTextAreaElement): string {
  const vCaretContainerComputedStyles = window.getComputedStyle(vCaretContainerEl);
  return vCaretContainerComputedStyles.getPropertyValue("padding-left");
}
function vCaretContainerPaddingRight(vCaretContainerEl: HTMLTextAreaElement): string {
  const vCaretContainerComputedStyles = window.getComputedStyle(vCaretContainerEl);
  return vCaretContainerComputedStyles.getPropertyValue("padding-right");
}
function vCaretContainerPaddingTop(vCaretContainerEl: HTMLTextAreaElement): string {
  const vCaretContainerComputedStyles = window.getComputedStyle(vCaretContainerEl);
  return vCaretContainerComputedStyles.getPropertyValue("padding-top");
}

const VIRTUAL_CARET_CONTAINER_EL_ID = "textarea";
const VIRTUAL_CARET_EL_ID           = "virtual-caret";

function getVCaretStartX() {
  const vCaretContainerEl     = document.getElementById(VIRTUAL_CARET_CONTAINER_EL_ID) as HTMLTextAreaElement;
  const vCaretEl              = document.getElementById(VIRTUAL_CARET_EL_ID) as HTMLDivElement;

  const vCaretContainerCoords = calculateVCaretContainerCoords(vCaretContainerEl);

  // TODO: error prone
  return `
             ${vCaretContainerCoords.left}px
           + ${vCaretContainerBorderLeftWidth(vCaretContainerEl)}
           + ${vCaretContainerPaddingLeft(vCaretContainerEl)}
         `;

}

function getVCaretStartY() {
  const vCaretContainerEl     = document.getElementById(VIRTUAL_CARET_CONTAINER_EL_ID) as HTMLTextAreaElement;
  const vCaretEl              = document.getElementById(VIRTUAL_CARET_EL_ID) as HTMLDivElement;

  const vCaretContainerCoords = calculateVCaretContainerCoords(vCaretContainerEl);

  // TODO: error prone
  return `
             ${vCaretContainerCoords.top}px
           + ${vCaretContainerBorderTopWidth(vCaretContainerEl)}
           + ${vCaretContainerPaddingTop(vCaretContainerEl)}
         `;

}

function updateVCaretPosition() {
  const vCaretContainerEl = document.getElementById(VIRTUAL_CARET_CONTAINER_EL_ID) as HTMLTextAreaElement;
  const vCaretEl          = document.getElementById(VIRTUAL_CARET_EL_ID) as HTMLDivElement;

  // moveVCaretToOffset(vCaretContainer.selectionStart, vCaretContainerEl, vCaretEl);
  animateVCaretToOffset(vCaretContainerEl.selectionStart, vCaretContainerEl, vCaretEl);
}

function init() {
  const vCaretContainerEl = document.getElementById(VIRTUAL_CARET_CONTAINER_EL_ID) as HTMLTextAreaElement;

  // https://stackoverflow.com/a/53999418
  // TODO: audit "all" events, there might be some lurking in corners, like the composition events
  vCaretContainerEl.addEventListener('keypress',        updateVCaretPosition); // Every character written
  vCaretContainerEl.addEventListener('mousedown',       updateVCaretPosition); // Click down
  vCaretContainerEl.addEventListener('touchstart',      updateVCaretPosition); // Mobile
  vCaretContainerEl.addEventListener('input',           updateVCaretPosition); // Other input events
  vCaretContainerEl.addEventListener('paste',           updateVCaretPosition); // Clipboard actions
  vCaretContainerEl.addEventListener('cut',             updateVCaretPosition);
  vCaretContainerEl.addEventListener('mousemove',       updateVCaretPosition); // Selection, dragging text
  vCaretContainerEl.addEventListener('select',          updateVCaretPosition); // Some browsers support this event
  vCaretContainerEl.addEventListener('selectionchange', updateVCaretPosition); // Some browsers support this event

  const vCaretEl = document.getElementById(VIRTUAL_CARET_EL_ID) as HTMLDivElement;
  moveVCaretToOffset(0, vCaretContainerEl, vCaretEl);
}

init();

const vCaretStartX = (function() {
  const vCaretEl     = document.getElementById(VIRTUAL_CARET_EL_ID) as HTMLDivElement;
  const vCaretRect   = vCaretEl.getBoundingClientRect();
  return vCaretRect.left;
})();
const vCaretStartY = (function() {
  const vCaretEl     = document.getElementById(VIRTUAL_CARET_EL_ID) as HTMLDivElement;
  const vCaretRect   = vCaretEl.getBoundingClientRect();
  return vCaretRect.top;
})();
