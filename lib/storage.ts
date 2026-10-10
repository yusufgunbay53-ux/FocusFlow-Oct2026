import { AppState } from "./types";

const STORAGE_KEY = "focusflow-state";

const defaultState: AppState = {
  tasks: [],
  pomodoroSessions: [],
  stats: {
    tasksCompletedToday: 0,
    pomodorosToday: 0,
  },
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...defaultState,
      ...parsed,
      tasks: parsed.tasks || [],
      pomodoroSessions: parsed.pomodoroSessions || [],
      stats: { ...defaultState.stats, ...parsed.stats },
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}
