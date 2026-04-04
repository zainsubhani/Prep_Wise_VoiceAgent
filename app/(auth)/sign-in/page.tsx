// app/(auth)/page.tsx or pages/auth.tsx
import AuthForm from "@/components/AuthForm";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import React from "react";

const Page = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Particle background behind content */}
      <ParticlesBackground />

      {/* Auth form in center */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <AuthForm type="sign-in" />
      </div>
    </div>
  );
};

export default Page;