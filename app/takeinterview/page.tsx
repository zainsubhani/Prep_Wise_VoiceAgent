"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { LiveInterviewWindowState } from "@/types/live-interview-window";
import {
  BriefcaseBusiness,
  Clock3,
  MonitorUp,
  Radio,
  Target,
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
const LIVE_WINDOW_CHANNEL = "live-interview-window";
const LIVE_WINDOW_STORAGE_KEY = "live-interview-window-state";

type AnalyzeResponse = {
  error?: string;
  interviewId?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function TakeInterviewPage() {
  const router = useRouter();
  const { user } = useAuth();

  const vapiRef = useRef<Vapi | null>(null);
  const liveWindowRef = useRef<Window | null>(null);
  const liveChannelRef = useRef<BroadcastChannel | null>(null);
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
  const [liveWindowBlocked, setLiveWindowBlocked] = useState(false);

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
    {
      label: "Focus Level",
      value: difficulty,
      icon: Target,
    },
  ];

  const readinessChecklist = [
    isOnline ? "Stable connection detected" : "Reconnect before starting",
    user ? "Authenticated session detected" : "Sign in required for saved feedback",
    isMuted ? "Microphone muted" : "Microphone available",
    isAssistantSpeaking ? "AI interviewer is talking" : "AI interviewer is listening",
  ];

  const publishLiveWindowState = useCallback(
    (overrides: Partial<LiveInterviewWindowState> = {}) => {
      const state: LiveInterviewWindowState = {
        isOpen: isInterviewStarted,
        role,
        interviewType,
        difficulty,
        duration,
        formattedTime,
        status,
        isMuted,
        isAssistantSpeaking,
        normalizedVolume,
        transcriptItems,
        userName: user?.displayName || user?.email || "Candidate",
        ...overrides,
      };

      if (typeof window !== "undefined") {
        window.localStorage.setItem(LIVE_WINDOW_STORAGE_KEY, JSON.stringify(state));
      }

      liveChannelRef.current?.postMessage(state);
    },
    [
      difficulty,
      duration,
      formattedTime,
      interviewType,
      isAssistantSpeaking,
      isInterviewStarted,
      isMuted,
      normalizedVolume,
      role,
      status,
      transcriptItems,
      user,
    ]
  );

  const closeLiveWindow = useCallback(() => {
    publishLiveWindowState({ isOpen: false });
    liveWindowRef.current?.close();
    liveWindowRef.current = null;
  }, [publishLiveWindowState]);

  const openLiveWindow = useCallback(() => {
    if (typeof window === "undefined") return;

    if (liveWindowRef.current && !liveWindowRef.current.closed) {
      liveWindowRef.current.focus();
      setLiveWindowBlocked(false);
      return;
    }

    const popup = window.open(
      "/takeinterview/live",
      "live-interview-window",
      "popup=yes,width=1480,height=920,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes"
    );

    if (!popup) {
      setLiveWindowBlocked(true);
      setError("Please allow popups so the live interview window can open.");
      return;
    }

    liveWindowRef.current = popup;
    setLiveWindowBlocked(false);
    popup.focus();

    window.setTimeout(() => {
      publishLiveWindowState({ isOpen: true });
    }, 250);
  }, [publishLiveWindowState]);

  useEffect(() => {
    const channel = new BroadcastChannel(LIVE_WINDOW_CHANNEL);
    liveChannelRef.current = channel;

    return () => {
      channel.close();
      liveChannelRef.current = null;
      closeLiveWindow();
    };
  }, [closeLiveWindow]);

  useEffect(() => {
    publishLiveWindowState();
  }, [publishLiveWindowState]);

  useEffect(() => {
    if (!isInterviewStarted) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isInterviewStarted]);

  const endInterview = useCallback(async (autoEnded = false) => {
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
    } finally {
      closeLiveWindow();
    }
  }, [closeLiveWindow]);

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
  }, [endInterview, isInterviewEnded, isInterviewStarted]);

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
        userId: user?.uid,
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
  }, [difficulty, duration, interviewType, role, router, user]);

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
      closeLiveWindow();

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
      closeLiveWindow();
    });

    return () => {
      try {
        vapi.stop();
      } catch {}

      vapiRef.current = null;
    };
  }, [analyzeAndSave, closeLiveWindow, difficulty, duration, interviewType, role, router]);

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

      if (!user) {
        setError("Sign in to start an interview and save your personal results.");
        setStatus("Authentication required");
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
      openLiveWindow();

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
      closeLiveWindow();
    } finally {
      setLoading(false);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    vapiRef.current?.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(202,197,254,0.12),transparent_22%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-sm border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
              <Radio className="h-3.5 w-3.5" />
              Live AI Interview
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-xs uppercase tracking-[0.24em]",
                isOnline
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-rose-400/20 bg-rose-500/10 text-rose-200"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  isOnline ? "bg-emerald-300" : "bg-rose-300"
                )}
              />
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Take Interview
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/60">
            Configure your session on the left and monitor the live interview on
            the right. The layout follows the same dark and cyan visual system
            already used across your project.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#0a1022]/90 p-6 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
                    Interview Setup
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-white">
                    Session Control
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <WandSparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as RoleOption)}
                    disabled={sessionLocked}
                    className="w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 disabled:opacity-60"
                  >
                    {ROLE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45">
                    Interview Type
                  </label>
                  <div className="grid gap-2">
                    {TYPE_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setInterviewType(item)}
                        disabled={sessionLocked}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left transition",
                          interviewType === item
                            ? "border-cyan-400/30 bg-cyan-400/10 text-white"
                            : "border-white/10 bg-[#081120] text-white/70 hover:border-cyan-400/20 hover:text-white",
                          sessionLocked && "opacity-60"
                        )}
                      >
                        <div className="text-sm font-semibold">{item}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45">
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
                            ? "border-cyan-400/30 bg-cyan-400/10 text-white"
                            : "border-white/10 bg-[#081120] text-white/70 hover:border-cyan-400/20 hover:text-white",
                          sessionLocked && "opacity-60"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45">
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
                            ? "border-cyan-400/30 bg-cyan-400/10 text-white"
                            : "border-white/10 bg-[#081120] text-white/70 hover:border-cyan-400/20 hover:text-white",
                          sessionLocked && "opacity-60"
                        )}
                      >
                        {item}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {!isInterviewStarted ? (
                  <button
                    onClick={startInterview}
                    disabled={loading || isAnalyzing}
                    className="rounded-sm bg-cyan-400 px-8 py-4 text-sm uppercase tracking-[0.18em] text-black transition hover:bg-cyan-300 disabled:opacity-60"
                  >
                    {loading ? "Starting Session..." : "Start Interview"}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={toggleMute}
                      disabled={isAnalyzing}
                      className="rounded-sm border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.18em] text-white transition hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-60"
                    >
                      {isMuted ? "Unmute" : "Mute"}
                    </button>
                    <button
                      onClick={() => endInterview(false)}
                      disabled={isAnalyzing}
                      className="rounded-sm bg-cyan-400 px-8 py-4 text-sm uppercase tracking-[0.18em] text-black transition hover:bg-cyan-300 disabled:opacity-60"
                    >
                      End Session
                    </button>
                  </div>
                )}
              </div>

              {liveWindowBlocked && (
                <div className="mt-4 rounded-2xl border border-[#cac5fe]/20 bg-[#cac5fe]/10 p-4 text-sm text-[#dddfff]">
                  Popup access is blocked. Allow popups if you want the live
                  interview window to open.
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                  {error}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0a1022]/90 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
                Session Summary
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {quickStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-[#081120] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/40">
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
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#0a1022]/90 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
                    Live Monitor
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-white">
                    Interview Status
                  </h2>
                </div>
                <div
                  className={cn(
                    "w-fit rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
                    statusTone
                  )}
                >
                  {isAnalyzing
                    ? "Analyzing"
                    : isInterviewStarted
                      ? "Live"
                      : error
                        ? "Attention"
                        : "Ready"}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#081120] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Current Status
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {status}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#081120] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Time Left
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {formattedTime}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#081120] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Assistant
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {isAssistantSpeaking ? "Speaking" : "Listening"}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#081120] p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <Volume2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Voice Activity
                    </p>
                  </div>
                  <span className="text-sm text-cyan-300">
                    {Math.round(normalizedVolume)}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-200"
                    style={{ width: `${normalizedVolume}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {readinessChecklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-sm text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0a1022]/90 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">
                    Live Transcript
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-white">
                    Conversation Stream
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#081120] px-4 py-2 text-sm text-white/60">
                  {transcriptItems.length} messages
                </div>
              </div>

              <div className="mt-6 h-[34rem] overflow-y-auto pr-1">
                {transcriptItems.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#081120] p-8 text-center">
                    <div className="max-w-md">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                        <MonitorUp className="h-7 w-7" />
                      </div>
                      <h3 className="mt-5 text-2xl font-black text-white">
                        Ready to begin
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-white/45">
                        Start the interview and the transcript will appear here
                        in real time.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transcriptItems.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "max-w-[90%] rounded-2xl border px-4 py-4",
                          item.role === "assistant"
                            ? "border-cyan-400/20 bg-cyan-400/10"
                            : "ml-auto border-white/10 bg-white/5"
                        )}
                      >
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
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
      </div>
    </main>
  );
}
