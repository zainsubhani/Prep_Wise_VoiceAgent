"use client";

import { Mic, Brain, BarChart3, Rocket } from "lucide-react";

const steps = [
  {
    icon: <Mic className="h-6 w-6 text-cyan-400" />,
    title: "Choose Your Interview",
    description:
      "Select your role, interview type, difficulty, and duration tailored to your goals.",
  },
  {
    icon: <Rocket className="h-6 w-6 text-cyan-400" />,
    title: "Start AI Interview",
    description:
      "Engage in a real-time voice interview powered by AI that simulates real recruiter conversations.",
  },
  {
    icon: <Brain className="h-6 w-6 text-cyan-400" />,
    title: "Get Instant Feedback",
    description:
      "Receive structured feedback with scores, strengths, and improvement areas.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-cyan-400" />,
    title: "Track Your Progress",
    description:
      "Monitor your performance over time and improve with every interview session.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#030711] flex justify-center items-center text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            How It Works
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Prepare smarter with AI-powered interviews
          </h1>
          <p className="mt-4 text-white/60">
            Practice real interview scenarios, get instant feedback, and track your growth.
          </p>
        </div>

        {/* Steps */}
<div className="mt-16 mb-16 grid gap-10 md:grid-cols-2">
              {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              {/* Step number */}
              <div className="absolute -top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-black font-bold">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="mb-4">{step.icon}</div>

              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-white/60">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-125 text-center">
          <h2 className="text-2xl font-semibold">
            Ready to improve your interview skills?
          </h2>
          <p className="mt-3 text-white/60">
            Start practicing with AI and get real-time feedback.
          </p>

          <a
            href="/sign-up"
            className="mt-6 inline-block rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}