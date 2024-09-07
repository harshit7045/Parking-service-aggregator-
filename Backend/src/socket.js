import express from 'express';
import http from 'http';
import { Server } from 'socket.io';


const socketApp = express();
socketApp.use(express.json());
const socketServer = http.createServer(socketApp);
const io = new Server(socketServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*', // Allow all origins
        methods: "*",
    },
});

io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
});

export default socketServer;

