import AuthForm from "@/components/AuthForm";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040816]">
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,224,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(0,119,255,0.06),transparent_25%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <AuthForm type="sign-in" />
      </div>
    </main>
  );
}