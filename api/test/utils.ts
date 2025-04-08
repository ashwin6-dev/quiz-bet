import WSSResponse from "../src/wss-response";

const waitForMessage = (socket: SocketIOClient.Socket): Promise<WSSResponse> =>
    new Promise(resolve => socket.once("message", resolve))

const waitFor = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

export { waitForMessage, waitFor }