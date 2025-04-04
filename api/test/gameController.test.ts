import io from "socket.io-client";
import { server, PORT } from "../src/server";
import WSSResponse from "../src/wss-response";
import GameService from "../src/services/game-service";

jest.mock("../src/services/game-service");

const mockHasPlayer = jest.spyOn(GameService, "hasPlayer");
const mockAddPlayer = jest.spyOn(GameService, "addPlayer");

const expectWithDoneGen = (object: any, expectation: any, done: jest.DoneCallback, isElse: boolean = false) => {
    try {
        expect(object).toBe(expectation);
        if (!isElse) done();
    } catch (error) {
        done(error);
    }
};

const expectDone = (object: any, expectation: any, done: jest.DoneCallback) => {
    expectWithDoneGen(object, expectation, done);
};

const expectElseDone = (object: any, expectation: any, done: jest.DoneCallback) => {
    expectWithDoneGen(object, expectation, done, true);
};

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

    it("let player join an empty game", (done) => {
        mockHasPlayer.mockResolvedValue(false); // Player does not exist
        mockAddPlayer.mockImplementation(async () => {}); // Mock player addition

        const data = {
            code: 0,
            name: "player-1"
        };

        clientSocket.emit("joinGame", data);

        clientSocket.once("message", (data: WSSResponse) => {
            expectDone(data.success, true, done);
            expect(mockHasPlayer).toHaveBeenCalledWith(0, "player-1");
            expect(mockAddPlayer).toHaveBeenCalledWith(0, "player-1");
        });
    });

    it("deny player to join a game with already taken name", (done) => {
        mockHasPlayer.mockResolvedValueOnce(false); // First join: player not in game
        mockHasPlayer.mockResolvedValueOnce(true);  // Second join: player exists
        mockAddPlayer.mockImplementation(async () => {});

        const data = {
            code: 0,
            name: "player-1"
        };

        clientSocket.emit("joinGame", data);

        clientSocket.once("message", (firstResponse: WSSResponse) => {
            expectElseDone(firstResponse.success, true, done);
            expect(mockHasPlayer).toHaveBeenCalledWith(0, "player-1");
            expect(mockAddPlayer).toHaveBeenCalledWith(0, "player-1");

            // Now attempt to join again with the same name
            clientSocket.emit("joinGame", data);
            clientSocket.once("message", (secondResponse: WSSResponse) => {
                expectDone(secondResponse.success, false, done);
                expect(mockHasPlayer).toHaveBeenCalledTimes(2);
            });
        });
    });

    it("let two players join with the same name if game rooms are different", (done) => {
        mockHasPlayer.mockImplementationOnce(async (code) => code != 0); // player does not exist in game 0
        mockHasPlayer.mockImplementationOnce(async (code) => code == 0); // player now exists in game 1
        mockAddPlayer.mockImplementation(async () => {});

        const playerA = {
            code: 0,
            name: "player-1"
        };

        const playerB = {
            code: Math.floor(1 + Math.random() * 10), // Different game room
            name: "player-1"
        };

        clientSocket.emit("joinGame", playerA);

        clientSocket.once("message", (responseA: WSSResponse) => {
            expectElseDone(responseA.success, true, done);

            const secondClientSocket = io(`http://localhost:${PORT}`);

            secondClientSocket.on("connect", () => {
                secondClientSocket.emit("joinGame", playerB);

                secondClientSocket.once("message", (responseB: WSSResponse) => {
                    try {
                        expect(responseB.success).toBe(true);
                        secondClientSocket.disconnect();
                        done();
                    } catch (error) {
                        secondClientSocket.disconnect();
                        done(error);
                    }
                });
            });
        });
    });
});
