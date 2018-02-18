'use strict'

const ws = new WebSocket('ws://localhost:3030')

// Test to add unique id
// For ex with timestamp?
// let userId = new Date()
// console.log(userId)

ws.addEventListener('open', () => {
  ws.send('haiii')
})

let userId

// WebSocket on connection
ws.onopen = () => {
  console.log('socket connected')
  userId = new Date()
  console.log(`user: ${userId} has connected`)
}

// WebSocket on close
ws.onclose = () => console.log('socket disconnnected')

// WebSocket emit message
ws.onmessage = (message) => {
  printMessage(message.data)
  // console.dir(message)
  console.log(userId)
}

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
  console.log('scrollDown()')
  const topPos = element.offsetTop
  console.log(topPos)
  parent.scrollTop = topPos
}

// If we create them beforehand, can we optimize?
// const li = document.createElement('li')
// const p = document.createElement('p')

// Create a 'create element' function
const newElement = (element) => {
  return document.createElement(element)
}

// Print user/cpu message to document
const printMessage = (message) => {
  console.log(message)
  const li = newElement('li')
  const p = newElement('p')
  if (message.includes('Bot') || message === 'Welcome') {
    li.className = 'chat__box--cpu'
    p.classList = 'chat__text chat__text--cpu'
  } else {
    li.className = 'chat__box--user'
    p.classList = 'chat__text chat__text--user'
  }

  p.innerText = message
  document.querySelector('ul.messages').appendChild(li).appendChild(p)
  scrollDown(li, phoneCase)
}
