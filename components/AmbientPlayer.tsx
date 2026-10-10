"use client";

import { useState, useRef, useEffect } from "react";
import { CloudRain, Music, Volume2, VolumeX } from "lucide-react";

// Free ambient sound URLs (public domain / royalty free examples)
const SOUNDS = {
  rain: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_2dde668d05.mp3?filename=rain-sound-188158.mp3",
  lofi: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_d1718ab41b.mp3?filename=lofi-study-112191.mp3",
};

export default function AmbientPlayer() {
  const [active, setActive] = useState<"rain" | "lofi" | null>(null);
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    const audio = audioRef.current;
    audio.volume = muted ? 0 : volume;

    if (active) {
      audio.src = SOUNDS[active];
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [active, volume, muted]);

  const toggle = (type: "rain" | "lofi") => {
    setActive((prev) => (prev === type ? null : type));
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Ortam Sesi</span>
        <button
          onClick={() => setMuted((m) => !m)}
          className="text-slate-400 hover:text-cyan-400"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => toggle("rain")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs transition ${
            active === "rain"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-800/60 hover:bg-slate-700"
          }`}
        >
          <CloudRain className="w-4 h-4" />
          Yağmur
        </button>
        <button
          onClick={() => toggle("lofi")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs transition ${
            active === "lofi"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-800/60 hover:bg-slate-700"
          }`}
        >
          <Music className="w-4 h-4" />
          Lo-Fi
        </button>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={muted ? 0 : volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-full accent-cyan-400"
      />
    </div>
  );
}
