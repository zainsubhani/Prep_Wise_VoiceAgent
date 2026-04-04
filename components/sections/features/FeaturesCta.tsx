import Link from "next/link";

export default function FeaturesCta() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl font-black">
        Ready to Level Up Your Interviews?
      </h2>

      <p className="mt-4 text-white/60">
        Start practicing today and land your dream job.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/sign-up"
          className="bg-cyan-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-cyan-300 transition"
        >
          Get Started
        </Link>

        <Link
          href="/dashboard"
          className="border border-white/20 px-6 py-3 rounded-md text-white hover:bg-white/10 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </section>
  );
}