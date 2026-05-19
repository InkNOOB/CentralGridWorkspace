"use client";

import { useState } from "react";

export default function CreateBoard({
  user,
  onBoardCreated,
}: {
  user: any;
  onBoardCreated: (board: any) => void;
}) {
  const [boardTitle, setBoardTitle] = useState("");
  const TITLE_LIMIT = 40;

  async function handleCreateBoard() {
    if (!boardTitle) {
      alert("Enter board title");
      return;
    }

    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: boardTitle,
        ownerId: user.id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      onBoardCreated(data);
      setBoardTitle("");
    } else {
      alert(data.error);
    }
  }

  return (
    <div
      style={{
        flex: 1,
        padding: "25px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: "10px", fontWeight: "600" }}>
        Create Board
      </h3>

      <p style={{ color: "#64748b", fontSize: "14px" }}>
        Start a new board and organize your dashboards.
      </p>

      <input
        placeholder="Board title"
        value={boardTitle}
        maxLength={TITLE_LIMIT}
        onChange={(e) => setBoardTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          marginTop: "15px",
          marginBottom: "15px",
          outline: "none",
        }}
      />

      <button
        onClick={handleCreateBoard}
        style={{
          padding: "10px 50px",
          borderRadius: "8px",
          border: "none",
          background: "#3b82f6",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Create
      </button>
    </div>
  );
}