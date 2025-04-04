import app from "./app";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import GameController from "./controllers/gameController";

const server = createServer(app);
const io = new Server(server, {
    cors: { origin : "*" }
});

const addSocketControllers = (socket: Socket) => {
    new GameController(socket, io);
}

io.on("connection", addSocketControllers);

export default server;