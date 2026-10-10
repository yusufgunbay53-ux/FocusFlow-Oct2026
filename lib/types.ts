export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "inprogress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  createdAt: number;
  completedAt?: number;
}

export interface PomodoroSession {
  id: string;
  type: "work" | "break";
  duration: number; // seconds
  completedAt: number;
}

export interface AppState {
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
  stats: {
    tasksCompletedToday: number;
    pomodorosToday: number;
  };
}
