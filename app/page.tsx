"use client";

import { useEffect, useState } from "react";
import { AppState, Task, Status, Priority } from "@/lib/types";
import { loadState, saveState, generateId } from "@/lib/storage";
import KanbanBoard from "@/components/KanbanBoard";
import PomodoroTimer from "@/components/PomodoroTimer";
import AmbientPlayer from "@/components/AmbientPlayer";
import AICoach from "@/components/AICoach";
import { Plus, Zap } from "lucide-react";

export default function Home() {
  const [state, setState] = useState<AppState>({
    tasks: [],
    pomodoroSessions: [],
    stats: { tasksCompletedToday: 0, pomodorosToday: 0 },
  });
  const [mounted, setMounted] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");

  useEffect(() => {
    setState(loadState());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveState(state);
  }, [state, mounted]);

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: generateId(),
      title: newTitle.trim(),
      priority: newPriority,
      status: "todo",
      createdAt: Date.now(),
    };
    setState((s) => ({ ...s, tasks: [task, ...s.tasks] }));
    setNewTitle("");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTask = (id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  };

  const moveTask = (id: string, status: Status) => {
    setState((s) => {
      const tasks = s.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completedAt: status === "done" ? Date.now() : undefined,
            }
          : t
      );
      const completedToday = tasks.filter(
        (t) =>
          t.status === "done" &&
          t.completedAt &&
          new Date(t.completedAt).toDateString() === new Date().toDateString()
      ).length;
      return {
        ...s,
        tasks,
        stats: { ...s.stats, tasksCompletedToday: completedToday },
      };
    });
  };

  const recordPomodoro = (type: "work" | "break", duration: number) => {
    setState((s) => {
      const session = {
        id: generateId(),
        type,
        duration,
        completedAt: Date.now(),
      };
      const today = new Date().toDateString();
      const pomodorosToday = [
        ...s.pomodoroSessions,
        session,
      ].filter(
        (p) =>
          p.type === "work" &&
          new Date(p.completedAt).toDateString() === today
      ).length;
      return {
        ...s,
        pomodoroSessions: [...s.pomodoroSessions, session],
        stats: { ...s.stats, pomodorosToday },
      };
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b111e] text-slate-100">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Focus<span className="text-cyan-400">Flow</span>
              </h1>
              <p className="text-xs text-slate-400">AI Destekli Odaklanma Asistanı</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <span className="text-slate-300">
              Bugün: <strong className="text-cyan-400">{state.stats.tasksCompletedToday}</strong> görev
            </span>
            <span className="text-slate-300">
              Pomodoro: <strong className="text-cyan-400">{state.stats.pomodorosToday}</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Add Task + Kanban */}
        <section className="lg:col-span-8 space-y-4">
          {/* Add Task */}
          <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Yeni görev ekle..."
              className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Priority)}
              className="bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:outline-none"
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
            <button
              onClick={addTask}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl px-5 py-3 transition-all hover:shadow-lg hover:shadow-cyan-500/30"
            >
              <Plus className="w-4 h-4" />
              Ekle
            </button>
          </div>

          <KanbanBoard
            tasks={state.tasks}
            onMove={moveTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </section>

        {/* Right: Pomodoro + Ambient + AI */}
        <aside className="lg:col-span-4 space-y-4">
          <PomodoroTimer onComplete={recordPomodoro} />
          <AmbientPlayer />
          <AICoach
            tasksCompleted={state.stats.tasksCompletedToday}
            pomodoros={state.stats.pomodorosToday}
            totalTasks={state.tasks.length}
          />
        </aside>
      </main>
    </div>
  );
}
