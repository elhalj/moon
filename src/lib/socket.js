import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// use to store online user
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) userSocketMap[userId] = socket.id

    // io.emit is used to send is use to send event to all the connect client
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    // Gestion des événements de typing
    socket.on("typing", (receiverId) => {
        console.log(`Événement typing reçu de ${userId} pour ${receiverId}`);
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            console.log(`Émission de userTyping vers ${receiverId} (socket: ${receiverSocketId})`);
            io.to(receiverSocketId).emit("userTyping", { userId });
        } else {
            console.log(`Impossible de trouver le socket pour le destinataire ${receiverId}`);
        }
    });

    socket.on("stopTyping", (receiverId) => {
        console.log(`Événement stopTyping reçu de ${userId} pour ${receiverId}`);
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            console.log(`Émission de userStopTyping vers ${receiverId} (socket: ${receiverSocketId})`);
            io.to(receiverSocketId).emit("userStopTyping", { userId });
        } else {
            console.log(`Impossible de trouver le socket pour le destinataire ${receiverId}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});

export { io, server, app };