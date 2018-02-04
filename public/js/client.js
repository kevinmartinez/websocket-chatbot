const html =
`
<section>
  <heading>
    <h2 class="moo">Hello</h2>
    <div class="output"></div>
  </heading>
</section>
`

document.getElementById('botAnswer').innerHTML = html

// Create a new WebSocket instance
const ws = new WebSocket('ws://localhost:8080')

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
  const p = document.createElement('p')
  p.innerText = message
  document.querySelector('div.messages').appendChild(p)
}
