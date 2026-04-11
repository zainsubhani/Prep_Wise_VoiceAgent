import Link from "next/link";

export default function FeaturesCta() {
  return (
    <section className="px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
      <h2 className="text-3xl font-black sm:text-4xl">
        Ready to Level Up Your Interviews?
      </h2>

      <p className="mt-4 text-white/60">
        Start practicing today and land your dream job.
      </p>

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          href="/sign-up"
          className="rounded-md bg-cyan-400 px-6 py-3 text-black font-semibold transition hover:bg-cyan-300"
        >
          Get Started
        </Link>

        <Link
          href="/dashboard"
          className="rounded-md border border-white/20 px-6 py-3 text-white transition hover:bg-white/10"
        >
          Go to Dashboard
        </Link>
      </div>
    </section>
  );
}
