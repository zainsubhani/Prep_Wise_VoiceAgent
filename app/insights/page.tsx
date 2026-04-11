"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useUserInterviews } from "@/hooks/use-user-interviews";
import { buildInterviewAnalytics } from "@/lib/interview-analytics";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function InsightsPage() {
  const { user, loading: authLoading } = useAuth();
  const { interviews, loading, error } = useUserInterviews();

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#030711] text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Loading insights...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#030711] text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-3xl font-bold">Sign in to unlock your insights</h1>
            <p className="mt-3 text-white/60">
              We use your completed interviews to generate personalized coaching
              signals and trends.
            </p>
            <Link
              href="/sign-in"
              className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              Go to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#030711] text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-8">
            <h1 className="text-2xl font-semibold text-rose-200">
              We couldn&apos;t load your performance insights
            </h1>
            <p className="mt-3 text-sm text-rose-100/80">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (interviews.length === 0) {
    return (
      <main className="min-h-screen bg-[#030711] text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-3xl font-bold">No insights yet</h1>
            <p className="mt-3 text-white/60">
              Finish at least one interview and we&apos;ll generate a coaching
              view from your real performance.
            </p>
            <Link
              href="/takeinterview"
              className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              Take an interview
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const analytics = buildInterviewAnalytics(interviews);
  const targetScore = 85;
  const completion = Math.min(
    100,
    Math.round((analytics.averageScore / targetScore) * 100)
  );

  const stats = [
    {
      title: "Current Score",
      value: `${analytics.latestScore}%`,
      change: `${analytics.scoreChange >= 0 ? "+" : ""}${analytics.scoreChange}% vs first interview`,
    },
    {
      title: "Consistency",
      value:
        Math.abs(analytics.scoreChange) <= 5
          ? "Stable"
          : analytics.scoreChange > 5
            ? "Improving"
            : "Uneven",
      change: `${analytics.totalInterviews} completed interviews`,
    },
    {
      title: "Weakest Skill",
      value: analytics.weakestSkill?.label ?? "N/A",
      change: `${analytics.weakestSkill?.value ?? 0}% average`,
    },
    {
      title: "Best Area",
      value: analytics.strongestSkill?.label ?? "N/A",
      change: `${analytics.strongestSkill?.value ?? 0}% average`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            AI Insights
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {user.displayName ? `${user.displayName}&apos;s Performance Intelligence` : "Performance Intelligence"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Understand where your real interview results are trending and what
            deserves your attention next.
          </p>
        </div>

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

        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-6">
          <h2 className="text-lg font-semibold text-cyan-300">AI Insight</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {analytics.latestSummary} Your strongest area is{" "}
            {analytics.strongestSkill?.label?.toLowerCase() ?? "overall performance"},
            while your biggest opportunity is{" "}
            {analytics.weakestSkill?.label?.toLowerCase() ?? "consistency"}.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 xl:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Score Trend</h2>

            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.progressData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
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

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-xl font-semibold">Goal</h2>

            <p className="text-sm text-white/60">Target Score</p>
            <h3 className="mt-2 text-2xl font-bold text-cyan-400">
              {targetScore}%
            </h3>

            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-cyan-400"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-white/50">
                Current average: {analytics.averageScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-xl font-semibold">Focus Areas</h2>

            <ul className="space-y-3 text-sm text-white/80">
              {analytics.focusAreas.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-xl font-semibold">Recommended Actions</h2>

            <ul className="space-y-3 text-sm text-white/80">
              {analytics.recommendedActions.slice(0, 4).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
