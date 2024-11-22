// 2024_10_25_動作確定これが正しいhttpのWebSocketサーバー
// ポート番号の入力が最下部にあるから注意
// WebSocketが動かない時はポートを殺してやる
// 現在は8080設定
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];
let tasks = {}; // タスクの状態を保持

wss.on('connection', (ws) => {
  // console.log('New WebSocket connection');
  clients.push(ws);

  // 新しいクライアントに現在のタスク状態を送信
  ws.send(JSON.stringify({ type: 'updateTasks', tasks: tasks }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'updateTasks') {
        tasks = data.tasks; // タスクの状態を更新
        broadcastTasks();
      }
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
    }
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

function broadcastTasks() {
  const message = JSON.stringify({ type: 'updateTasks', tasks: tasks });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket server is running on ws://0.0.0.0:${PORT}`);
});



// 2024_10_25_動作は未確定,httpsのWebSocketサーバー
// const https = require('https');
// const fs = require('fs');
// const path = require('path');
// const WebSocket = require('ws');

// // SSL証明書の読み込み
// const options = {
//   key: fs.readFileSync(path.join(__dirname, 'server.key')),
//   cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
// };

// // HTTPSサーバーの作成
// const server = https.createServer(options);

// // WebSocketサーバーの作成
// const wss = new WebSocket.Server({ server });

// let clients = [];
// let tasks = {}; // タスクの状態を保持

// wss.on('connection', (ws) => {
//   console.log('New WebSocket connection');
//   clients.push(ws);

//   // 新しいクライアントに現在のタスク状態を送信
//   ws.send(JSON.stringify({ type: 'updateTasks', tasks: tasks }));

//   ws.on('message', (message) => {
//     try {
//       const data = JSON.parse(message);
//       if (data.type === 'updateTasks') {
//         tasks = data.tasks; // タスクの状態を更新
//         broadcastTasks();
//       }
//     } catch (e) {
//       console.error('Failed to parse WebSocket message:', e);
//     }
//   });

//   ws.on('close', () => {
//     clients = clients.filter(client => client !== ws);
//   });
// });

// function broadcastTasks() {
//   const message = JSON.stringify({ type: 'updateTasks', tasks: tasks });
//   clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message);
//     }
//   });
// }

// const PORT = process.env.PORT || 8081;
// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`HTTPS Server is running on https://0.0.0.0:${PORT}`);
//   console.log(`WebSocket server is running on wss://0.0.0.0:${PORT}`);
// });
