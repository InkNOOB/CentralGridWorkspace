"use client";

import { useState, useEffect, useRef } from "react";

type BoardImage = {
  id: number;
  name: string;
  type: string;
};

export default function ImageGalleryWidget({ boardId }: { boardId: number }) {
  const [images, setImages] = useState<BoardImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CHANGED FROM 4 TO 1: Instantly changes pages into individual slides
  const IMAGES_PER_PAGE = 1;

  // LOAD IMAGES FROM DB
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/board/${boardId}/images`);
        const data = await res.json();
        setImages(data || []);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [boardId]);

  // PAGINATION LOGIC (Now handles 1 image at a time)
  const totalPages = Math.max(1, Math.ceil(images.length / IMAGES_PER_PAGE));
  const sanitizedPage = currentPage > totalPages ? totalPages : currentPage;
  const startIndex = (sanitizedPage - 1) * IMAGES_PER_PAGE;
  const displayedImages = images.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // HANDLE PHOTO UPLOAD
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please choose image file formats only!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`/api/board/${boardId}/images`, {
        method: "POST",
        body: formData,
      });

      const newImage = await res.json();
      if (!res.ok) throw new Error(newImage.error || "Upload failed");

      setImages((prev) => [newImage, ...prev]);
      setCurrentPage(1); 
    } catch (error) {
      console.error("Upload execution error:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // DELETE PHOTO FROM GALLERY
  const handleRemoveImage = async (imageId: number) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    try {
      await fetch(`/api/board/${boardId}/images?imageId=${imageId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to clear image:", error);
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
        height: "98mm", 
        boxShadow: "-5px 8px 6px rgba(0, 0, 0, 0.16)",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER WITH INTEGRATED PAGINATION ARROWS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "600", color: "#0f172a", textTransform: "uppercase" }}>
          Image Gallery
        </h2>
        
        {!loading && images.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", userSelect: "none" }}>
            <button
              onClick={handlePrevPage}
              disabled={sanitizedPage === 1}
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                cursor: sanitizedPage === 1 ? "not-allowed" : "pointer",
                padding: "2px 8px",
                fontSize: "0.85rem",
                color: sanitizedPage === 1 ? "#cbd5e1" : "#475569",
                fontWeight: "bold",
              }}
            >
              ◀
            </button>
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", minWidth: "65px", textAlign: "center" }}>
              Image {sanitizedPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={sanitizedPage === totalPages}
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                cursor: sanitizedPage === totalPages ? "not-allowed" : "pointer",
                padding: "2px 8px",
                fontSize: "0.85rem",
                color: sanitizedPage === totalPages ? "#cbd5e1" : "#475569",
                fontWeight: "bold",
              }}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* DISPLAY CANVAS */}
      <div 
        style={{ 
          flexGrow: 1,
          height: 0, 
          border: "1px solid #e6e6e6ff", 
          borderRadius: "12px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: (loading || images.length === 0) ? "center" : "flex-start", 
        }}
      >
        {loading ? (
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
            Loading gallery...
          </p>
        ) : images.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center", margin: 0 }}>
            Gallery is still empty.
          </p>
        ) : (
          /* SINGLE IMAGE CONTAINER (Replaced old 2x2 grid layout) */
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
            {displayedImages.map((img) => (
              <div
                key={img.id}
                style={{
                  position: "relative",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <img
                  src={`/api/board/${boardId}/images?imageId=${img.id}`}
                  alt={img.name}
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "100%", 
                    width: "auto", 
                    height: "auto", 
                    objectFit: "contain", 
                    padding: "4px", 
                    boxSizing: "border-box" 
                  }}
                />

                <button
                  onClick={() => handleRemoveImage(img.id)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(239, 68, 68, 0.9)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    zIndex: 10,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TRIGGER ACTIONS */}
      <div style={{ marginTop: "12px", flexShrink: 0 }}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            width: "100%",
            padding: "10px",
            background: uploading ? "#cbd5e1" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: uploading ? "not-allowed" : "pointer",
            textAlign: "center",
          }}
        >
          {uploading ? "Uploading Image..." : "Upload Image"}
        </button>
      </div>
    </div>
    
  );
}