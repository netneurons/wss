const express = require('express');
const WebSocket = require('ws');
const url = require('url');
const { setAuth,loadChatId,clearContext,sendMessage,getMessage,} = require("poe-npm");
const app = express();
const fetch = require("node-fetch");
const formkey = "24740fbf83f10ac69cec1c6d76441f9d";
const cookie = "VHOtnHuzh8f1ODx6xx-sFg==";
setAuth("Quora-Formkey", formkey);
setAuth("Cookie", `m-b=${cookie}`);
app.use(express.static('public'));

const wss = new WebSocket.Server({ noServer: true });

// Define a function to be triggered by messages
async function processMessage(p) {
  try{
  const bot = "abdeltest";
  const chatId = await loadChatId(bot);
  await clearContext(chatId);
  await sendMessage(bot, chatId, p);
  const response = await getMessage(bot, chatId);
  return response;
    } catch (err) {
    console.error('Error processing message:', err);
    throw err;
    }
}

wss.on('connection', function connection(ws, req) {
  const origin = req.headers.origin;
  const { hostname } = url.parse(origin);

  if (hostname !== 'comfortable-emphasized-elk.glitch.me') {
    ws.close(1000, 'Unauthorized');
    return;
  }
  console.log('WebSocket connection opened');

  ws.on('message', async function incoming(message) {
    console.log('Received message:', message);
    const decoder = new TextDecoder();
    const decodedMessage = decoder.decode(message);
    console.log('Processed message:', decodedMessage);
    const result = await processMessage(decodedMessage);
    ws.send(result);
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });
});



const server = app.listen(3030, () => {
  console.log('Server is running on port 3000');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});
