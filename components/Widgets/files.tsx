"use client";

import { useState, useEffect, useRef } from "react";

type BoardFile = {
  id: number;
  name: string;
  size: number;
};

export default function FilesWidget({ boardId }: { boardId: number }) {
  const [files, setFiles] = useState<BoardFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to turn raw bytes into readable sizes (e.g., 2.4 MB)
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // LOAD FILES
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`/api/board/${boardId}/files`);
        const data = await res.json();
        setFiles(data || []);
      } catch (error) {
        console.error("Failed to load files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [boardId]);

  // HANDLE UPLOAD
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`/api/board/${boardId}/files`, {
        method: "POST",
        body: formData,
      });

      const newFile = await res.json();
      if (!res.ok) throw new Error(newFile.error || "Upload failed");

      setFiles((prev) => [newFile, ...prev]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // REMOVE FILE
  const handleRemoveFile = async (fileId: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));

    try {
      await fetch(`/api/board/${boardId}/files?fileId=${fileId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e6e6e6ff",
        borderRadius: "12px",
        padding: "16px",
        minWidth: "500px",
        maxWidth: "500px",
        height: "98mm", // Locked sizing grid dimension
        boxShadow: "-5px 8px 6px rgba(0, 0, 0, 0.16)",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ margin: "0 0 12px 0", fontSize: "1.15rem", fontWeight: "600", color: "#0f172a", textTransform: "uppercase" }}>
        Shared Files
      </h2>

      {/* SCROLLABLE LIST WRAPPER */}
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "12px",
          paddingRight: "4px",
          justifyContent: (loading || files.length === 0) ? "center" : "flex-start",
          border: "1px solid #e6e6e6ff",
          borderRadius: "12px",
        }}
      >
        {loading ? (
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
            Loading files...
          </p>
        ) : files.length === 0 ? (
          /* EMPTY STATE */
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center", margin: 0 }}>
            No files shared yet.
          </p>
        ) : (
          /* FILE MAP RENDERING */
          files.map((file) => (
            <div key={file.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              
              {/* DOWNLOAD LINK (Hits our API route fileId stream) */}
              <a
                href={`/api/board/${boardId}/files?fileId=${file.id}`}
                download={file.name}
                style={{
                  flexGrow: 1,
                  display: "block",
                  padding: "10px 12px",
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
                <div style={{ fontWeight: "600", fontSize: "0.95rem", marginBottom: "2px", color: "#3b82f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  📄 {file.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Size: {formatBytes(file.size)}
                </div>
              </a>

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleRemoveFile(file.id)}
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
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ef4444";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fee2e2";
                  e.currentTarget.style.color = "#ef4444";
                }}
                title="Delete File"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* UPLOADER ACTION LAYER */}
      <div style={{ marginTop: "auto" }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || loading}
          style={{
            width: "100%",
            padding: "10px",
            background: (uploading || loading) ? "#cbd5e1" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: (uploading || loading) ? "not-allowed" : "pointer",
            textAlign: "center",
            transition: "background 0.2s",
          }}
        >
          {uploading ? "Uploading New File..." : "Upload New File"}
        </button>
      </div>
    </div>
  );
}