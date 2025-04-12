import { QuestionModel } from "../models/question";
import axios from "axios";

const embedText = async (text: string) => {
    const response = await axios.post("localhost:5000", {
        text
    });

    const { embedding } = response.data;
    return embedding;
}

class QuestionService {
    static async addQuestion(question: string, options: [string], topics: [string], answer: number): Promise<void> {
        const embedding = await embedText(question);
        const newQuestion = new QuestionModel({ question, options, topics, answer, embedding });
        await newQuestion.save();
    }
}

export default QuestionService;