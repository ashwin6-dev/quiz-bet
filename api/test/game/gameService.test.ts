import GameService from "../../src/services/game-service";
import GameModel from "../../src/models/game";

jest.mock("../../src/models/game")

describe("Game Service", () => {
    describe("Has Player should", () => {
        it("return true if player exists in a game", async () => {
            const mockGame = { players: [{ name: "player-1" }] };
            
            (GameModel.findOne as jest.Mock).mockResolvedValue(mockGame);

            const result = await GameService.hasPlayer(0, "player-1");
            expect(result).toBe(true);
            expect(GameModel.findOne).toHaveBeenCalledWith({ code: 0 });
        })

        it("return false if player does not exist in the game", async () => {
            (GameModel.findOne as jest.Mock).mockResolvedValue({ players: [] });

            const result = await GameService.hasPlayer(0, "player-1");
            expect(result).toBe(false);
            expect(GameModel.findOne).toHaveBeenCalledWith({ code: 0 });
        });

        it("return false if game does not exist", async () => {
            (GameModel.findOne as jest.Mock).mockResolvedValue(null);

            const result = await GameService.hasPlayer(0, "player-1");
            expect(result).toBe(false);
            expect(GameModel.findOne).toHaveBeenCalledWith({ code: 0 });
        });
    })

    describe("Add Player Should", () => {
        it("add a player to an existing game", async () => {
            const mockGame = {
                code: 0,
                players: [], 
                save: jest.fn()
            };

            (GameModel.findOne as jest.Mock).mockResolvedValue(mockGame);

            await GameService.addPlayer(0, "player-1");

            expect(mockGame.players).toEqual([{ name: "player-1" }]);
            expect(mockGame.save).toHaveBeenCalled();
        });

        it("add a player to a new game", async () => {
            (GameModel.findOne as jest.Mock).mockResolvedValue(null);
            (GameModel as jest.MockedFunction<any>).mockImplementation(() => ({
                players: [],
                save: jest.fn()
            }));

            await GameService.addPlayer(0, "player-1");
            expect(GameModel).toHaveBeenCalledWith({ code: 0, players: [{ name: "player-1" }] });
        });
    })
})