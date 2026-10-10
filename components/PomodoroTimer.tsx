"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, Bell } from "lucide-react";

const WORK = 25 * 60;
const BREAK = 5 * 60;

export default function PomodoroTimer({
  onComplete,
}: {
  onComplete: (type: "work" | "break", duration: number) => void;
}) {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(WORK);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Simple notification sound using Web Audio API beep
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
    );
  }, []);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, timeLeft]);

  const handleComplete = () => {
    setRunning(false);
    onComplete(mode, mode === "work" ? WORK : BREAK);
    // Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("FocusFlow", {
        body: mode === "work" ? "Çalışma süresi bitti! Mola zamanı 🎉" : "Mola bitti. Odaklanma zamanı!",
      });
    }
    // Sound
    try {
      audioRef.current?.play().catch(() => {});
    } catch {}
    // Switch mode
    const next = mode === "work" ? "break" : "work";
    setMode(next);
    setTimeLeft(next === "work" ? WORK : BREAK);
  };

  const toggle = () => {
    if (!running && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    setTimeLeft(mode === "work" ? WORK : BREAK);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="glass rounded-2xl p-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-cyan-400" />
        <span className="text-xs uppercase tracking-wider text-slate-400">
          {mode === "work" ? "Odaklanma" : "Mola"}
        </span>
      </div>
      <div className="text-5xl font-mono font-bold text-cyan-400 mb-4 tabular-nums">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={toggle}
          className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition hover:shadow-lg hover:shadow-cyan-500/40"
        >
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button
          onClick={reset}
          className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4 flex justify-center gap-2 text-xs">
        <button
          onClick={() => {
            setRunning(false);
            setMode("work");
            setTimeLeft(WORK);
          }}
          className={`px-3 py-1 rounded-full ${mode === "work" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-500"}`}
        >
          25 dk
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setMode("break");
            setTimeLeft(BREAK);
          }}
          className={`px-3 py-1 rounded-full ${mode === "break" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-500"}`}
        >
          5 dk
        </button>
      </div>
    </div>
  );
}
