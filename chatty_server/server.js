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

// Modified for showing users online Step 4 final step ;


//USER COUNT //
const getUserCount = function(count) {
  let onlineUserCount = {
    type: "userCountUpdate",
    id: uuidv4(),
    content: count
  }
  return onlineUserCount;
}


wss.on('connection', (ws) => {
  const sendUserCount = function(count) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(getUserCount(wss.clients.size)));
      }
    })
  }
  console.log('Client connected');
  sendUserCount();

  // When a client closes the socket, calls sendUserCount to reflect one less user
  ws.on('close', () => {
    console.log('Client disconnected');
    // Update the user count, given a closed connection
    sendUserCount();
  });
});
