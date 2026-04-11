"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useUserInterviews } from "@/hooks/use-user-interviews";
import { formatInterviewDate } from "@/lib/interview-analytics";
import Link from "next/link";

export default function InterviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const { interviews, loading, error } = useUserInterviews();

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#030711] p-4 text-white sm:p-6">
        <p>Loading interviews...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#030711] p-4 text-white sm:p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Sign in to view your interviews</h1>
          <p className="mt-3 text-white/60">
            Your interview history is private and only available in your account.
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

  return (
    <main className="min-h-screen bg-[#030711] p-4 text-white sm:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Your Interviews</h1>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100/80">
            {error}
          </div>
        )}

        {interviews.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:p-8">
            <h2 className="text-xl font-semibold mb-2">No interviews found</h2>
            <p className="text-white/60">
              You have not taken any interviews yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="min-w-0 rounded-2xl border border-cyan-400/10 bg-white/5 p-5 shadow-lg backdrop-blur"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">{interview.role}</h2>
                  <p className="text-sm text-white/60">{interview.company}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-white/50">Score:</span>{" "}
                    <span className="font-medium text-cyan-400">
                      {interview.overallScore ?? "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="text-white/50">Type:</span>{" "}
                    <span className="capitalize">{interview.interviewType}</span>
                  </p>
                  <p>
                    <span className="text-white/50">Date:</span>{" "}
                    <span>{formatInterviewDate(interview.createdAt)}</span>
                  </p>
                  {interview.summary && (
                    <p className="text-white/70 line-clamp-3">
                      {interview.summary}
                    </p>
                  )}
                  <Link
                    href={`/feedback/${interview.id}`}
                    className="inline-flex rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-black transition hover:bg-cyan-300"
                  >
                    View feedback
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
