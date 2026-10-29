import { randomUUID } from "node:crypto";
import type {
  AnswerEvaluation,
  Dashboard,
  InterviewSession,
  JobAnalysis,
  LearningTask,
  Passport,
  Requirement,
} from "@workspace/api-zod";

const skillCatalog = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "REST APIs",
  "PostgreSQL",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Python",
  "Java",
  "system design",
  "testing",
  "accessibility",
  "communication",
  "leadership",
  "collaboration",
  "problem solving",
  "project management",
  "customer service",
  "user research",
  "usability testing",
  "design systems",
  "prototyping",
  "product strategy",
  "stakeholder management",
  "data analysis",
  "Figma",
  "UX design",
  "visual design",
  "analytics",
];

const roadmapTasks: LearningTask[] = [
  {
    id: "task-evidence",
    day: 1,
    title: "Build an evidence bank",
    competency: "Behavioral storytelling",
    why: "Interviewers need clear examples of what you did, not only a list of skills.",
    lesson:
      "Choose one real project and note the situation, your responsibility, the actions you took, and the verified result.",
    exercise:
      "Write a four-part STAR outline for a project you can discuss confidently.",
    example:
      "Situation: a real constraint. Task: your responsibility. Action: your specific steps. Result: a result you can support.",
    completed: false,
    knowledgeCheck:
      "Which STAR section explains what you personally did?",
  },
  {
    id: "task-metrics",
    day: 2,
    title: "Make outcomes specific",
    competency: "Evidence and impact",
    why: "Specific outcomes make your contribution easier to understand and verify.",
    lesson:
      "Use a real count, time, quality measure, or user outcome only when you can explain how it was measured.",
    exercise:
      "Review three resume bullets and add a verified outcome where you have one.",
    example:
      "Improved [process] for [users/team]; describe the measurable change only if you can substantiate it.",
    completed: false,
    knowledgeCheck:
      "What should you do if you cannot verify a metric?",
  },
  {
    id: "task-tradeoffs",
    day: 3,
    title: "Explain one technical trade-off",
    competency: "Technical reasoning",
    why: "Role interviews often test how you make decisions, not just whether you know terms.",
    lesson:
      "Describe the constraint, options considered, reason for your choice, and the limitation you accepted.",
    exercise:
      "Pick a real project decision and explain its trade-offs in two minutes.",
    example:
      "Given [constraint], I compared [options] and chose [option] because [reason]; the trade-off was [limitation].",
    completed: false,
    knowledgeCheck:
      "What makes a technical decision explanation credible?",
  },
  {
    id: "task-debugging",
    day: 4,
    title: "Practice a debugging walkthrough",
    competency: "Problem solving",
    why: "A clear investigation process helps interviewers follow your reasoning.",
    lesson:
      "State the symptom, reproduce it, inspect evidence, test one hypothesis at a time, and confirm the fix.",
    exercise:
      "Talk through a real bug you solved, including how you knew it was resolved.",
    example:
      "I reproduced [symptom], checked [evidence], tested [hypothesis], then verified [fix] with [check].",
    completed: false,
    knowledgeCheck:
      "Why should you verify a fix after changing the code?",
  },
  {
    id: "task-questions",
    day: 5,
    title: "Prepare thoughtful questions",
    competency: "Communication",
    why: "Your questions can clarify expectations and show how you evaluate a role.",
    lesson:
      "Ask about current priorities, collaboration, and what success looks like in the first months.",
    exercise:
      "Write three questions specific to the team and role you are targeting.",
    example:
      "What would strong progress in this role look like during the first 90 days?",
    completed: false,
    knowledgeCheck:
      "What makes a question useful to both you and the interviewer?",
  },
  {
    id: "task-mock",
    day: 6,
    title: "Run a focused mock interview",
    competency: "Interview delivery",
    why: "A timed practice round helps reveal answers that need more structure or detail.",
    lesson:
      "Answer the question first, support your point with a specific example, and end with the result or lesson.",
    exercise:
      "Complete a short mock session and revise one answer using its feedback.",
    example:
      "Direct answer → concrete example → your contribution → verified outcome.",
    completed: false,
    knowledgeCheck:
      "What should you change first when feedback says your answer is vague?",
  },
  {
    id: "task-review",
    day: 7,
    title: "Review and set your next priority",
    competency: "Self-directed practice",
    why: "A small, specific next step is more useful than a broad goal to improve everything.",
    lesson:
      "Compare your evidence, practice scores, and remaining job requirements; choose one next action.",
    exercise:
      "Review the readiness report and write one practice priority for next week.",
    example:
      "I will practice [competency] by [specific exercise] and check progress using [evidence].",
    completed: false,
    knowledgeCheck:
      "What evidence would show that your next practice step helped?",
  },
];

