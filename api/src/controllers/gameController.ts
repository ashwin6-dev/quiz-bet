import Controller from "./controller";
import { Request, Response } from "express";

class GameController extends Controller {
    protected init(): void {
        this.router.post("create", this.createGame.bind(this));
    }

    private async createGame(req: Request, res: Response): Promise<void> {
        const { numberOfQuestions, topics } = req.body;
        
        res.status(200);
    }
}

export default GameController;