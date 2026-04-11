"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Clock3,
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Volume2,
  WandSparkles,
} from "lucide-react";
import {
  Difficulty,
  InterviewType,
  ROLE_OPTIONS,
  RoleOption,
  TranscriptItem,
  TranscriptMessage,
  VapiMessage,
} from "../../types/takeinterview.types";

function isTranscriptMessage(
  message: VapiMessage
): message is TranscriptMessage {
  return (
    message.type === "transcript" &&
    typeof message.transcript === "string" &&
    (message.role === "assistant" || message.role === "user")
  );
}

const TYPE_OPTIONS: InterviewType[] = ["Technical", "Behavioral", "Mixed"];
const DIFFICULTY_LEVELS: Difficulty[] = ["Easy", "Medium", "Hard"];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

type AnalyzeResponse = {
  error?: string;
  interviewId?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function TakeInterviewPage() {
  const router = useRouter();

  const vapiRef = useRef<Vapi | null>(null);
  const hasAnalyzedRef = useRef(false);
  const transcriptItemsRef = useRef<TranscriptItem[]>([]);

  const [isOnline, setIsOnline] = useState(true);
  const [role, setRole] = useState<RoleOption>("Frontend Developer");
  const [interviewType, setInterviewType] =
    useState<InterviewType>("Technical");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [duration, setDuration] = useState<number>(30);

  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [status, setStatus] = useState("Ready for a live session");
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    transcriptItemsRef.current = transcriptItems;
  }, [transcriptItems]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  const normalizedVolume = useMemo(
    () => Math.max(0, Math.min(100, volumeLevel * 100)),
    [volumeLevel]
  );

  const sessionLocked = isInterviewStarted || isAnalyzing;

  const statusTone = isAnalyzing
    ? "text-amber-200 border-amber-400/25 bg-amber-500/10"
    : error
      ? "text-rose-100 border-rose-400/25 bg-rose-500/10"
      : isInterviewStarted
        ? "text-emerald-100 border-emerald-400/25 bg-emerald-500/10"
        : "text-cyan-100 border-cyan-400/25 bg-cyan-500/10";

  const quickStats = [
    {
      label: "Role Track",
      value: role,
      icon: BriefcaseBusiness,
    },
    {
      label: "Interview Mode",
      value: interviewType,
      icon: Sparkles,
    },
    {
      label: "Time Window",
      value: `${duration} min`,
      icon: Clock3,
    },
  ];

  const readinessChecklist = [
    isOnline ? "Stable connection detected" : "Reconnect before starting",
    isMuted ? "Microphone muted" : "Microphone available",
    isAssistantSpeaking ? "AI interviewer is talking" : "AI interviewer is listening",
  ];

  useEffect(() => {
    if (!isInterviewStarted) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isInterviewStarted]);

  useEffect(() => {
    if (!isInterviewStarted || isInterviewEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          void endInterview(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInterviewStarted, isInterviewEnded]);

  const analyzeAndSave = useCallback(async () => {
    try {
      setStatus("Analyzing interview performance");
      setError(null);
      setIsAnalyzing(true);

      const transcriptText = transcriptItemsRef.current
        .map(
          (item) =>
            `${item.role === "assistant" ? "Interviewer" : "Candidate"}: ${item.text}`
        )
        .join("\n");

      if (!transcriptText.trim()) {
        throw new Error("No transcript available for analysis.");
      }

      const payload = {
        userId: "demo-user-id",
        role,
        company: "",
        interviewType,
        difficulty,
        duration,
        transcript: transcriptText,
      };

      const res = await fetch("/api/interview/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response from /api/interview/analyze:", text);
        throw new Error("Server returned an invalid response.");
      }

      const data: AnalyzeResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      if (!data.interviewId) {
        throw new Error("Missing interviewId in analysis response.");
      }

      setStatus("Analysis complete");
      router.push(`/feedback/${data.interviewId}`);
    } catch (err) {
      console.error("analyzeAndSave error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Interview ended, but analysis failed.";

      setError(message);
      setStatus("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }, [difficulty, duration, interviewType, role, router]);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setStatus("Interview live");
      setIsInterviewStarted(true);
      setIsInterviewEnded(false);
      setError(null);
    });

    vapi.on("call-end", () => {
      setStatus("Session finished");
      setIsInterviewStarted(false);
      setIsInterviewEnded(true);
      setIsAssistantSpeaking(false);

      if (!hasAnalyzedRef.current) {
        hasAnalyzedRef.current = true;

        if (transcriptItemsRef.current.length > 0) {
          void analyzeAndSave();
        } else {
          setError("Interview ended before any transcript was captured.");
          setStatus("No transcript available");
        }
      }
    });

    vapi.on("speech-start", () => {
      setIsAssistantSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setIsAssistantSpeaking(false);
    });

    vapi.on("volume-level", (level: number) => {
      setVolumeLevel(level);
    });

    vapi.on("message", (message: VapiMessage) => {
      if (isTranscriptMessage(message)) {
        setTranscriptItems((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: message.role,
            text: message.transcript,
          },
        ]);
      }
    });

    vapi.on("error", (e: unknown) => {
      console.error("Vapi error:", e);

      const errorMessage =
        typeof e === "object" &&
        e !== null &&
        "error" in e &&
        typeof (e as { error?: { errorMsg?: string } }).error?.errorMsg ===
          "string"
          ? (e as { error?: { errorMsg?: string } }).error!.errorMsg!
          : "Voice session failed. Please try again.";

      setError(errorMessage);
      setStatus("Connection issue");
      setIsInterviewStarted(false);
      setIsAssistantSpeaking(false);
    });

    return () => {
      try {
        vapi.stop();
      } catch {}

      vapiRef.current = null;
    };
  }, [analyzeAndSave, difficulty, duration, interviewType, role, router]);

  const ensureMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Microphone access is required to start the interview.");
      setStatus("Mic permission required");
      return false;
    }
  };

  const startInterview = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isOnline) {
        setError("You are offline. Please reconnect before starting the interview.");
        setStatus("Offline");
        return;
      }

      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

      if (!assistantId) {
        setError("Missing Vapi assistant id.");
        setStatus("Configuration error");
        return;
      }

      if (!vapiRef.current) {
        setError("Vapi client is not initialized.");
        setStatus("Initialization error");
        return;
      }

      const hasMicAccess = await ensureMicrophoneAccess();
      if (!hasMicAccess) return;

      setStatus("Connecting to interviewer");
      hasAnalyzedRef.current = false;
      setTranscriptItems([]);
      transcriptItemsRef.current = [];
      setTimeLeft(duration * 60);
      setIsInterviewEnded(false);
      setIsMuted(false);
      setVolumeLevel(0);

      await vapiRef.current.start(assistantId, {
        variableValues: {
          role,
          interviewType,
          difficulty,
          duration: String(duration),
        },
      });
    } catch (err) {
      console.error("Start interview failed:", err);
      setError("Unable to start interview.");
      setStatus("Failed to start");
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async (autoEnded = false) => {
    try {
      setStatus(autoEnded ? "Time window complete" : "Ending session");

      if (!vapiRef.current) return;

      await vapiRef.current.say(
        autoEnded
          ? "Our interview time is over. Thank you. Ending the session now."
          : "Ending the interview now. Thank you.",
        true
      );

      await vapiRef.current.stop();
    } catch {
      await vapiRef.current?.stop();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    vapiRef.current?.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,176,32,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(24,214,195,0.16),transparent_24%),radial-gradient(circle_at_bottom,rgba(48,88,191,0.2),transparent_36%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[72px_72px] opacity-25" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,22,42,0.96),rgba(9,16,28,0.85))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.34)] sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_360px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  <Radio className="h-3.5 w-3.5" />
                  Live AI Interview Studio
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]",
                    isOnline
                      ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                      : "border-rose-300/20 bg-rose-500/10 text-rose-200"
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isOnline ? "bg-emerald-300" : "bg-rose-300"
                    )}
                  />
                  {isOnline ? "Network Ready" : "Offline"}
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Turn mock interviews into a premium live demo experience.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Configure the session, launch the AI interviewer, watch the
                conversation unfold in real time, and walk away with analysis
                that feels polished enough to showcase.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {quickStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-cyan-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Session Status
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    {status}
                  </h2>
                </div>
                <div
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
                    statusTone
                  )}
                >
                  {isAnalyzing
                    ? "Analyzing"
                    : isInterviewStarted
                      ? "Live"
                      : error
                        ? "Attention"
                        : "Standby"}
                </div>
              </div>

              <div className="mt-5 rounded-[26px] border border-cyan-300/15 bg-[#071629] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                      Remaining Time
                    </p>
                    <div className="mt-2 text-5xl font-black tracking-[-0.05em] text-white">
                      {formattedTime}
                    </div>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-200">
                    <Clock3 className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#0fd7c7,#ffd166)] transition-all duration-300"
                    style={{ width: `${Math.max(8, Math.min(100, normalizedVolume))}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                  <span>Voice activity</span>
                  <span>{Math.round(normalizedVolume)}%</span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {readinessChecklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,21,37,0.96),rgba(8,15,27,0.92))] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                    Interview Setup
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-white">
                    Build the session
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Shape the exact interview experience before you go live.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                  <WandSparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as RoleOption)}
                    disabled={sessionLocked}
                    className="w-full rounded-2xl border border-white/10 bg-[#091627] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {ROLE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {TYPE_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setInterviewType(item)}
                        disabled={sessionLocked}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left transition",
                          interviewType === item
                            ? "border-cyan-300/35 bg-cyan-400/12 text-white"
                            : "border-white/10 bg-[#091627] text-slate-300 hover:border-white/20 hover:bg-white/6",
                          sessionLocked && "cursor-not-allowed opacity-60"
                        )}
                      >
                        <div className="text-sm font-semibold">{item}</div>
                        <div className="mt-1 text-xs text-white/45">
                          {item === "Technical"
                            ? "Depth, implementation, and engineering trade-offs."
                            : item === "Behavioral"
                              ? "Stories, communication, and leadership signal."
                              : "A blended session across technical and soft-skill pressure."}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {DIFFICULTY_LEVELS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setDifficulty(item)}
                        disabled={sessionLocked}
                        className={cn(
                          "rounded-2xl border px-3 py-3 text-sm font-semibold transition",
                          difficulty === item
                            ? "border-amber-300/35 bg-amber-400/12 text-amber-100"
                            : "border-white/10 bg-[#091627] text-slate-300 hover:border-white/20 hover:bg-white/6",
                          sessionLocked && "cursor-not-allowed opacity-60"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {DURATION_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setDuration(item)}
                        disabled={sessionLocked}
                        className={cn(
                          "rounded-2xl border px-3 py-3 text-sm font-semibold transition",
                          duration === item
                            ? "border-cyan-300/35 bg-[linear-gradient(135deg,rgba(15,215,199,0.22),rgba(255,209,102,0.16))] text-white"
                            : "border-white/10 bg-[#091627] text-slate-300 hover:border-white/20 hover:bg-white/6",
                          sessionLocked && "cursor-not-allowed opacity-60"
                        )}
                      >
                        {item}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,209,102,0.12),rgba(15,215,199,0.08))] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/80">
                  Presentation Tip
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Use structured answers, state your assumptions, and narrate
                  trade-offs clearly. This screen is optimized to make that flow
                  look intentional during a showcase.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                {!isInterviewStarted ? (
                  <button
                    onClick={startInterview}
                    disabled={loading || isAnalyzing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0fd7c7,#ffd166)] px-5 py-4 text-sm font-bold text-[#08111d] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Mic className="h-4 w-4" />
                    {loading ? "Starting session..." : "Start Interview"}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={toggleMute}
                      disabled={isAnalyzing}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#091627] px-5 py-4 text-sm font-bold text-white transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isMuted ? (
                        <>
                          <Mic className="h-4 w-4" />
                          Unmute
                        </>
                      ) : (
                        <>
                          <MicOff className="h-4 w-4" />
                          Mute
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => endInterview(false)}
                      disabled={isAnalyzing}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6b6b] px-5 py-4 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      End Session
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
                  {error}
                </div>
              )}
            </div>
          </section>

          <section className="grid min-w-0 gap-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,21,37,0.96),rgba(8,15,27,0.92))] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      Live Command Deck
                    </p>
                    <h2 className="mt-3 text-3xl font-black text-white">
                      Control the room
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                      Everything happening in the interview is visible at a
                      glance, from assistant state to volume response to current
                      session configuration.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    {transcriptItems.length} transcript messages captured
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Assistant
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {isAssistantSpeaking ? "Speaking" : "Listening"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Audio
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {isMuted ? "Muted" : "Open"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Difficulty
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {difficulty}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Timer
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {formattedTime}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-[#081422] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Voice response meter
                        </p>
                        <p className="text-xs text-white/45">
                          Tracks live signal intensity from the conversation.
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-cyan-200">
                      {Math.round(normalizedVolume)}%
                    </span>
                  </div>

                  <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#0fd7c7,#34d399,#ffd166)] transition-all duration-200"
                      style={{ width: `${normalizedVolume}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,26,42,0.98),rgba(10,18,31,0.92))] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200/80">
                  Interviewer Presence
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(15,215,199,0.22),rgba(7,17,31,0.2)_65%)]">
                    <div
                      className={cn(
                        "absolute inset-3 rounded-full border transition duration-300",
                        isAssistantSpeaking
                          ? "animate-pulse border-cyan-300/60"
                          : "border-white/10"
                      )}
                    />
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,209,102,0.2),rgba(15,215,199,0.08),rgba(59,130,246,0.16),rgba(255,209,102,0.2))]" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#081522] text-white">
                      <Sparkles className="h-10 w-10 text-cyan-200" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-black text-white">
                    AI Interviewer
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {isAssistantSpeaking
                      ? "Speaking now. Let it finish before jumping in."
                      : "Ready for your next answer. Keep it structured and crisp."}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-amber-300/15 bg-amber-400/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/80">
                    Showcase Prompt
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Answer with context, decision, and trade-off. That pattern
                    makes the live demo feel much more intentional.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,21,37,0.96),rgba(8,15,27,0.92))] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                    Live Transcript
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-white">
                    Conversation stream
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Real-time dialogue appears here with clear speaker framing so
                    the session reads well during demos and reviews.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  {transcriptItems.length === 0
                    ? "Awaiting first message"
                    : `${transcriptItems.length} messages live`}
                </div>
              </div>

              <div className="mt-6 h-[30rem] overflow-y-auto pr-1 sm:h-[38rem]">
                {transcriptItems.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#081422] p-8 text-center">
                    <div className="max-w-md">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                        <Radio className="h-7 w-7" />
                      </div>
                      <h3 className="mt-5 text-2xl font-black text-white">
                        Ready for the first exchange
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Once the call starts, the transcript will populate here
                        in real time with interviewer and candidate messages.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transcriptItems.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "max-w-[94%] rounded-[26px] border px-5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.14)] sm:max-w-[84%]",
                          item.role === "assistant"
                            ? "border-cyan-300/18 bg-[linear-gradient(135deg,rgba(15,215,199,0.14),rgba(15,215,199,0.05))]"
                            : "ml-auto border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]"
                        )}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                              item.role === "assistant"
                                ? "bg-cyan-400/12 text-cyan-200"
                                : "bg-white/8 text-slate-200"
                            )}
                          >
                            {item.role === "assistant"
                              ? "Interviewer"
                              : "Candidate"}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-white/88 sm:text-[15px]">
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
      </div>
    </main>
  );
}
