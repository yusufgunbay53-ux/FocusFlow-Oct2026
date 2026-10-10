"use client";

import { useMemo } from "react";
import { Sparkles, MessageCircle } from "lucide-react";

export default function AICoach({
  tasksCompleted,
  pomodoros,
  totalTasks,
}: {
  tasksCompleted: number;
  pomodoros: number;
  totalTasks: number;
}) {
  const message = useMemo(() => {
    if (pomodoros >= 4 && tasksCompleted >= 3) {
      return "Bugün harika gidiyorsun! 🚀 Bu tempoyu koru, büyük işler başaracaksın.";
    }
    if (pomodoros >= 2 && tasksCompleted === 0) {
      return "Odaklanıyorsun ama henüz görev tamamlamadın. Bir sonraki Pomodoro'da küçük bir adım at!";
    }
    if (tasksCompleted >= 5) {
      return "Mükemmel tempo! Biraz yavaşlamak ister misin? 5 dakika mola vermek ister misin?";
    }
    if (pomodoros === 0 && totalTasks > 0) {
      return "Görevlerin hazır. Bir Pomodoro başlatıp odaklanmaya başlayabilirsin!";
    }
    if (pomodoros >= 1 && tasksCompleted < 2) {
      return "Biraz yavaşladın. Kısa bir mola verip tekrar odaklanmayı dene.";
    }
    return "Hazır mısın? Görevlerini planla ve ilk Pomodoro'yu başlat!";
  }, [tasksCompleted, pomodoros, totalTasks]);

  return (
    <div className="glass rounded-2xl p-4 border border-cyan-500/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold">AI Performans Koçu</p>
          <p className="text-[10px] text-slate-400">Bugünkü verilerine göre</p>
        </div>
      </div>
      <div className="flex gap-2">
        <MessageCircle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="text-sm text-slate-200 leading-relaxed">{message}</p>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-700/50 text-[11px] text-slate-500">
        Mock AI • Gerçek API için hazır yapı
      </div>
    </div>
  );
}
