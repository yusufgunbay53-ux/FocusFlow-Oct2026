"use client";

import { Task, Status, Priority } from "@/lib/types";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";

const COLUMNS: { id: Status; title: string }[] = [
  { id: "todo", title: "Yapılacaklar" },
  { id: "inprogress", title: "Yapılıyor" },
  { id: "done", title: "Tamamlandı" },
];

const priorityColors: Record<Priority, string> = {
  low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const priorityLabels: Record<Priority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

function TaskCard({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-xl p-3 mb-2 border border-slate-700/50 hover:border-cyan-500/40 transition-all group"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-slate-500 hover:text-cyan-400 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              task.status === "done" ? "line-through text-slate-500" : ""
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}
            >
              {priorityLabels[task.priority]}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function KanbanBoard({
  tasks,
  onMove,
  onUpdate,
  onDelete,
}: {
  tasks: Task[];
  onMove: (id: string, status: Status) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    let newStatus: Status | null = null;

    // Dropped on a column
    if (COLUMNS.some((c) => c.id === over.id)) {
      newStatus = over.id as Status;
    } else {
      // Dropped on a task — find its column
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus) {
      onMove(taskId, newStatus);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="glass rounded-2xl p-3 min-h-[280px]">
              <h3 className="text-sm font-semibold mb-3 px-1 flex items-center justify-between">
                <span>{col.title}</span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                  {colTasks.length}
                </span>
              </h3>
              <SortableContext
                id={col.id}
                items={colTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  id={col.id}
                  className="min-h-[200px] space-y-1"
                  data-status={col.id}
                >
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
