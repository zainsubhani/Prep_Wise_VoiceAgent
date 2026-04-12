# PrepWise / Interview Prep Platform

AI-powered interview practice platform built with Next.js, Firebase, Vapi, and OpenRouter. Users can sign in, run live voice interview sessions, save transcripts, receive structured AI feedback, and review performance trends across completed interviews.

## Demo Video

Watch the project walkthrough here: [PrepWise demo video](https://www.youtube.com/watch?v=070_-ody-NI).

## What It Does

- Runs live voice-based mock interviews through Vapi.
- Lets candidates configure role, interview type, difficulty, and duration.
- Streams and stores the interview transcript from the live session.
- Sends completed transcripts to an AI evaluator through OpenRouter.
- Stores feedback reports in Firestore.
- Shows private interview history, detailed feedback, and analytics dashboards.
- Supports Firebase email/password auth plus Google, GitHub, and LinkedIn OIDC sign-in.

## Tech Stack

- Next.js 16.2.1 App Router
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- Firebase Authentication
- Cloud Firestore with Firebase Admin SDK
- Vapi Web SDK for live voice interviews
- OpenRouter chat completions, defaulting to `deepseek/deepseek-chat`
- Recharts for feedback and analytics visualizations
- React Hook Form and Zod for auth form validation
- Radix UI, shadcn-style UI components, Lucide icons, Sonner toasts

## App Routes

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/features` | Feature overview page |
| `/howitworks` | Product flow page |
| `/sign-in` | Firebase sign-in page |
| `/sign-up` | Firebase account creation page |
| `/dashboard` | Auth-aware interview dashboard and recent history |
| `/takeinterview` | Main interview configuration and Vapi session controller |
| `/takeinterview/live` | Pop-up live interview window synchronized through `BroadcastChannel` and local storage |
| `/feedback` | Feedback dashboard with charts, trends, and recent reports |
| `/feedback/[id]` | Detailed feedback report for a saved interview |
| `/insights` | Insights page |
| `/interviews` | Interviews page |

## API Routes

### `GET /api/interviews`

Fetches the signed-in user's saved interview reports.

- Requires an `Authorization: Bearer <firebase-id-token>` header.
- Verifies the token with Firebase Admin Auth.
- Queries the `interviews` Firestore collection by `userId`.
- Sorts newest first.
- Falls back to client-side sorting if the Firestore composite index for `userId + createdAt` is missing.

Response shape:

```json
{
  "interviews": []
}
```

### `POST /api/interview/analyze`

Analyzes a completed interview transcript and saves the report.

Required request fields:

```json
{
  "userId": "firebase-user-id",
  "role": "Frontend Developer",
  "company": "",
  "interviewType": "Technical",
  "difficulty": "Medium",
  "duration": 30,
  "transcript": "Interviewer: ...\nCandidate: ..."
}
```

The route calls OpenRouter, validates that the model returns the expected JSON analysis, saves the report to Firestore, and returns the created interview id.

Response shape:

```json
{
  "success": true,
  "interviewId": "firestore-doc-id",
  "analysis": {
    "overallScore": 85,
    "communication": 80,
    "technicalDepth": 88,
    "confidence": 78,
    "problemSolving": 90,
    "clarity": 84,
    "strengths": [],
    "improvements": [],
    "summary": "",
    "nextSteps": []
  }
}
```

## Data Model

Interview reports are stored in the `interviews` Firestore collection.

```ts
type InterviewRecord = {
  id: string;
  userId: string;
  role: string;
  company?: string;
  interviewType: string;
  difficulty: string;
  duration: number;
  transcript?: string;
  overallScore: number;
  communication: number;
  technicalDepth: number;
  confidence: number;
  problemSolving: number;
  clarity: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  nextSteps: string[];
  createdAt: string;
};
```

## System Flow

```mermaid
flowchart TD
  User[User] --> UI[Next.js App Router UI]
  UI --> Auth[Firebase Auth]
  UI --> Vapi[Vapi Web SDK]
  Vapi --> VoiceAgent[Vapi Assistant]
  VoiceAgent --> Transcript[Transcript Events]
  Transcript --> UI
  UI --> Analyze[POST /api/interview/analyze]
  Analyze --> OpenRouter[OpenRouter Chat Completions]
  OpenRouter --> Model[DeepSeek or configured model]
  Analyze --> Firestore[(Cloud Firestore)]
  UI --> Interviews[GET /api/interviews]
  Interviews --> Firestore
  Firestore --> Feedback[Feedback and Dashboard UI]
```

1. The user signs in with Firebase Auth.
2. The user configures a role, interview type, difficulty, and duration at `/takeinterview`.
3. The page opens `/takeinterview/live` as a companion pop-up window.
4. Vapi starts the configured assistant and receives transcript messages.
5. The local controller keeps the main page and live pop-up synchronized.
6. When the call ends, the transcript is sent to `/api/interview/analyze`.
7. OpenRouter returns structured scoring and feedback.
8. The server saves the feedback report in Firestore.
9. The user is redirected to `/feedback/[id]`.
10. Dashboards load saved interviews through `/api/interviews`.

## Getting Started

### Prerequisites

- Node.js compatible with Next.js 16
- npm
- Firebase project with Authentication and Firestore enabled
- Firebase service account credentials for server-side Admin SDK access
- Vapi public key and assistant id
- OpenRouter API key

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root.

```env
# Firebase client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Vapi
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
NEXT_PUBLIC_VAPI_ASSISTANT_ID=

# AI analysis through OpenRouter
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-chat
```

Notes:

- `FIREBASE_PRIVATE_KEY` should preserve newlines. If your hosting provider stores it as a single line, use escaped newlines like `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`.
- `NEXT_PUBLIC_VAPI_ASSISTANT_ID` should point to an assistant configured to accept the variables `role`, `interviewType`, `difficulty`, and `duration`.
- `OPENROUTER_MODEL` is optional. The app falls back to `deepseek/deepseek-chat`.

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Firebase Setup

1. Create or select a Firebase project.
2. Enable Authentication.
3. Enable Email/Password provider.
4. Enable Google and GitHub providers if you want social auth.
5. Configure a generic OIDC provider with the id `oidc.linkedin` if you want LinkedIn sign-in.
6. Enable Cloud Firestore.
7. Create a Firebase service account and copy `client_email` and `private_key` into `.env.local`.
8. Add your local and deployed domains to Firebase Auth authorized domains.

The interview history query uses:

- Collection: `interviews`
- Filter: `userId == <uid>`
- Sort: `createdAt desc`

Firestore may ask for a composite index for that query. The route has a fallback, but creating the suggested index is better for production.

## Vapi Setup

1. Create a Vapi assistant.
2. Copy the public key into `NEXT_PUBLIC_VAPI_PUBLIC_KEY`.
3. Copy the assistant id into `NEXT_PUBLIC_VAPI_ASSISTANT_ID`.
4. Configure the assistant prompt to use these runtime variables:
   - `{{role}}`
   - `{{interviewType}}`
   - `{{difficulty}}`
   - `{{duration}}`
5. Make sure the browser has microphone permission when starting an interview.
6. Allow pop-ups for the local site so the live interview window can open.

## OpenRouter Setup

1. Create an OpenRouter API key.
2. Add it to `OPENROUTER_API_KEY`.
3. Optionally override `OPENROUTER_MODEL`.

The evaluator prompt expects the model to return only valid JSON with these fields:

- `overallScore`
- `communication`
- `technicalDepth`
- `confidence`
- `problemSolving`
- `clarity`
- `strengths`
- `improvements`
- `summary`
- `nextSteps`

Scores must be integers from 0 to 100.

## Project Structure

```text
app/
  (auth)/                  Sign-in and sign-up routes
  (root)/                  Root layout and dashboard route group
  api/
    interview/analyze/     Transcript analysis and Firestore save route
    interviews/            Authenticated interview history route
  feedback/                Feedback dashboard and detail pages
  takeinterview/           Interview setup and live session UI
components/
  auth/                    Auth context and route guards
  dashboard/               Dashboard cards and sections
  sections/                Marketing and product sections
  ui/                      Shared UI primitives
constants/                 Static content and option lists
hooks/                     Client hooks such as useUserInterviews
lib/                       Firebase, auth, AI, and analytics helpers
public/                    Static images and SVG assets
schema/                    Zod schemas
types/                     Shared TypeScript types
```

## Important Files

- `app/takeinterview/page.tsx`: Vapi session setup, transcript capture, timer, mute controls, analysis handoff, and live pop-up synchronization.
- `app/takeinterview/live/page.tsx`: Live interview companion window.
- `app/api/interview/analyze/route.ts`: Server route that analyzes transcripts and saves interview reports.
- `app/api/interviews/route.ts`: Server route that fetches the authenticated user's interview reports.
- `hooks/use-user-interviews.ts`: Client hook that gets the Firebase ID token and loads interview history.
- `lib/gemini.ts`: OpenRouter integration and JSON analysis validation.
- `lib/firebase.ts`: Firebase client SDK setup.
- `lib/firebase-admin.ts`: Firebase Admin SDK setup.
- `lib/server-auth.ts`: Firebase ID token verification helper.
- `lib/interview-analytics.ts`: Dashboard aggregation helpers.
- `components/AuthForm.tsx`: Email/password and social auth form.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Troubleshooting

- `Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `Missing FIREBASE_CLIENT_EMAIL`, or `Missing FIREBASE_PRIVATE_KEY`: check `.env.local` and restart the dev server.
- `Missing Vapi assistant id`: set `NEXT_PUBLIC_VAPI_ASSISTANT_ID`.
- `Vapi client is not initialized`: set `NEXT_PUBLIC_VAPI_PUBLIC_KEY` and restart the dev server.
- `Microphone access is required`: allow microphone access in the browser.
- `Please allow popups`: allow pop-ups for `localhost` or your deployed domain.
- `Missing OPENROUTER_API_KEY`: add the key before using interview analysis.
- Firestore index warning: create the composite index suggested by Firebase for `interviews` filtered by `userId` and ordered by `createdAt desc`.
- LinkedIn sign-in fails: verify that Firebase has an OIDC provider configured with provider id `oidc.linkedin`.

## Development Notes

- This project uses Next.js 16. The local agent instructions say to read the relevant guide in `node_modules/next/dist/docs/` before changing Next.js-specific code.
- Keep client-only Firebase usage in client components and server-side Admin SDK usage in route handlers or server utilities.
- Do not expose server secrets with `NEXT_PUBLIC_`; only browser-safe config should use that prefix.
- The live interview page depends on browser APIs including microphone access, `window.open`, `BroadcastChannel`, and `localStorage`.
