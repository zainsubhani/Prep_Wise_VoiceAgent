"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const progressData = [
  { name: "Mock 1", score: 58 },
  { name: "Mock 2", score: 64 },
  { name: "Mock 3", score: 71 },
  { name: "Mock 4", score: 76 },
  { name: "Mock 5", score: 84 },
];

const stats = [
  {
    title: "Current Score",
    value: "78%",
    change: "+12%",
  },
  {
    title: "Consistency",
    value: "Good",
    change: "Stable growth",
  },
  {
    title: "Weakest Skill",
    value: "Confidence",
    change: "Needs focus",
  },
  {
    title: "Best Area",
    value: "Behavioral",
    change: "Strong",
  },
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            AI Insights
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Performance Intelligence
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Understand your strengths, identify gaps, and improve strategically.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-white/60">{item.title}</p>
              <h2 className="mt-3 text-3xl font-semibold text-cyan-400">
                {item.value}
              </h2>
              <p className="mt-2 text-sm text-white/50">{item.change}</p>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-6">
          <h2 className="text-lg font-semibold text-cyan-300">AI Insight</h2>
          <p className="mt-3 text-sm text-white/80 leading-relaxed">
            Your performance shows consistent improvement, especially in behavioral interviews.
            However, technical explanations lack depth and structure. Focus on explaining trade-offs,
            system design clarity, and edge cases to reach the next level.
          </p>
        </div>

        {/* Chart + Goal */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          
          {/* Score Trend */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 xl:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Score Trend</h2>

            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22d3ee"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goal Tracking */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold mb-4">Goal</h2>

            <p className="text-sm text-white/60">Target Score</p>
            <h3 className="text-2xl font-bold text-cyan-400 mt-2">85%</h3>

            <div className="mt-4">
              <div className="h-2 w-full bg-white/10 rounded-full">
                <div className="h-2 bg-cyan-400 rounded-full w-[78%]" />
              </div>
              <p className="text-xs text-white/50 mt-2">Current: 78%</p>
            </div>
          </div>
        </div>

        {/* Weakness + Action Plan */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          
          {/* Weak Areas */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold mb-4">Focus Areas</h2>

            <ul className="space-y-3 text-sm text-white/80">
              <li>• Confidence during technical explanations</li>
              <li>• Structuring answers clearly</li>
              <li>• Explaining system design trade-offs</li>
            </ul>
          </div>

          {/* Action Plan */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>

            <ul className="space-y-3 text-sm text-white/80">
              <li>• Practice 2 system design interviews this week</li>
              <li>• Record and review your answers</li>
              <li>• Focus on explaining why  behind decisions</li>
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}