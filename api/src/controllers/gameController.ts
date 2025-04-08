import PlayerService from "../services/playerService";
import WSSResponse from "../wss-response";
import Controller from "./controllers";

interface GameRequest {
    code: number;
    name: string;
}

class GameController extends Controller { 
    protected init(): void {
        this.addEventHandler("joinGame", this.joinGame.bind(this))
    }

    private async joinGame(data: GameRequest): Promise<WSSResponse> {
        const { code, name } = data;
        const gameHasPlayer = await PlayerService.hasPlayer(code, name)

        if (gameHasPlayer) {
            return { success : false }
        }

        PlayerService.addPlayer(code, name);

        this.socket.to(code.toString());
        return { success : true };
    }
}

export default GameController;