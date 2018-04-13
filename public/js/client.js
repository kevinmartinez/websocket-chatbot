'use strict'

const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host)

// WebSocket emit message
ws.onmessage = (message) => printMessage(message.data)

// Select our form that will contain the messages
const chatForm = document.querySelector('.chat-form')
// Select the chat messages area, for auto scrolling
const phoneCase = document.querySelector('.phone-case')

chatForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const input = document.getElementById('message')
  // Send input to server
  ws.send(input.value)
  // Clean up input field
  input.value = ''
})

// I have built a function that scrolls the chat field
// To create a proper 'auto-scrolling' when new messages
// are recieved
const scrollDown = (element, parent) => {
  const topPos = element.offsetTop
  parent.scrollTop = topPos
}

// Why? Create elements easier
const newElement = (element) => {
  return document.createElement(element)
}

// Why? Log messages
const timeStamp = () => {
  const time = new Date()
  return time.toLocaleTimeString('en-GB')
}

// Why? Output messages
const printMessage = (message) => {
  const time = timeStamp()
  const li = newElement('li')
  const p = newElement('p')

  if (message.includes('iFriend') || message.includes('disconnected')) {
    li.classList = 'chat__box chat__box--cpu'
    p.classList = 'chat__text chat__text--cpu'
  } else {
    li.classList = 'chat__box chat__box--user'
    p.classList = 'chat__text chat__text--user'
  }

  li.innerHTML = `<header>${time}</header>`
  p.innerText = `${message}`

  document.querySelector('ul.messages').appendChild(li).appendChild(p)
  scrollDown(li, phoneCase)
}
