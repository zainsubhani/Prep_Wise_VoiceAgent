"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";
import {
  RoleOption,
  InterviewType,
  Difficulty,
  ROLE_OPTIONS,
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
const DIFFICULTY_OPTIONS: Difficulty[] = ["Easy", "Medium", "Hard"];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

type AnalyzeResponse = {
  error?: string;
  interviewId?: string;
};

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
  const [status, setStatus] = useState("Ready");
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

  const analyzeAndSave = async () => {
    try {
      setStatus("Analyzing interview...");
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
        userId: "demo-user-id", // replace with your real logged-in user id
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
  };

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setStatus("Call started");
      setIsInterviewStarted(true);
      setIsInterviewEnded(false);
      setError(null);
    });

    vapi.on("call-end", () => {
      setStatus("Call ended");
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
      setStatus("Error");
      setIsInterviewStarted(false);
      setIsAssistantSpeaking(false);
    });

    return () => {
      try {
        vapi.stop();
      } catch {}

      vapiRef.current = null;
    };
  }, [router, role, interviewType, difficulty, duration]);

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

      setStatus("Connecting...");
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
      setStatus(autoEnded ? "Time is up" : "Ending...");

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
    <main className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Network
                </p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    isOnline ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  isOnline ? "bg-green-400" : "bg-red-400"
                }`}
              />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
              Live AI Interview
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Take Interview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Launch a voice interview, stream the transcript live, and generate
              AI feedback at the end.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <section className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
              <h2 className="text-lg font-semibold sm:text-xl">
                Interview Setup
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Select the role, format, difficulty, and duration.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as RoleOption)}
                    disabled={isInterviewStarted || isAnalyzing}
                    className="w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-sm outline-none transition focus:border-cyan-400/40"
                  >
                    {ROLE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Interview Type
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) =>
                      setInterviewType(e.target.value as InterviewType)
                    }
                    disabled={isInterviewStarted || isAnalyzing}
                    className="w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-sm outline-none transition focus:border-cyan-400/40"
                  >
                    {TYPE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as Difficulty)
                    }
                    disabled={isInterviewStarted || isAnalyzing}
                    className="w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 text-sm outline-none transition focus:border-cyan-400/40"
                  >
                    {DIFFICULTY_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {DURATION_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setDuration(item)}
                        disabled={isInterviewStarted || isAnalyzing}
                        className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          duration === item
                            ? "bg-cyan-400 text-black"
                            : "border border-white/10 bg-[#081120] text-white/70 hover:bg-white/10"
                        } ${
                          isInterviewStarted || isAnalyzing ? "opacity-50" : ""
                        }`}
                      >
                        {item}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm text-cyan-300">Timer</p>
                <h3 className="mt-2 text-3xl font-bold sm:text-4xl">
                  {formattedTime}
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  Max interview length: {duration} minutes
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {!isInterviewStarted ? (
                  <button
                    onClick={startInterview}
                    disabled={loading || isAnalyzing}
                    className="w-full rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                  >
                    {loading ? "Starting..." : "Start Interview"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleMute}
                      disabled={isAnalyzing}
                      className="w-full rounded-2xl border border-white/10 bg-[#081120] px-5 py-3 font-semibold transition hover:bg-white/10 disabled:opacity-60 sm:flex-1"
                    >
                      {isMuted ? "Unmute" : "Mute"}
                    </button>
                    <button
                      onClick={() => endInterview(false)}
                      disabled={isAnalyzing}
                      className="w-full rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:flex-1"
                    >
                      End
                    </button>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>
          </section>

          <section className="grid min-w-0 gap-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-white/50">Current Status</p>
                    <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
                      {status}
                    </h2>
                  </div>

                  <div className="w-full rounded-2xl border border-white/10 bg-[#081120] px-4 py-3 sm:w-auto">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Assistant
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {isAssistantSpeaking ? "Speaking" : "Listening"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm text-white/50">Voice Activity</p>
                    <p className="text-xs text-white/40">
                      {Math.round(normalizedVolume)}%
                    </p>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all duration-200"
                      style={{ width: `${normalizedVolume}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#081120] p-4">
                    <p className="text-sm text-white/50">Role</p>
                    <p className="mt-1 text-sm font-medium sm:text-base">
                      {role}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#081120] p-4">
                    <p className="text-sm text-white/50">Type</p>
                    <p className="mt-1 text-sm font-medium sm:text-base">
                      {interviewType}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#081120] p-4 sm:col-span-2 xl:col-span-1">
                    <p className="text-sm text-white/50">Difficulty</p>
                    <p className="mt-1 text-sm font-medium sm:text-base">
                      {difficulty}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Interview Panel
                </p>

                <div className="mt-5 flex items-center justify-center">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 sm:h-36 sm:w-36">
                    <div className="absolute inset-0 animate-pulse rounded-full border border-cyan-400/20" />
                    <div className="text-center">
                      <div className="mx-auto h-8 w-8 rounded-full bg-cyan-400/80 sm:h-10 sm:w-10" />
                      <p className="mt-3 text-sm text-white/70">
                        AI Interviewer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                  <p className="text-sm font-medium text-amber-300">
                    Live Tip
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Keep answers structured. Use concise reasoning, examples,
                    and trade-offs.
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold sm:text-xl">
                    Live Transcript
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Real-time conversation stream from the interview.
                  </p>
                </div>

                <div className="w-fit rounded-xl border border-white/10 bg-[#081120] px-3 py-2 text-sm text-white/60">
                  {transcriptItems.length} messages
                </div>
              </div>

              <div className="mt-5 h-90 overflow-y-auto pr-1 sm:h-105 lg:h-125">
                {transcriptItems.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
                    The transcript will appear here once the call starts.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transcriptItems.map((item) => (
                      <div
                        key={item.id}
                        className={`max-w-[92%] rounded-2xl px-4 py-3 sm:max-w-[85%] ${
                          item.role === "assistant"
                            ? "border border-cyan-400/20 bg-cyan-400/10"
                            : "ml-auto border border-white/10 bg-white/5"
                        }`}
                      >
                        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/40">
                          {item.role === "assistant"
                            ? "Interviewer"
                            : "Candidate"}
                        </p>
                        <p className="text-sm leading-6 text-white/85">
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