import AuthForm from "@/components/AuthForm";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040816]">
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,224,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(0,119,255,0.06),transparent_25%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.32em] text-cyan-400">
              Build Better Hiring Systems
            </p>

            <h1 className="text-6xl font-black leading-[0.92] tracking-tight text-white">
              Hire the top 1%.
              <br />
              <span className="text-cyan-400">Not just the prepared.</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-white/55">
              Create your account to unlock structured interview workflows,
              better evaluation signals, and scalable AI-assisted hiring.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm">
                <p className="text-base font-semibold text-white">
                  Adaptive interview difficulty
                </p>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  Questions recalibrate in real time based on candidate
                  responses.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm">
                <p className="text-base font-semibold text-white">
                  Live behavioral and technical signals
                </p>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  Go beyond correctness with structured evaluation and feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center">
          <AuthForm type="sign-up" />
        </div>
      </div>
    </main>
  );
}
