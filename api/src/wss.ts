import app from "./app";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import GameWSController from "./ws-controllers/gameController";

const server = createServer(app);
const io = new Server(server, {
    cors: { origin : "*" }
});

const addSocketControllers = (socket: Socket) => {
    new GameWSController(socket, io);
}

io.on("connection", addSocketControllers);

export default server;