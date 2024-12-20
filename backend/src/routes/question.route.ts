import { Router } from "express";
import { answerQuestion } from "../controllers/question.controller";

const router = Router();

router.post("/answer", answerQuestion);

export default router;
