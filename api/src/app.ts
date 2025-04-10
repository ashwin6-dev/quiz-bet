import express, { Router } from "express";
import QuestionRouter from "./routes/question";
import GameRouter from "./routes/game";

const app = express();
app.use(express.json());

const router = Router();

router.use("/question", QuestionRouter);
router.use("/game", GameRouter);

export default app;