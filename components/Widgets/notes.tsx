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
    try {
      await fetch(`/api/board/${boardId}/note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgb(117, 117, 117)",
        borderRadius: "12px",
        padding: "16px",
        maxWidth: "500px",
        minWidth: "500px",
        height: "98mm",             /* Secure layout grid boundary */
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
          marginTop: 0,
          marginBottom: "12px",
          color: "#0f172a",
          textTransform: "uppercase",
        }}
      >
        Notes
      </p>

      {/* TEXTAREA OR SIMPLE LOADING CONTAINER */}
      <div
        style={{
          width: "100%",
          height: "64mm",           /* Reduced from 74mm to perfectly fit inside the 98mm boundary */
          minHeight: "64mm",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        {loading ? (
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

      {/* SAVE ACTION LAYER */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={saveNote}
          disabled={saving || loading}
          style={{
            width: "100%",
            padding: "10px",
            background: (saving || loading) ? "#cbd5e1" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: (saving || loading) ? "not-allowed" : "pointer",
            textAlign: "center",
            transition: "background 0.2s",
          }}
        >
          {saving ? "Saving Note..." : "Save Note"}
        </button>
      </div>
    </div>
  );
}