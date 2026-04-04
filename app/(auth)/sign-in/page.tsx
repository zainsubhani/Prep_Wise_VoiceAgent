import AuthForm from "@/components/AuthForm";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040816]">
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,224,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(0,119,255,0.06),transparent_25%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.32em] text-cyan-400">
              Now in Private Beta • 2,400+ Recruiters
            </p>

            <h1 className="text-6xl font-black leading-[0.92] tracking-tight text-white">
              Interview{" "}
              <span className="text-white/10">at the</span>
              <br />
              <span className="text-cyan-400">Speed of Thought</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-white/55">
              AI-powered technical interviews trusted by high-performing teams.
              Real signal. Zero bias. Faster hiring.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm">
                <p className="text-3xl font-black text-cyan-400">94%</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/40">
                  Offer Accuracy Rate
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm">
                <p className="text-3xl font-black text-cyan-400">80k+</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/40">
                  Interviews Completed
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center">
          <AuthForm type="sign-in" />
        </div>
      </div>
    </main>
  );
}