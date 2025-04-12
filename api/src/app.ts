import express from "express";
import questionRouter from "./routes/question";

const app = express();
app.use(express.json());

app.use("/question", questionRouter);

export default app;