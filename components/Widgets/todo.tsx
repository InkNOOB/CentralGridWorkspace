"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Todo({ boardId }: { boardId: number }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showBox, setShowBox] = useState(false);
  const [taskInput, setTaskInput] = useState("");

  // LOAD TODO
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await fetch(`/api/board/${boardId}/todo`);
        const data = await res.json();
        setTasks(data || []);
      } catch (error) {
        console.error("Failed to load todos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [boardId]);

  // ADD OR REMOVE TASK
  const handleAddRemoveTask = async () => {
    const trimmedTask = taskInput.trim();
    if (!trimmedTask) return;

    try {
      const res = await fetch(`/api/board/${boardId}/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmedTask }),
      });
      
      const data = await res.json();

      if (data.action === "removed") {
        setTasks((prev) =>
          prev.filter((task) => task.text.toLowerCase() !== trimmedTask.toLowerCase())
        );
      } else if (data.action === "added") {
        setTasks((prev) => [...prev, data.task]);
      }
    } catch (error) {
      console.error("Failed to add/remove task:", error);
    }

    setTaskInput("");
    setShowBox(false);
  };

  // TOGGLE CHECKBOX
  const toggleTask = async (id: number) => {
    const taskToToggle = tasks.find((t) => t.id === id);
    if (!taskToToggle) return;
    const newCompletedStatus = !taskToToggle.completed;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: newCompletedStatus } : task
      )
    );

    try {
      await fetch(`/api/board/${boardId}/todo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: newCompletedStatus }),
      });
    } catch (error) {
      console.error("Failed to toggle task:", error);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !newCompletedStatus } : task
        )
      );
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e6e6ff",
        borderRadius: "12px",
        padding: "16px",
        maxWidth: "500px",
        minWidth: "500px",
        height: "98mm", 
        boxShadow: "-5px 8px 6px rgba(0, 0, 0, 0.16)",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p
        style={{
          fontSize: "1.15rem",
          fontWeight: "600",
          color: "#0f172a",
          margin: "0 0 12px 0",
        }}
      >
        TO DO LIST
      </p>

      {/* TASK LIST WRAPPER CONTAINER */}
      <div
        style={{
          border: "1px solid #dcdcdc",
          borderRadius: "8px",
          padding: "10px",
          flexGrow: 1,
          overflowY: "auto", 
          fontSize: "1.1rem",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          justifyContent: (loading || tasks.length === 0) ? "center" : "flex-start", 
        }}
      >
        {loading ? (
  
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "12px", fontSize: "0.9rem", fontStyle: "italic" }}>
              There is nothing left to do.
            </p>
          </div>
        ) : (
          /* ACTIVE ITEMS */
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 0",
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{
                  transform: "scale(1.2)",
                  cursor: "pointer",
                }}
              />

              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#94a3b8" : "#334155",
                  transition: "color 0.2s, text-decoration 0.2s",
                  fontSize: "0.95rem",
                  wordBreak: "break-word",
                }}
              >
                {task.text}
              </span>
            </div>
          ))
        )}
      </div>

      {/* FOOTER INTERACTION LAYER */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => setShowBox(!showBox)}
          disabled={loading}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: showBox ? "#f74e4eff" : "#f8fafc",
            color: showBox ? "#ffffffff" : "#475569",
            fontWeight: "600",
            fontSize: "0.85rem",
            transition: "background 0.2s",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {showBox ? "Cancel" : "Add / Remove Task"}
        </button>

        {/* INPUT DRAWER */}
        {showBox && (
          <div
            style={{
              marginTop: "8px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#f8fafc",
            }}
          >
            <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "#64748b" }}>
              Enter task name to add (or remove if it exists)
            </p>

            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddRemoveTask()}
              placeholder="Task name..."
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />

            <button
              onClick={handleAddRemoveTask}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#3b82f6",
                color: "white",
                fontWeight: "600",
                fontSize: "0.85rem",
              }}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}