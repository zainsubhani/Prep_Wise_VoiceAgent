"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { buildInterviewAnalytics } from "@/lib/interview-analytics";
import { useUserInterviews } from "@/hooks/use-user-interviews";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function EmptyState() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
      <h2 className="text-2xl font-semibold text-white">
        No interview data yet
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
        Complete a voice interview to unlock your real score trends, strengths,
        and improvement areas.
      </p>
      <Link
        href="/takeinterview"
        className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
      >
        Start your first interview
      </Link>
    </div>
  );
}

export default function FeedbackPage() {
  const { user, loading: authLoading } = useAuth();
  const { interviews, loading, error } = useUserInterviews();

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#030711] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Loading feedback...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#030711] text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center sm:p-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Sign in to view your feedback</h1>
            <p className="mt-3 text-white/60">
              Your feedback dashboard is personalized to your own interview
              history and performance.
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
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5 sm:p-8">
            <h1 className="text-2xl font-semibold text-rose-200">
              We couldn&apos;t load your interview data
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
              Performance Insights
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
              Feedback Dashboard
            </h1>
          </div>
          <EmptyState />
        </div>
      </main>
    );
  }

  const analytics = buildInterviewAnalytics(interviews);
  const stats = [
    {
      title: "Average Score",
      value: `${analytics.averageScore}%`,
      subtext: `${analytics.scoreChange >= 0 ? "+" : ""}${analytics.scoreChange}% from your first interview`,
    },
    {
      title: "Total Interviews",
      value: String(analytics.totalInterviews),
      subtext: `Latest score: ${analytics.latestScore}%`,
    },
    {
      title: "Best Category",
      value: analytics.strongestSkill?.label ?? "N/A",
      subtext: `${analytics.strongestSkill?.value ?? 0}% average`,
    },
    {
      title: "Needs Improvement",
      value: analytics.weakestSkill?.label ?? "N/A",
      subtext: `${analytics.weakestSkill?.value ?? 0}% average`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Performance Insights
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
            {user.displayName ? `${user.displayName}&apos;s Feedback Dashboard` : "Feedback Dashboard"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60 md:text-base">
            Real interview scores, actual strengths, and improvement areas based
            on your own completed sessions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
            className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <p className="text-sm text-white/60">{item.title}</p>
              <h2 className="mt-3 break-words text-2xl font-semibold text-cyan-400 sm:text-3xl">
                {item.value}
              </h2>
              <p className="mt-2 text-sm text-white/50">{item.subtext}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 xl:col-span-2">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Score Progress</h2>
              <p className="text-sm text-white/50">
                Your actual scores across completed interviews
              </p>
            </div>

            <div className="h-72 w-full overflow-hidden sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.progressData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="interview" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#081120",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#22d3ee" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Skill Breakdown</h2>
              <p className="text-sm text-white/50">
                Average scores from your interview evaluations
              </p>
            </div>

            <div className="h-72 w-full overflow-hidden sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={analytics.skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="skill" stroke="rgba(255,255,255,0.6)" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" domain={[0, 100]} />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 xl:col-span-1">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Interview Type Scores</h2>
              <p className="text-sm text-white/50">
                Compare how you perform by interview type
              </p>
            </div>

            <div className="h-72 w-full overflow-hidden sm:h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#081120",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="score" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 xl:col-span-2">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Recent Feedback</h2>
              <p className="text-sm text-white/50">
                Insights pulled from your latest interview reports
              </p>
            </div>

            <div className="space-y-4">
              {analytics.recentFeedback.map((item) => (
                <Link
                  key={item.id}
                  href={`/feedback/${item.id}`}
                  className="block rounded-2xl border border-white/10 bg-[#081120] p-5 transition hover:border-cyan-400/30"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">
                        {item.role} · {item.company}
                      </h3>
                      <p className="mt-1 text-sm text-white/50">
                        {item.date} · {item.interviewType}
                      </p>
                    </div>

                    <div className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300">
                      Score: <span className="font-semibold">{item.score}%</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/75">
                    {item.summary}
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                      <p className="mb-3 text-sm font-medium text-emerald-300">
                        Strengths
                      </p>
                      <div className="space-y-2">
                        {item.strengths.map((point) => (
                          <p key={point} className="text-sm text-white/80">
                            • {point}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-4">
                      <p className="mb-3 text-sm font-medium text-amber-300">
                        Improvement Areas
                      </p>
                      <div className="space-y-2">
                        {item.improvements.map((point) => (
                          <p key={point} className="text-sm text-white/80">
                            • {point}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
