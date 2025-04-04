import mongoose from "mongoose";
import { PlayerSchema } from "./player";

const GameSchema = new mongoose.Schema({
  code: { type: Number, required: true },
  players: [PlayerSchema]
});

const GameModel = mongoose.model("Game", GameSchema);

export default GameModel;