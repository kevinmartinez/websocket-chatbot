// Create an express app by requiring the express module
const express = require('express')
const http = require('http')
// ws module, build a WebSocket server
const WebSocketServer = require('ws')
// Application instance of express, by invoking the express method
const app = express()

// Set up Bot answers in an array of objects
// TODO: Move to an api file
let botAnswers = [
  {
    question: 'hi',
    answer: 'hello'
  },
  {
    question: 'help',
    answer: 'here are my help options: '
  },
  {
    question: 'time',
    answer: 'the current time is: '
  },
  {
    question: 'who',
    answer: 'i am a bot'
  },
  {
    question: 'bye',
    answer: 'ciao'
  }
]

// Middleware to log each request, when we have a request, the express app will use this middleware,
// BEFORE going to the static. This adds functionality to our pipeline,
// it will go through the pipeline, through the use methods when we have,
// a request, until it get a response
app.use((request, response, next) => {
  console.log(`${request.method} request for ${request.url}`)
  next()
})

// express.static() invokes the static file server
// Serve static files to express via middleware
app.use(express.static('./public'))

// Invoke express get method...
app.get('/api', (request, response) => {
  // Output the bot answers
  response.json(botAnswers)
})

const server = http.createServer(app)
const wss = new WebSocketServer.Server({ server })

// When new socket connected, this will fire up
// First argument is an 'individual' socket ('ws')
// Think of a websocket as a connected endpoint
// Every client that connects will call this on function to fire
wss.on('connection', (ws) => {
  ws.send(`${botAnswers[2].answer}`)

  console.log('socket connection?')
})

// wss.on('connection', function connection (ws, req) {
//   const location = url.parse(req.url, true)
//   // You might use location.query.access_token to authenticate or share sessions
//   // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

//   ws.on('message', function incoming (message) {
//     console.log('received: %s', message)
//   })

//   ws.send('something')
// })

// The express app should listen to this port
server.listen(8080, () => console.log(`Listening on port: ${server.address().port}`))

// By exporting this app instance as a module,
// it can be included in other files, e.g test files
module.exports = app
