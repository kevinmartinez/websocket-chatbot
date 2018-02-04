const html =
`
<section>
  <heading>
    <h2 class="moo">Hello</h2>
    <div class="output"></div>
    <form id="form">
      <input type="text">
      <button type="submit">
    </form>
  </heading>
</section>
`

document.getElementById('main').innerHTML = html

const form = document.getElementById('form')
const output = document.querySelector('.output')

// Create a new WebSocket instance
const ws = new WebSocket('ws://localhost:8080')

ws.onopen = () => {
  console.log('socket io client hello')
}

ws.onclose = () => {
  console.log('user disconnnected')
}

ws.onmessage = (message) => {
  output.innerHTML = message.data
}

console.log(form)
