import { PlayerModel } from "../models/player";

class PlayerService {
    static async hasPlayer(code: number, name: string): Promise<boolean> {
        const player = await PlayerModel.findOne({ code, name });
        return player !== null;
    }

    static async addPlayer(code: number, name: string): Promise<void> {
        const player = new PlayerModel({ code, name });
        await player.save();
    }
}

export default PlayerService;