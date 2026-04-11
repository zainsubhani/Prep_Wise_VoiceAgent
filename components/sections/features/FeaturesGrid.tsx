const features = [
  {
    title: "AI Mock Interviews",
    desc: "Simulate real interview scenarios powered by AI with dynamic questions.",
  },
  {
    title: "Instant Feedback",
    desc: "Get detailed feedback on answers, structure, and communication.",
  },
  {
    title: "Performance Analytics",
    desc: "Track your improvement with smart dashboards and insights.",
  },
  {
    title: "Multiple Domains",
    desc: "Practice frontend, backend, system design, and behavioral interviews.",
  },
  {
    title: "Real-time Evaluation",
    desc: "Understand your strengths and weaknesses instantly.",
  },
  {
    title: "Progress Tracking",
    desc: "Visualize your journey with charts and progress metrics.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-md transition hover:border-cyan-400/40 sm:p-6"
          >
            <h3 className="text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm text-white/50">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
