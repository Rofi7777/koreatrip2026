"use client";

import { useState, useEffect } from "react";
import type { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { EditTaskModal } from "./EditTaskModal";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("/api/tasks", {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const json = await res.json();

      if (!res.ok) {
        // If table doesn't exist, just show empty state instead of error
        if (json.message?.includes("Could not find the table") || json.message?.includes("relation")) {
          console.warn("[TaskList] Table does not exist, showing empty state");
          setTasks([]);
          setLoading(false);
          return;
        }
        throw new Error(json.message ?? "Failed to load tasks.");
      }

      setTasks(json.data ?? []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request timeout. Please check your connection.");
      } else {
        setError("Failed to load tasks.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsCreating(false);
  };

  const handleAddNewClick = () => {
    setEditingTask(null);
    setIsCreating(true);
  };

  const handleSave = async (
    updates: {
      id?: Task["id"];
      language: "vi" | "zh-TW";
      title: string;
      description: string;
      autoTranslate: boolean;
    } & Partial<Task>
  ) => {
    const isCreate = !updates.id;
    setSaving(true);

    try {
      const res = await fetch("/api/tasks", {
        method: isCreate ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? `Failed to ${isCreate ? "create" : "update"} task.`);
      }

      // Refresh the list
      await fetchTasks();
      setEditingTask(null);
      setIsCreating(false);
      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
      throw err;
    }
  };

  const handleDelete = async (id: Task["id"]) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? "Failed to delete task.");
      }

      // Refresh the list
      await fetchTasks();
      setEditingTask(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleAddNewClick}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#6D28D9] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#5B21B6] transition-colors"
        >
          <i className="fas fa-plus text-[10px]" />
          Add Task
        </button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={handleEditClick} />
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full text-sm text-gray-500 text-center py-8">
            No tasks yet. Click "Add Task" to create one.
          </div>
        )}
      </div>

      {(editingTask !== null || isCreating) && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            if (!saving) {
              setEditingTask(null);
              setIsCreating(false);
            }
          }}
          onSave={handleSave}
          onDelete={editingTask ? handleDelete : undefined}
        />
      )}
    </>
  );
}


