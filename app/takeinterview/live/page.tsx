"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Clock3, Mic, MicOff, Radio, Sparkles, Volume2 } from "lucide-react";
import { LiveInterviewWindowState } from "@/types/live-interview-window";

const CHANNEL_NAME = "live-interview-window";
const STORAGE_KEY = "live-interview-window-state";

const initialState: LiveInterviewWindowState = {
  isOpen: false,
  role: "Frontend Developer",
  interviewType: "Technical",
  difficulty: "Medium",
  duration: 30,
  formattedTime: "30:00",
  status: "Preparing session",
  isMuted: false,
  isAssistantSpeaking: false,
  normalizedVolume: 0,
  transcriptItems: [],
  userName: "Candidate",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function LiveInterviewWindowPage() {
  const [session, setSession] = useState<LiveInterviewWindowState>(() => {
    if (typeof window === "undefined") {
      return initialState;
    }

    const storedState = window.localStorage.getItem(STORAGE_KEY);

    if (!storedState) {
      return initialState;
    }

    try {
      return JSON.parse(storedState) as LiveInterviewWindowState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);

    channel.onmessage = (event: MessageEvent<LiveInterviewWindowState>) => {
      setSession(event.data);

      if (!event.data.isOpen) {
        window.close();
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const latestMessages = useMemo(
    () => session.transcriptItems.slice(-6),
    [session.transcriptItems]
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(202,197,254,0.14),transparent_24%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-5 sm:py-6">
        <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,34,0.96),rgba(8,11,24,0.9))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:rounded-[30px] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                <Radio className="h-3.5 w-3.5" />
                Live Interview Window
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Active conversation
              </h1>
              <p className="mt-2 text-sm text-white/55">
                {session.role} · {session.interviewType} · {session.difficulty}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[32rem]">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Timer
                </p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                  <Clock3 className="h-4 w-4 text-cyan-300" />
                  {session.formattedTime}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Audio
                </p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                  {session.isMuted ? (
                    <MicOff className="h-4 w-4 text-rose-300" />
                  ) : (
                    <Mic className="h-4 w-4 text-cyan-300" />
                  )}
                  {session.isMuted ? "Muted" : "Open"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Status
                </p>
                <p className="mt-2 break-words text-base font-semibold text-white sm:text-lg">
                  {session.status}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid flex-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,34,0.96),rgba(8,11,24,0.9))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:rounded-[30px] sm:p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[24px] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(34,211,238,0.12),rgba(255,255,255,0.03))] p-4 sm:rounded-[28px] sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                      Interviewer
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                      Axis AI
                    </h2>
                  </div>
                  <div
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                      session.isAssistantSpeaking
                        ? "bg-cyan-400/15 text-cyan-100"
                        : "bg-white/8 text-white/60"
                    )}
                  >
                    {session.isAssistantSpeaking ? "Speaking" : "Listening"}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-cyan-400/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),rgba(5,8,22,0.12)_65%)] sm:h-56 sm:w-56 lg:h-64 lg:w-64">
                    <div
                      className={cn(
                        "absolute inset-4 rounded-full border transition",
                        session.isAssistantSpeaking
                          ? "animate-pulse border-cyan-300/55"
                          : "border-white/8"
                      )}
                    />
                    <Image
                      src="/ai-avatar.png"
                      alt="AI interviewer avatar"
                      width={180}
                      height={180}
                      className="relative h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40 lg:h-[180px] lg:w-[180px]"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(202,197,254,0.1),rgba(255,255,255,0.03))] p-4 sm:rounded-[28px] sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Candidate
                    </p>
                    <h2 className="mt-2 break-words text-2xl font-black text-white sm:text-3xl">
                      {session.userName}
                    </h2>
                  </div>
                  <div className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    Live
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(202,197,254,0.18),rgba(5,8,22,0.12)_65%)] sm:h-56 sm:w-56 lg:h-64 lg:w-64">
                    <div className="absolute inset-4 rounded-full border border-white/10" />
                    <Image
                      src="/user-avatar.png"
                      alt="Candidate avatar"
                      width={180}
                      height={180}
                      className="relative h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40 lg:h-[180px] lg:w-[180px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-[#081120] p-4 sm:rounded-[28px] sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <Volume2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Voice activity
                    </p>
                    <p className="text-xs text-white/45">
                      Live session intensity and responsiveness
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-cyan-200">
                  {Math.round(session.normalizedVolume)}%
                </span>
              </div>

              <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#cac5fe)] transition-all duration-200"
                  style={{ width: `${session.normalizedVolume}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,34,0.96),rgba(8,11,24,0.9))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:rounded-[30px] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">
                  Transcript
                </p>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Session feed
                </h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/65">
                {session.transcriptItems.length} messages
              </div>
            </div>

            <div className="mt-6 h-[30rem] overflow-y-auto pr-1 sm:h-[38rem]">
              {latestMessages.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#081120] p-8 text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-white">
                      Waiting for the conversation to begin
                    </p>
                    <p className="mt-2 text-sm text-white/45">
                      As soon as the interview starts, the latest transcript will
                      appear here in a clean showcase layout.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {latestMessages.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "rounded-[24px] border px-4 py-4",
                        item.role === "assistant"
                          ? "border-cyan-400/15 bg-cyan-400/8"
                          : "border-white/10 bg-white/5"
                      )}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                        {item.role === "assistant" ? "Interviewer" : "Candidate"}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/85">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
