'use strict'
// Create an express app by requiring the express module
const express = require('express')
const http = require('http')
// ws module, build a WebSocket server
const WebSocketServer = require('ws')
// Application instance of express, by invoking the express method
const app = express()

// Set up Bot answers in an array of objects
// The Chatbots answer API
const api = require('./public/api/answers.json')
console.log(`Question: ${api[3].question} and answer: ${api[3].answer}`)

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
  // Output the bot answers,
  response.json(api)
})

// Connect express app and the websocket server
const server = http.createServer(app)
const wss = new WebSocketServer.Server({ server })

// When new socket connected, this will fire up
// First argument is an 'individual' socket ('ws')
// Think of a websocket as a connected endpoint
// Every client that connects will call this on function to fire
wss.on('connection', (ws) => {
  // Add listeners to the WebSocket
  ws.on('message', (message) => {
    if (message === 'exit') {
      ws.close()
    } else {
      // All socket clients are placed in an array
      wss.clients.forEach((client) => {
        // Send message to each client in the loop
        client.send(message, (error) => {
          if (error) {
            console.error(error)
            console.log('moo')
          }
        })
        if (message === questions[0]) {
          client.send(`Bot says: ${api[0].answer}`)
        }

// function checkAvailability(arr, val) {
//   return arr.some(arrVal => val === arrVal);
// }
      })
    }
  })
  // Static welcome message sent from server
  ws.send('Welcome')
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
server.listen(3030, () => console.log(`Listening on port: ${server.address().port}`))

// By exporting this app instance as a module,
// it can be included in other files, e.g test files
module.exports = app
