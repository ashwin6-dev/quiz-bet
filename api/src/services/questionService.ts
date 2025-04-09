import { QuestionModel } from "../models/question";

class QuestionService {
    static async addQuestion(question: string, options: [string], topics: [string], answer: number): Promise<void> {
        const newQuestion = new QuestionModel({ question, options, topics, answer });
        await newQuestion.save();
    }
}

export default QuestionService;