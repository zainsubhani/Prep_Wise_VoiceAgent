"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserInterviews } from "@/hooks/use-user-interviews";
import {
  buildInterviewAnalytics,
  formatInterviewDate,
} from "@/lib/interview-analytics";

const practiceTracks = [
  {
    id: 1,
    title: "Full-Stack Dev Interview",
    category: "Technical",
    description:
      "Practice frontend, backend, architecture, and real-world engineering tradeoffs.",
  },
  {
    id: 2,
    title: "DevOps & Cloud Interview",
    category: "Technical",
    description:
      "Test infrastructure thinking, deployment pipelines, observability, and cloud design.",
  },
  {
    id: 3,
    title: "HR Screening Interview",
    category: "Behavioral",
    description:
      "Prepare for recruiter screens, motivation questions, and communication assessment.",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { interviews, loading, error } = useUserInterviews();
  const analytics = buildInterviewAnalytics(interviews);

  const dashboardStats = [
    {
      label: "Interviews Completed",
      value: String(analytics.totalInterviews),
      subtext:
        analytics.totalInterviews > 0
          ? `Latest score: ${analytics.latestScore}%`
          : "Complete your first interview",
    },
    {
      label: "Average Review Score",
      value: `${analytics.averageScore}%`,
      subtext: `${analytics.scoreChange >= 0 ? "+" : ""}${analytics.scoreChange}% from your first session`,
    },
    {
      label: "Strongest Skill",
      value: analytics.strongestSkill?.label ?? "N/A",
      subtext: `${analytics.strongestSkill?.value ?? 0}% average`,
    },
    {
      label: "Needs Focus",
      value: analytics.weakestSkill?.label ?? "N/A",
      subtext: `${analytics.weakestSkill?.value ?? 0}% average`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#040816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,224,0.07),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(0,119,255,0.05),transparent_20%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:gap-14 lg:px-8">
        <header>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-400">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {user?.displayName
              ? `${user.displayName}'s Interview Command Center`
              : "Your Interview Command Center"}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
            Track your real interview performance, review your latest feedback,
            and keep practicing with data tied to your own sessions.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-3xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm sm:p-6"
            >
              <p className="text-sm uppercase tracking-[0.22em] text-white/40">
                {stat.label}
              </p>

              <h2 className="mt-4 wrap-break-word text-3xl font-black text-cyan-400 sm:text-4xl">
                {stat.value}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/50">
                {stat.subtext}
              </p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#0a1022]/85 p-5 backdrop-blur-xl sm:p-6">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
                Progress Overview
              </p>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Skill Performance
              </h2>
            </div>

            {loading ? (
              <p className="text-sm text-white/60">Loading your performance...</p>
            ) : interviews.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-5 text-sm text-white/65">
                No interview history yet. Your skill breakdown will appear here
                after your first completed session.
              </div>
            ) : (
              <div className="space-y-6">
                {analytics.skillData.map((item) => (
                  <div key={item.skill}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-white/80">
                        {item.skill}
                      </span>
                      <span className="text-sm font-semibold text-cyan-400">
                        {item.value}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0a1022]/85 p-5 backdrop-blur-xl sm:p-6">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
                Recent Activity
              </p>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Latest Updates
              </h2>
            </div>

            <div className="space-y-4">
              {error ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100/80">
                  {error}
                </div>
              ) : analytics.recentActivity.length > 0 ? (
                analytics.recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/8 bg-white/3 p-4"
                  >
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/45">{item.time}</p>
                    <p className="mt-3 text-sm font-medium text-cyan-400">
                      {item.status}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-sm text-white/65">
                  Your recent interview activity will show up here.
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Pick Your Interview
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {practiceTracks.map((track) => (
              <article
                key={track.id}
                className="rounded-[28px] border border-white/10 bg-[#0a1022]/85 p-5 backdrop-blur-xl sm:p-6"
              >
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  {track.category}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white sm:text-2xl">
                  {track.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-white/55 sm:min-h-24 sm:leading-8">
                  {track.description}
                </p>
                <Link
                  href="/takeinterview"
                  className="mt-6 inline-flex rounded-full bg-[#c9c1ff] px-8 py-3 text-sm font-semibold text-black transition hover:bg-[#b8adff]"
                >
                  Take interview
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Your Past Interviews
            </h2>
            <Link href="/feedback" className="text-sm font-semibold text-cyan-300">
              View full feedback dashboard
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-white/60">Loading your past interviews...</p>
          ) : interviews.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[#0a1022]/85 p-6 text-white/65">
              You haven&apos;t completed an interview yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {interviews.slice(0, 3).map((interview) => (
                <article
                  key={interview.id}
                  className="rounded-[28px] border border-white/10 bg-[#0a1022]/85 p-5 backdrop-blur-xl sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      {interview.interviewType}
                    </span>
                    <span className="text-sm font-semibold text-cyan-300">
                      {interview.overallScore}/100
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-white sm:text-2xl">
                    {interview.role}
                  </h3>
                  <p className="mt-2 text-sm text-white/45">
                    {interview.company || "General"} ·{" "}
                    {formatInterviewDate(interview.createdAt)}
                  </p>
                  <p className="mt-5 text-base leading-7 text-white/55 sm:min-h-24 sm:leading-8">
                    {interview.summary}
                  </p>

                  <Link
                    href={`/feedback/${interview.id}`}
                    className="mt-6 inline-flex rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
                  >
                    View interview
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
