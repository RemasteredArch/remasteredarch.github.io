var mouseX
var mouseY
var card
var cardX
var cardY
var cardCenterX
var cardCenterY
var tiltX
var tiltY
const reporter = document.getElementById('reporter')
const root = document.querySelector(':root')

var report = false // Set to true for reporting

function card() {

}

function cursorReport(event) {

  card = event.srcElement
  cardX = Math.round(card.getBoundingClientRect().x + card.getBoundingClientRect().width / 2)
  cardY = Math.round(card.getBoundingClientRect().y + card.getBoundingClientRect().height / 2)
  mouseX = event.clientX
  mouseY = event.clientY

  tilt()

  if (report === true) {
    reporter.innerHTML =
    '<b>Mouse x:</b> ' + mouseX +
    '<br><b>Mouse y:</b> ' + mouseY +
    '<br><b>Card x:</b> ' + cardX +
    '<br><b>Card y:</b> ' + cardY +
    '<br><b>Window width:</b> ' + window.innerWidth +
    '<br><b>Base Card X:</b> ' + Math.round(card.getBoundingClientRect().x) +
    '<br><b>Base Card Y:</b> ' + Math.round(card.getBoundingClientRect().y) +
    '<br><b>Tilt X:</b> ' + tiltX +
    '<br><b>Tilt Y:</b> ' + tiltY
  }
}

function tilt() {

  tiltX = (cardX - mouseX) / 20
  root.style.setProperty('--tiltX', tiltX + 'deg')
  tiltY = (cardY - mouseY) / -20
  root.style.setProperty('--tiltY', tiltY + 'deg')

}

function clickLog(event) {
  if (report === true) {
    console.log(
      'CARD: x: ' + cardX + ' y: ' + cardY,
      'CURSOR: x: ' + mouseX + ' y: ' + mouseY,
      event.srcElement.getBoundingClientRect()
    )
  }
}
