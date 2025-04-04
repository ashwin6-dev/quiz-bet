class Game {
    private players: Set<string>;

    constructor() {
        this.players = new Set<string>();
    }

    addPlayer(name: string): void {
        this.players.add(name);
    }

    hasPlayer(name: string): boolean {
        return this.players.has(name);
    }
}

export default Game;