import mongoose from "mongoose";
import { QuestionSchema } from "./question";

const GameSchema = new mongoose.Schema({
  code: { type: Number, required: true },
  questions: { type: [QuestionSchema], required: true }
});

const GameModel = mongoose.model("Game", GameSchema);

export default GameModel;