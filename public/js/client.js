// Create a new WebSocket instance
const ws = new WebSocket('ws://localhost:3030')

// WebSocket on connection
ws.onopen = () => console.log('socket connected')

// WebSocket on close
ws.onclose = () => console.log('socket disconnnected')

// WebSocket emit message
ws.onmessage = (message) => printMessage(message.data)

// Select our form that will contain the messages
const chatForm = document.querySelector('.chat-form')

chatForm.addEventListener('submit', (event) => {
  event.preventDefault()
  let input = document.getElementById('message')
  // Send input to server
  ws.send(input.value)
  // Clean up input field
  input.value = ''
})

// Print user message to document
const printMessage = (message) => {
  console.log(message)
  const li = document.createElement('li')
  const p = document.createElement('p')
  if (message.includes('Bot')) {
    li.className = 'chat__box--cpu'
    p.classList = 'chat__text chat__text--cpu'
  } else {
    li.className = 'chat__box--user'
    p.classList = 'chat__text chat__text--user'
  }

  p.innerText = message
  document.querySelector('ul.messages').appendChild(li).appendChild(p)
}
