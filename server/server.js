const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Пользователь подключился через WebSocket');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Рассылка сообщений всем клиентам
    });
    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

app.get('/updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const intervalId = setInterval(() => {
        res.write(`data: Новое событие: ${new Date().toISOString()}\n\n`);
    }, 5000);

    req.on('close', () => {
        clearInterval(intervalId);
        console.log('SSE клиент отключился');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
