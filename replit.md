# InterviewIQ

InterviewIQ helps candidates compare resume evidence with a target role, practice interview answers, and plan focused preparation.

## Run & operate

- `pnpm --filter @workspace/interviewiq run dev` — run the web app
- `pnpm --filter @workspace/api-server run dev` — run the demo API
- `pnpm run typecheck` — typecheck workspace libraries and artifact packages
- `PORT=26250 BASE_PATH=/ pnpm --filter @workspace/interviewiq run build` — build the root-mounted web artifact
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas after changing the OpenAPI contract

The InterviewIQ web app and API are managed by the existing Replit workflows.

## Stack

- pnpm workspaces, Node.js, TypeScript
- Web: React, Vite, Tailwind CSS
- API: Express
- API contracts and generated client: OpenAPI, Orval, Zod
- Resume import: browser-side PDF.js and Mammoth extraction

## Where things live

- `artifacts/interviewiq/` — InterviewIQ web app and browser-local product state
- `artifacts/api-server/src/routes/interviewiq.ts` — demo coaching API routes
- `artifacts/api-server/src/lib/interviewiq-demo.ts` — deterministic demo matching, interview questions, answer rubric, and roadmap
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/api-client-react/` and `lib/api-zod/` — generated hooks and validation schemas

## Architecture decisions

- InterviewIQ is an explicitly labeled demo. Matching and answer feedback are deterministic rules, not live AI or verified hiring assessments.
- Profile, resume text, practice history, and task progress are kept in browser local storage. Analysis and interview requests send the relevant resume or answer text to a stateless demo endpoint; the API does not save it.
- Sign-in and account screens are previews only. The app does not create authenticated accounts or provide cross-device persistence.
- Resume files are extracted in the browser. Voice controls use browser speech features when available, with text entry as the fallback.

## Product

- Candidate profile, resume editor and PDF/DOCX/text import
- Resume-to-job evidence comparison and interview-topic suggestions
- Adaptive demo interview practice, spoken question and answer controls, rubric feedback, and follow-up prompts
- Local practice history, targeted review tasks, a seven-day roadmap, and a print-friendly readiness passport
- Privacy settings that explain local storage and clear the saved demo data

## User preferences

No project-specific preferences have been recorded.

## Gotchas

- Do not present simulated scores or sample content as live AI output, verified skills, or predictions of hiring outcomes.
- Keep the demo and storage disclosures visible when adding flows that submit resume or answer text.
- Regenerate the OpenAPI client and schemas after contract changes; do not hand-edit generated files.

## Pointers

- See the `pnpm-workspace` skill for workspace structure and TypeScript setup.
