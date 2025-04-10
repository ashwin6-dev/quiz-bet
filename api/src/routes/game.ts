import { Router } from "express";
import GameController from "../controllers/gameController";

const router = Router();

new GameController(router);

export default router;