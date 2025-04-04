import WSSResponse from "../wss-response";
import Controller from "./controllers";

interface GameRequest {
    code: number;
    name: string;
}

class GameController extends Controller { 
    protected init(): void {
        this.addEventHandler("joinGame", this.joinGame)
    }

    private joinGame(data: GameRequest): WSSResponse {
        return { success: false };
    }
}

export default GameController;