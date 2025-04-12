import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  topics: { type: [String], required: true },
  answer: { type: Number, required: true },
  embedding: { type: [Number], required: true }
});

const QuestionModel = mongoose.model("Question", QuestionSchema);

export { QuestionModel, QuestionSchema };