"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useUserInterviews } from "@/hooks/use-user-interviews";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function FeedbackDetailPage() {
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { interviews, loading, error } = useUserInterviews();
  const interview = interviews.find((item) => item.id === params.id);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#030711] p-4 text-white sm:p-6">
        <p>Loading interview feedback...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#030711] p-4 text-white sm:p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Sign in to view this feedback</h1>
          <p className="mt-3 text-white/60">
            Detailed interview reports are private to your account.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#030711] p-4 text-white sm:p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5 sm:p-8">
          <h1 className="text-2xl font-semibold text-rose-200">
            We couldn&apos;t load this interview feedback
          </h1>
          <p className="mt-3 text-sm text-rose-100/80">{error}</p>
        </div>
      </main>
    );
  }

  if (!interview) {
    return (
      <main className="min-h-screen bg-[#030711] p-4 text-white sm:p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Interview not found</h1>
          <p className="mt-3 text-white/60">
            This feedback either does not exist or does not belong to your
            account.
          </p>
          <Link
            href="/feedback"
            className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
          >
            Back to feedback
          </Link>
        </div>
      </main>
    );
  }

  const scoreCards = [
    ["Overall", interview.overallScore],
    ["Communication", interview.communication],
    ["Technical Depth", interview.technicalDepth],
    ["Confidence", interview.confidence],
    ["Problem Solving", interview.problemSolving],
    ["Clarity", interview.clarity],
  ];

  return (
    <main className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Interview Feedback</h1>
        <p className="mt-2 text-white/60">
          {interview.role} · {interview.interviewType} · {interview.difficulty}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scoreCards.map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-white/50">{label}</p>
              <h2 className="mt-2 text-3xl font-semibold text-cyan-400">
                {String(value)}%
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
            <h3 className="text-lg font-semibold text-emerald-300">Strengths</h3>
            <div className="mt-4 space-y-2">
              {interview.strengths?.map((item) => (
                <p key={item} className="text-white/80">
                  • {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
            <h3 className="text-lg font-semibold text-amber-300">
              Improvements
            </h3>
            <div className="mt-4 space-y-2">
              {interview.improvements?.map((item) => (
                <p key={item} className="text-white/80">
                  • {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
          <h3 className="text-lg font-semibold text-cyan-300">Summary</h3>
          <p className="mt-3 text-white/80">{interview.summary}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Next Steps</h3>
          <div className="mt-4 space-y-2">
            {interview.nextSteps?.map((item) => (
              <p key={item} className="text-white/80">
                • {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
