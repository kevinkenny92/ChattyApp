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
const prepMsg = function(message) {
  let returnMessage = {
    type: "incomingMessage",
    id: uuidv4(),
    username: message.username,
    content: message.content
  }
  console.log("Here's the returnMessage: ");
  console.log(returnMessage);
  return returnMessage;
};

const prepareNot = function(notification) {
  let returnNotification = {
    type: "incomingNotification",
    id: uuidv4(),
    content: notification.content
  }
  console.log("Here's the returnNotification: ");
  console.log(returnNotification);
  return returnNotification;
};


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

//MESSAGING

  ws.on('message', function incoming(event) {
    let data = JSON.parse(event);
    switch(data.type) {
      case "postMsg":
        let rcvdMsg = JSON.parse(event);
        console.log("Received a message: ");
        console.log(rcvdMsg);
        // Use prepMsg() to prepare a new outgoing chat message
        let preparedMessage = JSON.stringify(prepMsg(rcvdMsg));
        // Broast the new message to all clients
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(preparedMessage);
          }
        });
        break;
      // a postNotification is a user changing their display name
      case "postNotification":
        let receivedNotification = JSON.parse(event);
        console.log("Received a notification: ");
        console.log(receivedNotification);
        // Use prepareNot() to prepare a new outgoing user name notification
        let preparedNotification = JSON.stringify(prepareNot(receivedNotification));
        // Broadcast the new message to all clients
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(preparedNotification);
          }
        });
        break;
      default:
        // If message type is unknown, throw error
        throw new Error("Unknown event type " + data.type);
    }
  });

  // When a client closes the socket, calls sendUserCount to reflect one less user
  ws.on('close', () => {
    console.log('Client disconnected');
    // Update the user count, given a closed connection
    sendUserCount();
  });
});