export function getDashboard(): Dashboard {
  return {
    demoMode: true,
    candidateName: "Alex Morgan",
    targetRole: "Frontend Engineer",
    latestScore: 78,
    completedTasks: 2,
    totalTasks: roadmapTasks.length,
    strengths: ["React", "Communication", "Project ownership"],
    priorities: ["Measurable outcomes", "Technical trade-offs", "STAR structure"],
    recentActivity: [
      "Completed a behavioral practice session",
      "Finished the evidence bank exercise",
      "Reviewed a Frontend Engineer job match",
    ],
  };
}

export function analyzeJobMatch(input: {
  resumeText: string;
  jobDescription: string;
  targetRole: string;
  company: string;
}): JobAnalysis {
  const jobText = input.jobDescription.toLowerCase();
  const requirements = skillCatalog.filter((skill) =>
    jobText.includes(skill.toLowerCase()),
  );
  const selectedRequirements = (requirements.length
    ? requirements
    : ["communication", "problem solving", "testing"]
  ).slice(0, 10);
  const resumeSentences = input.resumeText
    .split(/[.!?\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const mapped = selectedRequirements.map((skill, index) => {
    const evidence = resumeSentences.find((sentence) =>
      sentence.toLowerCase().includes(skill.toLowerCase()),
    );
    const actionEvidence =
      evidence &&
      /\b(built|created|developed|designed|implemented|led|managed|optimized|delivered|tested|improved|launched|maintained|supported|resolved)\b/i.test(
        evidence,
      );
    const status: Requirement["status"] = !evidence
      ? "not-evidenced"
      : actionEvidence
        ? "demonstrated"
        : "partial";

    return {
      skill,
      importance: index < Math.ceil(selectedRequirements.length * 0.7)
        ? ("required" as const)
        : ("preferred" as const),
      status,
      evidence: evidence ?? "",
      explanation: !evidence
        ? "This term was not found in the supplied resume. That is missing evidence, not proof that you lack the skill."
        : actionEvidence
          ? "The resume mentions this skill alongside an action. Review the excerpt to confirm it represents your own work."
          : "The skill appears in the resume, but the supplied wording does not yet show a clear example of how you used it.",
    };
  });

  const totalWeight = mapped.reduce(
    (sum, requirement) => sum + (requirement.importance === "required" ? 1 : 0.6),
    0,
  );
  const supportedWeight = mapped.reduce((sum, requirement) => {
    const evidenceWeight =
      requirement.status === "demonstrated"
        ? 1
        : requirement.status === "partial"
          ? 0.5
          : 0;
    return (
      sum +
      evidenceWeight * (requirement.importance === "required" ? 1 : 0.6)
    );
  }, 0);
  const matchScore = totalWeight
    ? Math.round((supportedWeight / totalWeight) * 100)
    : 0;
  const interviewTopics = [...new Set(selectedRequirements)].slice(0, 5);

  return {
    demoMode: true,
    id: `analysis-${randomUUID()}`,
    targetRole: input.targetRole,
    company: input.company || "Target company",
    matchScore,
    scoreExplanation:
      "Demo score = weighted resume evidence ÷ total listed requirements. Required skills count as 1 point and preferred skills as 0.6; demonstrated evidence earns full credit, partial evidence half credit, and missing evidence zero. This is a keyword-based practice aid, not a hiring prediction.",
    requirements: mapped,
    interviewTopics,
    preparationPriorities: mapped
      .filter((item) => item.status !== "demonstrated")
      .slice(0, 4)
      .map((item) => item.skill),
  };
}

const questionBank: Record<
  string,
  Array<{ prompt: string; competency: string; followUp: string }>
> = {
  hr: [
    {
      prompt: "What interests you about this role and what would you bring to it?",
      competency: "Motivation and role alignment",
      followUp: "Which part of the role connects most closely to work you have done?",
    },
    {
      prompt: "Tell me about a time you had to adapt to a change at work or school.",
      competency: "Adaptability",
      followUp: "What did you change in your approach after that experience?",
    },
  ],
  behavioral: [
    {
      prompt: "Tell me about a project where you had to take ownership of a difficult problem.",
      competency: "Ownership and problem solving",
      followUp: "What did you personally do, and how did you know it worked?",
    },
    {
      prompt: "Describe a time you disagreed with a teammate about how to proceed.",
      competency: "Collaboration",
      followUp: "How did you resolve the disagreement and what happened next?",
    },
  ],
  technical: [
    {
      prompt: "Walk me through how you would investigate a slow user-facing page.",
      competency: "Performance and debugging",
      followUp: "What would you measure first, and how would you validate a change?",
    },
    {
      prompt: "Describe a technical decision you made and the trade-offs you considered.",
      competency: "Technical reasoning",
      followUp: "What limitation did your choice introduce, and why was it acceptable?",
    },
  ],
  managerial: [
    {
      prompt: "How would you help a team deliver when priorities change mid-project?",
      competency: "Planning and leadership",
      followUp: "How would you communicate the impact to stakeholders?",
    },
    {
      prompt: "Tell me how you have supported someone who was blocked.",
      competency: "Coaching and ownership",
      followUp: "How did you balance helping them with keeping the work moving?",
    },
  ],
  "customer-facing": [
    {
      prompt: "A customer reports an issue that you cannot reproduce. How do you respond?",
      competency: "Customer communication",
      followUp: "What information would you gather before proposing a solution?",
    },
    {
      prompt: "Tell me about a time you had to explain a complex issue simply.",
      competency: "Clarity and empathy",
      followUp: "How did you check that the other person understood?",
    },
  ],
};

export function createInterviewSession(input: {
  targetRole: string;
  interviewType: string;
  difficulty: string;
  questionCount: number;
  resumeText: string;
  jobDescription: string;
}): InterviewSession {
  const bank = questionBank[input.interviewType] ?? questionBank.behavioral;
  const jobText = input.jobDescription.toLowerCase();
  const roleSkills = skillCatalog.filter((skill) =>
    jobText.includes(skill.toLowerCase()),
  );
  const resumeLines = input.resumeText
    .split(/[.!?\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const questions = Array.from({ length: input.questionCount }, (_, index) => {
    const item = bank[index % bank.length];
    const skill = roleSkills[index % Math.max(roleSkills.length, 1)];
    const resumeEvidence = skill
      ? resumeLines.find((sentence) =>
          sentence.toLowerCase().includes(skill.toLowerCase()),
        )
      : undefined;
    return {
      id: `question-${index + 1}`,
      prompt: skill && resumeEvidence
        ? `Tell me how you used ${skill} in your work as a ${input.targetRole}.`
        : skill
          ? `${item.prompt} In particular, how would you apply ${skill} as a ${input.targetRole}?`
          : item.prompt,
      competency: skill ?? item.competency,
      followUp: resumeEvidence
        ? `Your resume mentions ${skill}. What did you personally contribute, and how did you check the result?`
        : item.followUp,
    };
  });

  return {
    demoMode: true,
    id: `session-${randomUUID()}`,
    targetRole: input.targetRole,
    interviewType: input.interviewType,
    difficulty: input.difficulty,
    questions,
    currentIndex: 0,
  };
}

export function evaluateAnswer(input: {
  question: string;
  answer: string;
  interviewType: string;
  targetRole: string;
  resumeText?: string;
}): AnswerEvaluation {
  const answer = input.answer.trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const hasExample =
    /\b(for example|for instance|when i|in my|during|project|customer|team)\b/i.test(
      answer,
    );
  const hasAction =
    /\b(i|we)\s+(built|created|developed|designed|implemented|led|managed|optimized|delivered|tested|improved|launched|maintained|supported|resolved|measured|decided)\b/i.test(
      answer,
    );
  const hasEvidence = /\b\d+(?:\.\d+)?%?\b/.test(answer) || hasExample;
  const unverifiedNumbers = [...new Set(answer.match(/\b\d+(?:\.\d+)?%?\b/g) ?? [])]
    .filter((number) => !input.resumeText?.includes(number));
  const isTechnical = input.interviewType === "technical";
  const rubric = [
    {
      label: "Relevance",
      score: Math.min(25, 12 + (wordCount >= 25 ? 7 : 0) + (hasExample ? 6 : 0)),
      max: 25,
      explanation: hasExample
        ? "Your answer includes a concrete context related to the prompt."
        : "Add a specific example that directly addresses the prompt.",
    },
    {
      label: "Specificity and evidence",
      score: Math.min(25, 8 + (hasAction ? 9 : 0) + (hasEvidence ? 8 : 0)),
      max: 25,
      explanation:
        "This demo checks for a personal action and a concrete detail or example; it cannot verify your claims.",
    },
    {
      label: "Structure and clarity",
      score: Math.min(
        20,
        9 +
          (wordCount >= 35 ? 5 : 0) +
          (hasAction ? 3 : 0) +
          (/[.!?]/.test(answer) ? 3 : 0),
      ),
      max: 20,
      explanation:
        input.interviewType === "behavioral"
          ? "A clear Situation, Task, Action, Result structure helps listeners follow your example."
          : "Short, complete sentences and a clear sequence make your reasoning easier to follow.",
    },
    {
      label: isTechnical ? "Technical reasoning" : "Role-specific accuracy",
      score: Math.min(
        20,
        10 + (wordCount >= 30 ? 5 : 0) + (hasAction ? 5 : 0),
      ),
      max: 20,
      explanation:
        "The demo uses answer detail and described actions as a proxy. It does not validate technical correctness.",
    },
    {
      label: "Conciseness",
      score:
        wordCount >= 35 && wordCount <= 150
          ? 10
          : wordCount >= 20 && wordCount <= 200
            ? 7
            : 4,
      max: 10,
      explanation:
        wordCount >= 35 && wordCount <= 150
          ? "The answer is in a focused practice length."
          : "Aim for a focused answer that gives enough context without losing the main point.",
    },
  ];
  const resumeEvidence = input.resumeText
    ?.split(/[.!?\n]+/)
    .map((sentence) => sentence.trim())
    .find((sentence) => sentence.length > 20);
  const sampleAnswer = resumeEvidence
    ? `A detail already present in your resume: “${resumeEvidence}.” Build your answer around this verified detail, then add the real situation, your specific actions, and an outcome you can substantiate.`
    : "Use only a real example: “In [situation], I was responsible for [task]. I [specific actions]. The outcome was [result I can verify].” Replace each bracket with your own facts; do not invent metrics or experience.";
  const score = rubric.reduce((sum, item) => sum + item.score, 0);

  const followUp = /improv|increas|reduc|faster|performance/i.test(answer)
    ? "You mentioned a change in performance or outcomes. How did you measure it, and what did you personally contribute?"
    : hasAction
      ? "What did you personally contribute, and what evidence can you use to explain the result?"
      : "What specific example could you use, and what did you personally do?";

  return {
    demoMode: true,
    overallScore: score,
    rubric,
    strengths: [
      ...(hasExample ? ["You included a concrete example or context."] : []),
      ...(hasAction ? ["You described a personal action."] : []),
      ...(wordCount >= 35
        ? ["You provided enough detail for a useful practice review."]
        : []),
    ],
    missingDetails: [
      ...(!hasAction ? ["Name the specific actions you personally took."] : []),
      ...(!hasEvidence
        ? ["Add a real example or a verifiable outcome where available."]
        : []),
      ...(input.interviewType === "behavioral"
        ? ["Make the situation, responsibility, action, and result easy to identify."]
        : []),
    ],
    unsupportedClaims: unverifiedNumbers.map(
      (number) =>
        `Confirm the number “${number}” against a source you can explain. The demo cannot verify it.`,
    ),
    suggestion: `This is a deterministic demo rubric based on answer structure and detail, not an objective assessment. Review the feedback and keep only details that are true for your experience. Follow-up question: ${followUp}`,
    sampleAnswer,
    followUp,
    starGuidance:
      input.interviewType === "behavioral"
        ? [
            "Situation: set the real context.",
            "Task: explain your responsibility.",
            "Action: describe what you personally did.",
            "Result: share only an outcome you can verify.",
          ]
        : [],
  };
}

export function getRoadmap(): { demoMode: true; tasks: LearningTask[] } {
  return { demoMode: true, tasks: roadmapTasks };
}

export function getTask(taskId: string, completed: boolean): LearningTask | undefined {
  const task = roadmapTasks.find((item) => item.id === taskId);
  return task ? { ...task, completed } : undefined;
}

export function getPassport(): Passport {
  return {
    demoMode: true,
    candidateName: "Alex Morgan",
    targetRole: "Frontend Engineer",
    readinessScore: 78,
    scoreDisclaimer:
      "Practice performance only. This score does not predict whether you will receive a job offer.",
    demonstratedSkills: ["React", "Communication", "Project ownership"],
    sessionsCompleted: 3,
    competencyScores: [
      {
        label: "Communication",
        score: 18,
        max: 20,
        explanation: "Demo sample competency score.",
      },
      {
        label: "Evidence and specificity",
        score: 17,
        max: 25,
        explanation: "Demo sample competency score.",
      },
      {
        label: "Technical reasoning",
        score: 15,
        max: 20,
        explanation: "Demo sample competency score.",
      },
    ],
    improvement: 12,
    priorities: ["Measurable outcomes", "Technical trade-offs", "STAR structure"],
    completedTasks: 2,
  };
}

