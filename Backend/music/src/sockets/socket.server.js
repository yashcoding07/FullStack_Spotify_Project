import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import _config from "../config/config.js";
import cookie from 'cookie';

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    io.use((socket, next) => {
        const cookies = cookie.parse(Socket.handshake.headers.cookie || " ");
        const token = cookies.token;

        if(!token){
            return next(new Error("Authentication Error"));
        }

        try {
            const decoded = jwt.verify(token , _config.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            return next(new Error("Authentication error"));
        }
    })

    io.on('connection', (socket) => {
        socket.join(Socket.user.id);

        socket.on('play', (data) => {
            socket.broadcast.to(Socket.user.id).emit("play", { musicId })
        })

        socket.on('disconnect', () => {
            socket.leave(Socket.user.id);
        })
    })
}

export default initSocketServer;