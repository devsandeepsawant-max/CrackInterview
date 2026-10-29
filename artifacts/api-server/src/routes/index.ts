import { Router, type IRouter } from "express";
import healthRouter from "./health";
import interviewIqRouter from "./interviewiq";

const router: IRouter = Router();

router.use(healthRouter);
router.use(interviewIqRouter);

export default router;
