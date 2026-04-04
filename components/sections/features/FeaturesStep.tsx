const steps = [
  {
    title: "Choose Interview",
    desc: "Select your domain and difficulty level.",
  },
  {
    title: "Practice with AI",
    desc: "Answer real-time questions just like a real interview.",
  },
  {
    title: "Get Feedback",
    desc: "Receive instant AI-driven evaluation and suggestions.",
  },
];

export default function FeaturesSteps() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-4xl font-black">How It Works</h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-black font-bold">
                {i + 1}
              </div>

              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>

              <p className="mt-3 text-white/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}