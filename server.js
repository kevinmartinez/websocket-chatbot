'use strict'

const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const app = express() // Get an application instance of 'express'
const port = process.env.PORT || 5000
const api = require('./api/answers.json')

let questions = api.map((item) => {
  return item.question
})

app.use(express.static('public'))

app.locals.appTitle = 'WebSocket ChatBot'

// Setup PUG as templating language
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index')
})

// Invoke express get method...
app.get('/api', (request, response) => {
  // Output the bot answers,
  response.json(api)
})

// Connect express app and the websocket server
const server = http.createServer(app)

const wss = new WebSocket.Server({ server })
// When new socket connected, this will fire up
// First argument is an 'individual' socket ('ws')
// Think of a websocket as a connected endpoint
// Every client that connects will call this on function to fire
wss.on('connection', (ws, req) => {
  // Add listeners to the WebSocket
  ws.on('message', (message) => {
    if (message === 'exit') {
      ws.send(`You have disconnected`)
      ws.close()
    } else {
      // All socket clients are placed in an array
      wss.clients.forEach((client) => {
        // Send message to each client in the loop
        client.send(message)
        // Loop through Q/A API
        for (let i = 0; i < questions.length; i++) {
          if (message.toLowerCase() === questions[i]) {
            client.send(`iFriend: ${api[i].answer}`)
          }
        }
      })
    }
  })

  // Static welcome message sent from server
  ws.send(`iFriend: Hi friend! I answer questions! Type '-help' for tips`)
})

// The express app should listen to this port
server.listen(port, () => console.log(`Listening on port: ${server.address().port}`))
