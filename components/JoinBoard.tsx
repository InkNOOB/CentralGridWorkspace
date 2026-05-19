"use client";

import { useState } from "react";

export default function JoinBoard({
  user,
  onJoined,
}: {
  user: any;
  onJoined: () => void;
}) {
  const [inviteCode, setInviteCode] = useState("");

  async function handleJoin() {
    if (!inviteCode) {
      alert("Enter invite code");
      return;
    }

    const res = await fetch("/api/boards/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inviteCode,
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Joined board!");
      setInviteCode("");
      onJoined(); // refresh boards in parent
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
        Join Board
      </h3>

      <p style={{ color: "#64748b", fontSize: "14px" }}>
        Enter an invite code to join an existing board.
      </p>

        <input
          placeholder="Enter invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
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
          onClick={handleJoin}
          style={{
            padding: "10px 50px",
            borderRadius: "8px",
            border: "none",
            background: "#10b981",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Join
        </button>

    </div>
  );
}