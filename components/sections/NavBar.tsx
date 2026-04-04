"use client";

import Link from "next/link";
import { useState } from "react";
import { navbarContent } from "@/constants/navbar-content";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#040816]/95 backdrop-blur-md">
      <div className="relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(0,255,224,0.06),transparent_25%),radial-gradient(circle_at_right,rgba(0,180,255,0.06),transparent_25%)]" />

        <nav className="relative mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center text-3xl font-black tracking-tight">
            <span className="text-cyan-400">{navbarContent.logo.primary}</span>
            <span className="text-white">{navbarContent.logo.secondary}</span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {navbarContent.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-(--font-mono) text-sm uppercase tracking-[0.22em] text-white/55 transition hover:text-cyan-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href={navbarContent.cta.href}
            className="hidden rounded-sm bg-cyan-400 px-8 py-4 font-(--font-mono) text-sm uppercase tracking-[0.18em] text-black transition hover:bg-cyan-300 md:inline-flex"
          >
            {navbarContent.cta.label}
          </Link>

          <button
            onClick={() => setOpen(!open)}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </nav>

        {open && (
          <div className="relative border-t border-white/10 bg-[#050816] px-4 py-6 md:hidden">
            <div className="flex flex-col gap-5">
              {navbarContent.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-(--font-mono) text-sm uppercase tracking-[0.2em] text-white/70"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href={navbarContent.cta.href}
                className="mt-2 inline-flex w-fit rounded-sm bg-cyan-400 px-6 py-3 font-(--font-mono) text-sm uppercase tracking-[0.18em] text-black"
                onClick={() => setOpen(false)}
              >
                {navbarContent.cta.label}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}