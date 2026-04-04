"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicOnlyRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040816] text-white">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
          Loading...
        </p>
      </div>
    );
  }

  if (user) return null;

  return <>{children}</>;
}