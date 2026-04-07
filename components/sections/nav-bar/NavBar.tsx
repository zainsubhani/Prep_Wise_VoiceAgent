"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";

import { publicNavbarContent , privateNavbarContent } from "@/constants/navbar-content";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpen(false);
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (href: string) => pathname === href;
  const navItems = user ? privateNavbarContent.links : publicNavbarContent.links;


  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#040816]/95 backdrop-blur-md">
      <div className="relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(0,255,224,0.06),transparent_25%),radial-gradient(circle_at_right,rgba(0,180,255,0.06),transparent_25%)]" />

        <nav className="relative mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center text-3xl font-black tracking-tight"
          >
            <span className="text-cyan-400">{publicNavbarContent.logo.primary}</span>
            <span className="text-white">{publicNavbarContent.logo.secondary}</span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {navItems.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm uppercase tracking-[0.22em] transition ${
                  isActive(link.href)
                    ? "text-cyan-400"
                    : "text-white/55 hover:text-cyan-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!loading && !user && (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-sm border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.18em] text-white transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  Login
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-sm bg-cyan-400 px-8 py-4 text-sm uppercase tracking-[0.18em] text-black transition hover:bg-cyan-300"
                >
                  Sign Up
                </Link>
              </>
            )}

            {!loading && user && (
              <>
                <Link
                  href="/takeinterview"
                  className="rounded-sm border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.18em] text-white transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  Take Interview
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-sm bg-cyan-400 px-8 py-4 text-sm uppercase tracking-[0.18em] text-black transition hover:bg-cyan-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md border border-white/10 p-2 text-white md:hidden"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </nav>

        {open && (
          <div className="relative border-t border-white/10 bg-[#050816] px-4 py-6 md:hidden">
            <div className="flex flex-col gap-5">
              {navItems.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm uppercase tracking-[0.2em] ${
                    isActive(link.href) ? "text-cyan-400" : "text-white/70"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {!loading && !user && (
                <>
                  <Link
                    href="/sign-in"
                    className="mt-2 inline-flex w-fit rounded-sm border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.18em] text-white"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    href="/sign-up"
                    className="inline-flex w-fit rounded-sm bg-cyan-400 px-6 py-3 text-sm uppercase tracking-[0.18em] text-black"
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {!loading && user && (
                <>
                  <Link
                    href="/dashboard"
                    className="mt-2 inline-flex w-fit rounded-sm border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.18em] text-white"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex w-fit rounded-sm bg-cyan-400 px-6 py-3 text-sm uppercase tracking-[0.18em] text-black"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}