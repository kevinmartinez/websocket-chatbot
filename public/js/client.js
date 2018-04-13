'use strict'

var host = location.origin.replace(/^http/, 'ws')

const ws = new WebSocket(host)

// const ws = new WebSocket('ws://www.host.com/path', {
//   perMessageDeflate: false
// });

// ws.onerror = (error) => {
//   console.log(error)
// }

// let userId
// // Get a unique id stamp
// userId = new Date()
// console.log(`userId: ${userId}`)

// WebSocket on connection, first 'style'
ws.addEventListener('open', () => {
  ws.send(`haiii [from: CLIENT]`)
})

// WebSocket on connection, second 'style'
ws.onopen = (message, error) => {
  // console.log('from client.js: ', message)
  // console.log(message.data)
}

// WebSocket emit message
ws.onmessage = (message, id) => {
  printMessage(message.data)
  console.log(id)
}

// WebSocket on close
ws.onclose = () => console.log('FRONT-END', 'socket disconnnected')

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
  // console.log('scrollDown()')
  const topPos = element.offsetTop
  // console.log(topPos)
  parent.scrollTop = topPos
}

// Create a 'create element' function
// TODO: advance upon it
const newElement = (element) => {
  return document.createElement(element)
}

const timeStamp = () => {
  const time = new Date()
  return time.toLocaleTimeString('en-GB')
}

// TODO: redo front-end logic, with a templating language
// PUG it
// Print user/cpu message to document
const printMessage = (message) => {
  const time = timeStamp()
  const li = newElement('li')
  const p = newElement('p')
  if (message.includes('iFriend') || message === 'Welcome') {
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
