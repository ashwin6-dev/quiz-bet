import mongoose from "mongoose";

const DEFAULT_POINTS = 100;

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  points: { type: Number, default: DEFAULT_POINTS }
});

const PlayerModel = mongoose.model("Player", PlayerSchema);

export { PlayerModel, PlayerSchema };