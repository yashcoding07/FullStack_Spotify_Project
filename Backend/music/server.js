import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import http from "http";
import initSocketServer from "./src/sockets/socket.server.js";

const httpServer = http.createServer(app);

connectDB();

initSocketServer(httpServer);

httpServer.listen('3002', () => {
    console.log("Music server is running on port 3002");
});
