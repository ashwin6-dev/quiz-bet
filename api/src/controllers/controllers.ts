import { Server, Socket } from "socket.io";
import WSSResponse from "../wss-response";

abstract class Controller {
    protected socket: Socket;
    protected io: Server;

    constructor(socket: Socket, io: Server) {
        this.socket = socket;
        this.io = io;
        this.init();
    }

    protected abstract init(): void;

    protected addEventHandler(event: string, handler: (...args: any[]) => Promise<WSSResponse> | WSSResponse): void {
        this.socket.on(event, async (...args: any[]) => {
            let response = await handler(...args);
            this.socket.send(response);
        })
    }
}

export default Controller;