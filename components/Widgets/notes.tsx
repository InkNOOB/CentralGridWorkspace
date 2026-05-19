"use client";

import { useEffect, useState } from "react";

export default function Note({ boardId }: { boardId: number }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD NOTE
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/board/${boardId}/note`);
        const data = await res.json();
        setContent(data?.content || "");
      } catch (error) {
        console.error("Failed to load note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [boardId]);

  // MANUAL SAVE
  const saveNote = async () => {
    setSaving(true);

    await fetch(`/api/board/${boardId}/note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setSaving(false);
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e6e6ff",
        borderRadius: "12px",
        padding: "10px 15px",
        maxWidth: "500px",
        minWidth: "500px",
        boxShadow: "-5px 8px 6px rgba(0, 0, 0, 0.16)",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: "600",
          marginBottom: "5px",
          marginLeft: "10px",
          color: "#0f172a",
          textTransform: "uppercase",
        }}
      >
        NOTES
      </p>

      {/* TEXTAREA OR SIMPLE LOADING CONTAINER */}
      <div
        style={{
          width: "100%",
          height: "74mm",
          minHeight: "74mm",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          /* SIMPLE LOADING STATE (Matches Todo, Links, Gallery style) */
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
            Loading note...
          </p>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            style={{
              backgroundColor: "#fff5d6ff",
              width: "100%",
              height: "100%",
              border: "0.5px solid #c9c5c5ff",
              borderRadius: "5px",
              padding: "10px",
              boxSizing: "border-box",
              resize: "none",
            }}
          />
        )}
      </div>

      {/* SAVE BUTTON */}
      <p
        onClick={loading ? undefined : saveNote}
        style={{
          color: loading ? "#94a3b8" : saving ? "#999" : "#658effff",
          fontSize: "1rem",
          marginTop: "14px",
          marginBottom: "5px",
          marginLeft: "20px",
          cursor: loading ? "not-allowed" : "pointer",
          userSelect: "none",
          fontWeight: "500",
        }}
      >
        {saving ? "SAVING..." : "SAVE ✔"}
      </p>
    </div>
  );
}