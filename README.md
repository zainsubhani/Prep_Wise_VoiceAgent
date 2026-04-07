# 🧠 PrepWise — AI Mock Interview Platform

PrepWise is an AI-powered interview preparation platform that simulates real-world technical and behavioral interviews using voice-based interaction, and provides structured feedback and performance insights.

---

## 🚀 Features Implemented So Far

### 🎤 1. Live AI Interview (Voice-Based)

* Integrated real-time voice interviews using Vapi

* Users can start an interview directly from the UI

* AI interviewer dynamically adapts based on:

  * Role (Frontend, Backend, Intern)
  * Interview Type (Technical, Behavioral, Mixed)
  * Difficulty (Easy, Medium, Hard)
  * Duration (15–120 minutes)

* Supports:

  * Live conversation with AI
  * Real-time transcript streaming
  * Microphone control (mute/unmute)
  * Voice activity detection
  * Auto end when timer expires

---

### ⏱️ 2. Interview Configuration System

Users can customize their interview before starting:

* Select role
* Select interview type
* Select difficulty level
* Select duration (15 / 30 / 45 / 60 / 90 / 120 minutes)

These parameters are passed to the AI interviewer using dynamic variables, ensuring contextual and realistic question generation.

---

### 🧠 3. Intelligent AI Interviewer

The AI interviewer is designed using structured prompts and dynamic variables:

* Uses `{{role}}`, `{{interviewType}}`, `{{difficulty}}`, `{{duration}}`
* Asks role-specific and difficulty-adjusted questions
* Handles:

  * Follow-up questions
  * Natural conversation flow
  * Professional interview tone

---

### 📝 4. Real-Time Transcript Capture

* Captures conversation between candidate and AI
* Distinguishes between:

  * Interviewer responses
  * Candidate answers
* Displays transcript live during interview

---

### 🤖 5. AI Feedback & Evaluation (Google Gemini)

After interview completion:

* Full transcript is sent to Gemini AI
* Gemini generates structured evaluation:

Includes:

* Overall score (0–100)
* Communication score
* Technical depth
* Confidence
* Problem solving
* Clarity

Also provides:

* Strengths
* Areas for improvement
* Summary
* Actionable next steps

---

### 🗄️ 6. Firestore Integration (Backend)

* Interview results are stored securely in Firestore
* Each interview record includes:

  * User ID
  * Role / Type / Difficulty
  * Duration
  * Transcript
  * AI evaluation
  * Timestamp

---

### 📊 7. Feedback Page

Each completed interview generates a detailed report:

* Score breakdown
* Strengths and weaknesses
* AI-generated summary
* Personalized improvement plan

Accessible via:

```
/feedback/[interviewId]
```

---

### 🎯 8. Insights-Oriented Architecture

The platform is structured around:

* **Feedback (per interview)** → detailed evaluation
* **Insights (coming next)** → aggregated performance trends

This separation enables scalable analytics and coaching features.

---

## 🏗️ Architecture Overview

```
User → Take Interview Page
     → Vapi Voice Agent (Live Interview)
     → Transcript Captured
     → API Route (/api/interview/analyze)
     → Gemini AI Evaluation
     → Firestore ذخیره
     → Feedback Page
```

---

## ⚙️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Firebase Firestore (Database)
* Firebase Auth (User Management)

### AI / Voice

* Vapi (Voice AI Interviewer)
* Google Gemini (LLM Evaluation Engine)

---

## 🧩 Key Technical Highlights

* Real-time WebRTC voice integration
* Structured JSON output from LLM (Gemini)
* Type-safe event handling (no `any`)
* Dynamic prompt injection using variables
* Robust error handling (network, mic, API)
* Auto interview lifecycle management (start → run → end → analyze)

---

## 🔥 What Makes This Project Strong

* End-to-end AI system (Voice + LLM + Data)
* Real-world product thinking (not just UI)
* Clear separation of concerns:

  * Interview (Vapi)
  * Evaluation (Gemini)
  * Storage (Firestore)
* Scalable architecture for future features

---

## 🚧 Upcoming Features

* 📈 Insights Dashboard (performance trends)
* 📊 Skill-level analytics over time
* 🧠 AI-generated learning roadmap
* 📅 Interview history & filtering
* 🎯 Role-specific interview tracks (FAANG mode)
* 📄 Exportable feedback reports

---

## 🧠 Core Concept

> Feedback tells you what you did.
> Insights tell you what to improve.

PrepWise is designed to bridge that gap.

---

## 🛠️ Setup

```bash
git clone <repo>
cd prepwise
npm install
npm run dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=...
NEXT_PUBLIC_VAPI_ASSISTANT_ID=...

GEMINI_API_KEY=...

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

---

## 👨‍💻 Author

Zain Subhani
MSc Software Engineering @ EPITA
AI + Full Stack Engineer
