import AuthForm from "@/components/AuthForm";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-dark-100">
      <ParticlesBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <AuthForm type="sign-up" />
      </div>
    </main>
  );
}