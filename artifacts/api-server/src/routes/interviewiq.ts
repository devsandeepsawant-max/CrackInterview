import { Router, type IRouter } from "express";
import {
  AnalyzeJobMatchBody,
  AnalyzeJobMatchResponse,
  CreateInterviewSessionBody,
  CreateInterviewSessionResponse,
  EvaluateInterviewAnswerBody,
  EvaluateInterviewAnswerParams,
  EvaluateInterviewAnswerResponse,
  GetInterviewIqDashboardResponse,
  GetReadinessPassportResponse,
  GetRoadmapResponse,
  UpdateRoadmapTaskBody,
  UpdateRoadmapTaskParams,
  UpdateRoadmapTaskResponse,
} from "@workspace/api-zod";
import {
  analyzeJobMatch,
  createInterviewSession,
  evaluateAnswer,
  getDashboard,
  getPassport,
  getRoadmap,
  getTask,
} from "../lib/interviewiq-demo";

const router: IRouter = Router();
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  const now = Date.now();
  const key = req.ip ?? "unknown";
  if (requestCounts.size > 1000) {
    for (const [address, entry] of requestCounts) {
      if (entry.resetAt <= now) requestCounts.delete(address);
    }
  }
  const current = requestCounts.get(key);
  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }
  if (current.count >= RATE_LIMIT) {
    res.status(429).json({ error: "Demo rate limit reached. Try again shortly." });
    return;
  }
  current.count += 1;
  next();
});

router.get("/interviewiq/dashboard", (_req, res) => {
  res.json(GetInterviewIqDashboardResponse.parse(getDashboard()));
});

router.post("/interviewiq/analyze", (req, res) => {
  const input = AnalyzeJobMatchBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: input.error.message });
    return;
  }
  res.json(AnalyzeJobMatchResponse.parse(analyzeJobMatch(input.data)));
});

router.post("/interviewiq/interviews", (req, res) => {
  const input = CreateInterviewSessionBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: input.error.message });
    return;
  }
  res
    .status(201)
    .json(CreateInterviewSessionResponse.parse(createInterviewSession(input.data)));
});

router.post("/interviewiq/interviews/:sessionId/answers", (req, res) => {
  const params = EvaluateInterviewAnswerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const input = EvaluateInterviewAnswerBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: input.error.message });
    return;
  }
  res.json(EvaluateInterviewAnswerResponse.parse(evaluateAnswer(input.data)));
});

router.get("/interviewiq/roadmap", (_req, res) => {
  res.json(GetRoadmapResponse.parse(getRoadmap()));
});

router.patch("/interviewiq/roadmap/tasks/:taskId", (req, res) => {
  const params = UpdateRoadmapTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const input = UpdateRoadmapTaskBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: input.error.message });
    return;
  }
  const task = getTask(params.data.taskId, input.data.completed);
  if (!task) {
    res.status(404).json({ error: "Preparation task not found" });
    return;
  }
  res.json(UpdateRoadmapTaskResponse.parse(task));
});

router.get("/interviewiq/passport", (_req, res) => {
  res.json(GetReadinessPassportResponse.parse(getPassport()));
});

export default router;
