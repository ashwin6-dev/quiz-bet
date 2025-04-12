import { Router } from "express";
import QuestionController from "../controllers/questionController";

const router = Router();

new QuestionController(router);

export default router;