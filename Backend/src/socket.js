import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketRegister from './utils/socketregister.js';
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
    
    
    socket.on('userConnected', async ({ ownerToken, socketId, parkingLotName }) => {
        
        console.log(`User connected with ownerToken: ${ownerToken}, socketId: ${socketId}, parkingLotName: ${parkingLotName}`);
        let lotData= await socketRegister(socketId, ownerToken,parkingLotName);
        socket.emit('lotData', lotData);
    });

    
    // Handle socket disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});
function emitToSpecificSocket(socketId, event, data) {
    io.to(socketId).emit(event, data); // Send the event with data to the specific socket ID
  }
export  {socketServer,emitToSpecificSocket};
