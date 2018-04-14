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

// Need to creat somewhat unique id's
let user = 0

app.use(express.static('public'))

app.locals.appTitle = 'WebSocket ChatBot'

// Our views
app.set('view engine', 'pug')

// let msg = null

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
  // Create an unique user id
  let userID = ++user
  console.log('Client #%d connected', userID)

  ws.on('error', (error) => {
    console.log(error.stack)
    console.log(error.message)
  })

  // Add listeners to the WebSocket
  ws.on('message', (message, id) => {
    id = userID

    if (message === 'exit') {
      ws.send(`User #${id}, you have disconnected`)
      ws.close()
    } else {
      // All socket clients are placed in an array
      wss.options.server.getConnections((error, number) => {
        if (error) {
          console.error(error.stack)
        }
        console.log('# of connections (from wss.options.server.getConnections(): ' + number)
      })

      wss.clients.forEach((client) => {
        // Send message to each client in the loop
        client.send(message, id, (error) => {
          console.log(`message from client: ${id}`)
          if (error) {
            console.error(error.stack)
          }
        })
        // Loop through Q/A API
        for (let i = 0; i < questions.length; i++) {
          console.log(questions[i])

          if (message.toLowerCase() === questions[i]) {
            client.send(`iFriend: ${api[i].answer}`)
          }
        }
      })
    }
    ws.on('close', (message) => {
      console.log(`User ${id} is 'CLOSING DOWN`)
    })
  })

  // Static welcome message sent from server
  ws.send(`iFriend: Hello friend, Do you have any questions? If you want tips about questions to ask, type '-help'`)
})

// The express app should listen to this port
server.listen(port, () => console.log(`Listening on port: ${server.address().port}`))
