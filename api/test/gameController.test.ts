import io from "socket.io-client";
import { server, PORT } from "../src/server";
import WSSResponse from "../src/wss-response";

const expectWithDoneGen = (object: any, expectation: any, done: jest.DoneCallback, isElse: boolean = false) => {
    try {
        expect(object).toBe(expectation);
        if (!isElse) done();
    } catch (error) {
        done(error);
    }
}

const expectDone = (object: any, expectation: any, done: jest.DoneCallback) => {
    expectWithDoneGen(object, expectation, done);
}

const expectElseDone = (object: any, expectation: any, done: jest.DoneCallback) => {
    expectWithDoneGen(object, expectation, done, true);
}

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
    });

    afterAll((done) => {
        server.close(() => {
            done()
        });
    })

    it("let player join an empty game", (done) => {
        const data = {
            code: 0,
            name: "player-1"
        };

        clientSocket.emit("joinGame", data);

        clientSocket.once("message", (data: WSSResponse) => {
            expectDone(data.success, true, done);
        });
    });

    it("deny player to join a game with already taken name", (done) => {
        const data = {
            code: 0,
            name: "player-1"
        };

        clientSocket.emit("joinGame", data);

        clientSocket.once("message", (firstResponse: WSSResponse) => {
            expectElseDone(firstResponse.success, true, done); // First player joins successfully

            // Now attempt to join again with the same name
            clientSocket.emit("joinGame", data);
            clientSocket.once("message", (secondResponse: WSSResponse) => {
                expectDone(secondResponse.success, false, done); // Second attempt should fail
            });
        });
    });

    it("let two players join with the same name if game rooms are different", (done) => {
        const playerA = {
            code: 0,
            name: "player-1"
        };

        const playerB = {
            code: 1, // Different game room
            name: "player-1"
        };

        clientSocket.emit("joinGame", playerA);

        clientSocket.once("message", (responseA: WSSResponse) => {
            expectElseDone(responseA.success, true, done); // First player joins room 0 successfully

            const secondClientSocket = io(`http://localhost:${PORT}`);

            secondClientSocket.on("connect", () => {
                secondClientSocket.emit("joinGame", playerB);

                secondClientSocket.once("message", (responseB: WSSResponse) => {
                    try {
                        expect(responseB.success).toBe(true); // Second player joins room 1 successfully
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