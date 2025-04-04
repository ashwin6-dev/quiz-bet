import GameModel from "../models/game";

class GameService {
    static async hasPlayer(code: number, name: string): Promise<boolean> {
        const game = await GameModel.findOne({ code });
        return game ? game.players.some(player => player.name === name) : false;
    }

    static async addPlayer(code: number, name: string): Promise<void> {
        let game = await GameModel.findOne({ code });

        if (!game) {
            game = new GameModel({ code, players: [{ name }] });
        } else {
            const playerExists = game.players.some(player => player.name === name);
            if (!playerExists) {
                game.players.push({ name });
            }
        }

        await game.save();
    }
}

export default GameService;