import QuestionService from "../services/questionService";
import Controller from "./controller";
import { Request, Response } from "express";

class QuestionController extends Controller {
    protected init(): void {
        this.router.post("add", this.addQuestion.bind(this));
    }

    private async addQuestion(req: Request, res: Response): Promise<void> {
        const { question, options, topics, answer } = req.body;

        await QuestionService.addQuestion(question, options, topics, answer);
        res.status(200);
    }
}

export default QuestionController;