import { adminDb } from "@/lib/firebase-admin";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;
  const doc = await adminDb.collection("interviews").doc(id).get();

  if (!doc.exists) {
    return (
      <main className="min-h-screen bg-[#030711] text-white p-6">
        <p>Interview not found.</p>
      </main>
    );
  }

  const data = doc.data()!;

  const scoreCards = [
    ["Overall", data.overallScore],
    ["Communication", data.communication],
    ["Technical Depth", data.technicalDepth],
    ["Confidence", data.confidence],
    ["Problem Solving", data.problemSolving],
    ["Clarity", data.clarity],
  ];

  return (
    <main className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-bold">Interview Feedback</h1>
        <p className="mt-2 text-white/60">
          {data.role} · {data.interviewType} · {data.difficulty}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {scoreCards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
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
              {data.strengths?.map((item: string) => (
                <p key={item} className="text-white/80">• {item}</p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
            <h3 className="text-lg font-semibold text-amber-300">Improvements</h3>
            <div className="mt-4 space-y-2">
              {data.improvements?.map((item: string) => (
                <p key={item} className="text-white/80">• {item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
          <h3 className="text-lg font-semibold text-cyan-300">Summary</h3>
          <p className="mt-3 text-white/80">{data.summary}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Next Steps</h3>
          <div className="mt-4 space-y-2">
            {data.nextSteps?.map((item: string) => (
              <p key={item} className="text-white/80">• {item}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}