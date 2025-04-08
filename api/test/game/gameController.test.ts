import io from "socket.io-client";
import { server, PORT } from "../../src/server";
import WSSResponse from "../../src/wss-response";
import GameService from "../../src/services/gameService";
import { waitForMessage } from "../utils";

jest.mock("../../src/services/gameService");

const mockHasPlayer = jest.spyOn(GameService, "hasPlayer");
const mockAddPlayer = jest.spyOn(GameService, "addPlayer");

describe("Game Controller should", () => {
    let clientSocket: SocketIOClient.Socket;

    beforeEach((done) => {
        clientSocket = io(`http://localhost:${PORT}`);
        clientSocket.on("connect", () => {
            done();
        });
    });

    afterEach(() => {
        clientSocket.disconnect();
        jest.clearAllMocks(); // Reset mocks after each test
    });

    afterAll((done) => {
        server.close(() => {
            done();
        });
    });

    it("let player join an empty game", async () => {
        mockHasPlayer.mockResolvedValue(false); // Player does not exist
        mockAddPlayer.mockImplementation(async () => {}); // Mock player addition

        const data = {
            code: 0,
            name: "player-1"
        };

        clientSocket.emit("joinGame", data);

        const response: WSSResponse = await waitForMessage(clientSocket);
        expect(response.success).toBe(true);
        expect(mockHasPlayer).toHaveBeenCalledWith(0, "player-1");
        expect(mockAddPlayer).toHaveBeenCalledWith(0, "player-1");
    });

    it("deny player to join a game with already taken name", async () => {
        mockHasPlayer.mockResolvedValueOnce(false); // First join: player not in game
        mockHasPlayer.mockResolvedValueOnce(true);  // Second join: player exists
        mockAddPlayer.mockImplementation(async () => {});

        const data = {
            code: 0,
            name: "player-1"
        };

        clientSocket.emit("joinGame", data);

        const firstResponse: WSSResponse = await waitForMessage(clientSocket);
        expect(firstResponse.success).toBe(true)
        expect(mockHasPlayer).toHaveBeenCalledWith(0, "player-1");
        expect(mockAddPlayer).toHaveBeenCalledWith(0, "player-1");

        // Now attempt to join again with the same name
        clientSocket.emit("joinGame", data);

        const secondResponse: WSSResponse = await waitForMessage(clientSocket);
        expect(secondResponse.success).toBe(false)
        expect(mockHasPlayer).toHaveBeenCalledTimes(2);
    });

    it("let two players join with the same name if game rooms are different", async () => {
        mockHasPlayer.mockImplementationOnce(async (code) => code != 0); // player does not exist in game 0
        mockHasPlayer.mockImplementationOnce(async (code) => code == 0); // player now exists in game 1
        mockAddPlayer.mockImplementation(async () => {});

        const playerA = {
            code: 0,
            name: "player-1"
        };

        const playerB = {
            code: Math.floor(Math.random() * 10) + 1, // Different game room
            name: "player-1"
        };

        clientSocket.emit("joinGame", playerA);

        const responseA: WSSResponse = await waitForMessage(clientSocket);
        expect(responseA.success).toBe(true);

        clientSocket.emit("joinGame", playerB);

        const responseB: WSSResponse = await waitForMessage(clientSocket);
        expect(responseB.success).toBe(true);
    });
});
