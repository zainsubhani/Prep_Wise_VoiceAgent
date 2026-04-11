# 🚀 PrepWise — AI Voice Interview Platform

> Real-time AI-powered interview simulation platform with voice interaction, automated evaluation, and structured feedback.

---

## 📌 Overview

PrepWise is a full-stack AI platform that simulates real-world technical and behavioral interviews through a **live voice-based AI interviewer**.

Unlike traditional interview prep tools, PrepWise provides a **dynamic, conversational, and realistic interview experience** by combining real-time voice interaction, LLM-based evaluation, and structured analytics.

---

## 🎯 Key Features

### 🎤 Live AI Voice Interviews
- Real-time voice-based interview experience
- Dynamic question generation based on:
  - Role (Frontend, Backend, etc.)
  - Interview type (Technical / Behavioral / Mixed)
  - Difficulty level
- AI-driven follow-up questions

---

### 🧠 AI-Powered Feedback Engine
- Full transcript analysis using LLMs (DeepSeek via OpenRouter)
- Structured evaluation across:
  - Communication
  - Technical depth
  - Problem solving
  - Confidence
  - Clarity
- Generates:
  - Strengths
  - Areas for improvement
  - Actionable next steps

---

### 📊 Analytics & Insights
- Interview history tracking
- Performance trends over time
- Skill-level breakdown (Recharts visualizations)

---

### 🔐 Authentication System
- Email/password authentication
- OAuth providers:
  - Google
  - GitHub
  - LinkedIn (OIDC)
- Protected routes and session management

---

### ⚙️ Real-Time Interview Controls
- Configurable interview duration (15–120 minutes)
- Live transcript streaming
- Mute / End interview controls
- Voice activity monitoring

---

## 🏗️ System Architecture



---

## 🔄 Workflow

1. User selects:
   - Role
   - Interview type
   - Difficulty
   - Duration

2. Voice interview session starts via Vapi

3. Real-time transcript is streamed and displayed

4. On interview completion:
   - Transcript is sent to backend
   - LLM analyzes responses

5. Structured feedback is generated and stored

6. User is redirected to feedback dashboard

---

## 🧱 Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- Recharts

### Backend
- Next.js Route Handlers (Serverless)
- Event-driven architecture

### AI / Voice
- Vapi (real-time voice AI)
- DeepSeek (via OpenRouter)

### Database & Auth
- Firebase (Firestore + Admin SDK)
- Firebase Authentication

### Forms & Validation
- React Hook Form
- Zod

### UI/UX Enhancements
- Sonner (notifications)
- Responsive design
- Dark UI theme

---
## 🏗️ System Architecture

Frontend (Next.js App Router)
↓
Voice Layer (Vapi)
↓
Real-time Transcript Streaming
↓
Backend API (Next.js Route Handlers)
↓
LLM Analysis (OpenRouter / DeepSeek)
↓
Firestore (Firebase Admin SDK)
↓
Feedback & Analytics UI


---

## 🔄 Workflow

1. User selects:
   - Role
   - Interview type
   - Difficulty
   - Duration

2. Voice interview session starts via Vapi

3. Real-time transcript is streamed and displayed

4. On interview completion:
   - Transcript is sent to backend
   - LLM analyzes responses

5. Structured feedback is generated and stored

6. User is redirected to feedback dashboard

---

## 🧱 Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- Recharts

### Backend
- Next.js Route Handlers (Serverless)
- Event-driven architecture

### AI / Voice
- Vapi (real-time voice AI)
- DeepSeek (via OpenRouter)

### Database & Auth
- Firebase (Firestore + Admin SDK)
- Firebase Authentication

### Forms & Validation
- React Hook Form
- Zod

### UI/UX Enhancements
- Sonner (notifications)
- Responsive design
- Dark UI theme

---

## 📁 Project Structure
/app
/takeinterview # Live interview UI
/feedback/[id] # Feedback page
/dashboard # Analytics dashboard
/api
/interview/analyze # LLM analysis pipeline
/stripe # Payment integration (WIP)

/lib
firebase-admin.ts # Firestore admin setup
gemini.ts / ai.ts # LLM integration & parsing

/types
takeinterview.types.ts

/components
UI components

/constants
Role options & configs


Here’s a slightly more polished version with grouped layers:

```md

## 🏗️ System Architecture

```mermaid
flowchart LR
    subgraph Client["Client Layer"]
        U[User]
        FE[Next.js App Router UI]
        AUTH[Firebase Auth]
    end

    subgraph Voice["Real-Time Voice Layer"]
        VAPI[Vapi Web SDK]
        AGENT[Vapi Voice Agent]
        TRANSCRIPT[Transcript Stream]
    end

    subgraph Backend["Backend Layer"]
        API[/Next.js Route Handlers/]
        ADMIN[Firebase Admin SDK]
    end

    subgraph AI["AI Analysis Layer"]
        OR[OpenRouter]
        DS[DeepSeek]
    end

    subgraph Data["Data Layer"]
        FS[(Cloud Firestore)]
    end

    subgraph Output["Product Surfaces"]
        FB[Feedback Page]
        INS[Insights Dashboard]
    end

    U --> FE
    FE --> AUTH
    FE --> VAPI
    VAPI --> AGENT
    AGENT --> TRANSCRIPT
    TRANSCRIPT --> FE

    FE --> API
    API --> OR
    OR --> DS

    API --> ADMIN
    ADMIN --> FS

    FS --> FB
    FS --> INS
    FE --> FB
    FE --> INS


---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
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

git clone https://github.com/zainsubhani/Prep_Wise_VoiceAgent
cd Prep_Wise_VoiceAgent

npm install
npm run dev