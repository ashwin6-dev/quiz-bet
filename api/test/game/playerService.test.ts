import PlayerService from "../../src/services/playerService";
import { PlayerModel } from "../../src/models/player";

jest.mock("../../src/models/player")

describe("Game Service", () => {
    describe("Has Player should", () => {
        it("return true if player exists in a game", async () => {
            const mockGame = [{ name: "player-1", code: 0 }];
            
            (PlayerModel.findOne as jest.Mock).mockResolvedValue(mockGame);

            const result = await PlayerService.hasPlayer(0, "player-1");
            expect(result).toBe(true);
            expect(PlayerModel.findOne).toHaveBeenCalledWith({ name: "player-1", code: 0 });
        })

        it("return false if player does not exist in the game", async () => {
            (PlayerModel.findOne as jest.Mock).mockResolvedValue(null);

            const result = await PlayerService.hasPlayer(0, "player-1");
            expect(result).toBe(false);
            expect(PlayerModel.findOne).toHaveBeenCalledWith({ name: "player-1", code: 0 });
        });
    })
})