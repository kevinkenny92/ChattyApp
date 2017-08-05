const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;

//PORT GENERATE
const PORT = 3001;

// Create a new express server
const server = express()

  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });
const uuidv4 = require('uuid/v4');

const prepareMessage = function(message) {
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

const prepareNotification = function(notification) {
  let returnNotification = {
    type: "incomingNotification",
    id: uuidv4(),
    content: notification.content
  }
  console.log("Here's the returnNotification: ");
  console.log(returnNotification);
  return returnNotification;
};

const getUserCount = function(count) {
  let latestUserCount = {
    type: "userCountUpdate",
    id: uuidv4(),
    content: count
  }
  return latestUserCount;
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
  ws.on('message', function incoming(event) {
    let data = JSON.parse(event);
    switch(data.type) {
      case "postMessage":
        let receivedMessage = JSON.parse(event);
        console.log("Received a message: ");
        console.log(receivedMessage);

        let preparedMessage = JSON.stringify(prepareMessage(receivedMessage));
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(preparedMessage);
          }
        });
        break;
      case "postNotification":
        let receivedNotification = JSON.parse(event);
        console.log("Received a notification: ");
        console.log(receivedNotification);
        let preparedNotification = JSON.stringify(prepareNotification(receivedNotification));
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(preparedNotification);
          }
        });
        break;
      default:
        throw new Error("Unknown event type " + data.type);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    sendUserCount();
  });
});