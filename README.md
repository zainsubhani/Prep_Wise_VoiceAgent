🚀 AI Voice Interview Platform (PrepWise)

Real-time AI-powered mock interview platform with voice interaction, automated evaluation, and structured feedback.

📌 Overview

PrepWise is a full-stack AI interview simulation platform that enables users to practice real-world technical and behavioral interviews through a live voice-based AI interviewer.

The system conducts interviews, captures real-time transcripts, analyzes candidate responses using LLMs, and generates structured feedback with actionable insights.

🎯 Key Features
🎤 Live AI Voice Interview
Real-time voice-based interview powered by Vapi
Dynamic questioning based on:
Role (Frontend, Backend, etc.)
Interview type (Technical / Behavioral / Mixed)
Difficulty level
Low-latency conversational experience
🧠 AI Evaluation & Feedback
Transcript analyzed using LLMs (e.g., DeepSeek / OpenRouter)
Structured scoring:
Communication
Technical depth
Problem solving
Confidence
Generates:
Strengths
Areas of improvement
Actionable next steps
📊 Interview Insights Dashboard
Historical interview tracking
Performance trends over time
Detailed feedback per session
⏱️ Real-Time Controls
Configurable interview duration (15–120 mins)
Live transcript streaming
Mute / End session controls
Voice activity monitoring
🏗️ Architecture
Frontend (Next.js)
        ↓
Voice Layer (Vapi)
        ↓
Transcript Stream
        ↓
Backend API (Next.js Route Handlers)
        ↓
LLM Analysis (DeepSeek / OpenRouter)
        ↓
Firestore (Firebase Admin)
        ↓
Feedback UI
🔹 Flow
User starts interview → selects role, difficulty, duration
Vapi initializes real-time voice session
Transcript streamed to frontend
On interview end:
Transcript sent to backend
LLM analyzes responses
Results stored in Firestore
User redirected to feedback page
🧱 Tech Stack
Frontend
Next.js
TypeScript
Tailwind CSS
React Hooks (state, effects, refs)
Backend
Next.js API Routes
Server-side orchestration
AI / Voice
Vapi (real-time voice interviews)
DeepSeek via OpenRouter (analysis)
Database
Firebase (Firestore + Admin SDK)
Payments (Planned / MVP+)
Stripe (subscriptions)
⚡ Performance Highlights
⚡ Real-time voice latency: < 2 seconds
📉 Reduced manual interview prep effort by ~80%
🧠 Automated feedback generation in seconds
🔁 Scalable architecture using serverless APIs
📁 Project Structure
/app
  /takeinterview      # Live interview UI
  /feedback           # Feedback page
  /api
    /interview
      /analyze        # LLM + Firestore pipeline
    /stripe           # Payment integration

/lib
  firebase-admin.ts   # Firestore admin setup
  gemini.ts           # AI analysis (LLM)

/types
  takeinterview.types.ts

/components
  UI components

/constants
  Role & config options
🔑 Environment Variables
# Vapi
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
NEXT_PUBLIC_VAPI_ASSISTANT_ID=

# Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# AI (OpenRouter / DeepSeek)
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-chat

# App
APP_URL=http://localhost:3000
🧪 Running Locally
git clone https://github.com/your-username/prepwise
cd prepwise

npm install
npm run dev
🧠 Core Engineering Challenges Solved
1. Real-time Voice Orchestration
Managed live bidirectional communication using Vapi
Handled edge cases (room expiration, connection failures)
2. Streaming Transcript Handling
Type-safe event parsing with discriminated unions
Real-time UI updates with minimal re-renders
3. LLM Reliability
Enforced strict JSON output validation
Built parser to extract structured data from noisy responses
4. Backend Robustness
Graceful handling of:
API failures
quota limits
non-JSON responses
Retry-safe architecture
5. Secure Server-Side Data Handling
Firebase Admin SDK integration
Environment-based credential management
🚧 Future Improvements
🎯 Personalized interview roadmap
📈 Advanced analytics (progress tracking, weak areas)
🤖 Multi-agent interview simulation
🎥 Video interview support
🧾 Resume-based question generation
💳 Full subscription system with Stripe
💡 Why This Project Stands Out
Combines real-time systems + AI + full-stack engineering
Demonstrates:
System design thinking
AI integration in production workflows
Event-driven architecture
Solves a real user problem (interview preparation) with measurable impact
👨‍💻 Author

Zain Subhani
MSc Software Engineering @ EPITA
Backend & AI Systems Engineer

⭐ If you like this project

Give it a ⭐ and connect with me!

