"use client";

import { useState, useEffect } from "react";

type BoardLink = {
  id: number;
  title: string;
  url: string;
};

export default function LinksWidget({ boardId }: { boardId: number }) {
  const [links, setLinks] = useState<BoardLink[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD LINKS FROM DB
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        // Matches your singular 'api/board/' structure
        const res = await fetch(`/api/board/${boardId}/links`);
        const data = await res.json();
        setLinks(data || []);
      } catch (error) {
        console.error("Failed to load links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [boardId]);

  // ADD NEW LINK
  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    
    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      const res = await fetch(`/api/board/${boardId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), url: formattedUrl }),
      });
      
      const newLink = await res.json();
      setLinks((prev) => [...prev, newLink]);
      setNewTitle("");
      setNewUrl("");
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  };

  // REMOVE LINK
  const handleRemoveLink = async (linkId: number) => {
    setLinks((prev) => prev.filter((link) => link.id !== linkId));

    try {
      await fetch(`/api/board/${boardId}/links?linkId=${linkId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgb(117, 117, 117)",
        borderRadius: "12px",
        padding: "16px",
        minWidth: "500px",
        maxWidth: "500px", 
        height: "98mm",
        boxShadow: "-5px 8px 6px rgba(0, 0, 0, 0.16)",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ margin: "0 0 12px 0", fontSize: "1.15rem", fontWeight: "600", color: "#0f172a", textTransform: "uppercase" }}>
        Shared Links
      </h2>

      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "12px",
          paddingRight: "4px",
          border: "1px solid #e6e6e6ff",
          borderRadius: "12px",
        }}
      >
        {loading ? (
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center", margin: "auto" }}>
            Loading links...
          </p>
        ) : links.length === 0 ? (
          /* FIX: margin "auto" forces it into the dead center of the flex container! */
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center", margin: "auto" }}>
            No links shared yet.
          </p>
        ) : (
          links.map((link) => (
            <div key={link.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flexGrow: 1,
                  display: "block",
                  padding: "10px 12px ",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#334155",
                  transition: "background 0.2s",
                  minWidth: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
              >
                <div style={{ fontWeight: "600", fontSize: "0.95rem",color: "#2563eb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",marginBottom:"2px"}}>
                  {link.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {link.url}
                </div>
              </a>

              <button
                onClick={() => handleRemoveLink(link.id)}
                style={{
                  background: "#fee2e2",
                  color: "#ef4444",
                  border: "1px solid #f87171",
                  borderRadius: "8px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontWeight: "bold",
                  flexShrink: 0,
                  transition: "0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ef4444";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fee2e2";
                  e.currentTarget.style.color = "#ef4444";
                }}
                title="Remove Link"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <input
          type="text"
          placeholder="Link Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{
            padding: "2.5px 10px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "0.85rem",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="text"
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddLink()} 
            style={{
              flexGrow: 1,
              padding: "2.5px 10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
          <button
            onClick={handleAddLink}
            style={{
              padding: "0 12px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}