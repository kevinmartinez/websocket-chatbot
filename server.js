'use strict'
// Create an express app by requiring the express module
const express = require('express')
const http = require('http')
const WebSocketServer = require('ws')
const app = express() // Get an application instance of 'express'

// Set up Bot answers in an array of objects
// The Chatbots answer API
const api = require('./public/api/answers.json')
console.log(`Question: ${api[3].question} and answer: ${api[3].answer}`)

// Needed to create somewhat unique user id's
let userId = 0
let questions = api.map((item) => {
  return item.question
})

console.log(questions)

// Middleware to log each request, when we have a request,
// the express app will use this middleware,
// BEFORE going to the static. This adds functionality to our pipeline,
// it will go through the pipeline, through the use methods when we have,
// a request, until it get a response
app.use((request, response, next) => {
  console.log(`${request.method} request for ${request.url}`)
  next()
})

// express.static() invokes the static file server
// Serve static files to express via middleware
app.use(express.static('public'))

app.set('view engine', 'pug')

app.get('/', function (req, res) {
  // WHY?
  res.render('index', {weather: null, error: null})
})

// Invoke express get method...
app.get('/api', (request, response) => {
  // Output the bot answers,
  response.json(api)
})

// Connect express app and the websocket server
const server = http.createServer(app)
// Test a verifyClient function
const verifyClient = (info, next) => {
  info.req.foo = 'bar'
  next(true)
}

const wss = new WebSocketServer.Server({ server, verifyClient })
// When new socket connected, this will fire up
// First argument is an 'individual' socket ('ws')
// Think of a websocket as a connected endpoint
// Every client that connects will call this on function to fire
wss.on('connection', (ws, req) => {
  // Create an unique user id
  var thisId = ++userId
  console.log(req.foo)
  console.log('Client #%d connected', thisId)

  // const location = url.parse(req.url, true)
  // console.log(location)
  // Add listeners to the WebSocket
  ws.on('message', (message, id) => {
    id = thisId
    console.log(`message from: ${message} [ ...SERVER]`)
    console.log(`msg from id: ${id}`)

    if (message === 'exit') {
      console.log(this)
      ws.send(`User #${thisId} quit`)
      ws.close()
    } else {
      // All socket clients are placed in an array
      wss.options.server.getConnections((error, number) => {
        if (error) {
          console.error(error)
        }
        console.log('# of connections (from wss.options.server.getConnections(): ' + number)
      })
      wss.clients.forEach((client) => {
        // Send message to each client in the loop
        client.send(message, (error) => {
          console.log(`message from client: ${message}`)
          if (error) {
            console.error(error)
          }
        })
        if (message === questions[0]) {
          client.send(`Bot says: ${api[0].answer}`)
        }
      })
    }
  })
  // Static welcome message sent from server
  ws.send(`Welcome`)
  console.log('socket connection?')
})

// The express app should listen to this port
server.listen(3030, () => console.log(`Listening on port: ${server.address().port}`))

// By exporting this app instance as a module,
// it can be included in other files, e.g test files
module.exports = app
