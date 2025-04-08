import io from "socket.io-client";
import { server, PORT } from "../../src/server";
import WSSResponse from "../../src/wss-response";
import connectToMongoDB from "../../src/db";
import { waitForMessage, waitFor } from "../utils";
import PlayerService from "../../src/services/playerService";
import { PlayerModel } from "../../src/models/player";

const DB_UPDATE_WAIT = 150;

describe("Join Game", () => {
    let clientSocket: SocketIOClient.Socket;

    beforeAll(async () => {
        await connectToMongoDB();
        await PlayerModel.deleteMany({});
    })

    beforeEach((done) => {
        clientSocket = io(`http://localhost:${PORT}`);
        clientSocket.on("connect", () => {
            done();
        });
    });

    afterEach(async () => {
        clientSocket.disconnect();
        await PlayerModel.deleteMany({});
    });

    afterAll((done) => {
        server.close(() => {
            done();
        });
    });

    it("let player join an empty game", async () => {
        const data = {
            code: 0,
            name: "player-1"
        };

        clientSocket.emit("joinGame", data);

        const response: WSSResponse = await waitForMessage(clientSocket);
        await waitFor(DB_UPDATE_WAIT);

        expect(response.success).toBe(true);
        expect(await PlayerService.hasPlayer(0, "player-1")).toBe(true);
    });

    it("deny player to join a game with already taken name", async () => {
        const data = {
            code: 0,
            name: "player-1"
        };

        clientSocket.emit("joinGame", data);

        const firstResponse: WSSResponse = await waitForMessage(clientSocket);
        await waitFor(DB_UPDATE_WAIT);

        expect(firstResponse.success).toBe(true);

        clientSocket.emit("joinGame", data);

        const secondResponse: WSSResponse = await waitForMessage(clientSocket);
        await waitFor(DB_UPDATE_WAIT);

        expect(secondResponse.success).toBe(false);
        expect(await PlayerService.hasPlayer(0, "player-1")).toBe(true);
    });

    it("let two players join with the same name if game rooms are different", async () => {
        const playerA = {
            code: 0,
            name: "player-1"
        };

        const newGameRoom = Math.floor(Math.random() * 10) + 1;
        const playerB = {
            code: newGameRoom, // Different game room
            name: "player-1"
        };

        clientSocket.emit("joinGame", playerA);


        const responseA: WSSResponse = await waitForMessage(clientSocket);
        await waitFor(DB_UPDATE_WAIT);

        expect(await PlayerService.hasPlayer(0, "player-1")).toBe(true);
        expect(responseA.success).toBe(true);

        clientSocket.emit("joinGame", playerB);

        const responseB: WSSResponse = await waitForMessage(clientSocket);
        await waitFor(DB_UPDATE_WAIT);

        expect(responseB.success).toBe(true);
        expect(await PlayerService.hasPlayer(newGameRoom, "player-1")).toBe(true);
    });
});
