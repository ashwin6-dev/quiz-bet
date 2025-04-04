import Game from "../models/game";
import WSSResponse from "../wss-response";
import Controller from "./controllers";

interface GameRequest {
    code: number;
    name: string;
}

class GameController extends Controller { 
    private games!: Map<number, Game>;

    protected init(): void {
        this.games = new Map<number, Game>();
        this.addEventHandler("joinGame", this.joinGame.bind(this))
    }

    private joinGame(data: GameRequest): WSSResponse {
        const { code, name } = data;
        let game = this.games.get(code);

        if (!game) {
            game = new Game();
            this.games.set(code, game);
        }

        if (!game.hasPlayer(name)) {
            game.addPlayer(name);
            return { success: true };
        } else {
            return { success: false };
        }
    }
}

export default GameController;