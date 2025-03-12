const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.urlencoded({ extended: true }));

app.post("/auth", function (req, res) {
  /* This server is only available to nginx */
  const streamkey = req.body.key;

  /* You can make a database of users instead :) */
  if (streamkey === "supersecret") {
    res.status(200).send();
    return;
  }

  /* Reject the stream */
  res.status(403).send();
});

let viewers = -1;

wss.on('connection', (ws) => {
  viewers++;
  console.log('New connection, viewers:', viewers);
  broadcastViewers();

  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all clients
    const parsedMessage = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
    });
  });

  ws.on('close', () => {
    viewers--;
    console.log('Connection closed, viewers:', viewers);
    broadcastViewers();
  });
});

function broadcastViewers() {
  const message = JSON.stringify({ type: 'viewers', count: viewers });
  console.log('Broadcasting viewers:', viewers);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(8000, () => {
  console.log('Server is listening on port 8000');
});