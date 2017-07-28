// server.js

const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Use to generate random numbers, like our new message id
const uuidv4 = require('uuid/v4');

// Takes an incoming message, ignores its id from client, gives new id from uuidv4()
const sendMessage = function(message) {
  let newId = uuidv4();
  let returnMessage = {
    type: "incomingMessage",
    id: newId,
    username: message.username,
    content: message.content
  }
  console.log("Here's the returnMessage: ");
  console.log(returnMessage);
  return returnMessage;
};

const sendNotification = function(notification) {
  let returnNotification = {
    type: "incomingNotification",
    content: notification.content
  }
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', function incoming(message) {
    let receivedMessage = JSON.parse(message);
    console.log("Received a message: ");
    console.log(receivedMessage);
    let data = JSON.stringify(sendMessage(receivedMessage));
    // re-render the components and the new message should show up.
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});