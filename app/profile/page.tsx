"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar"; 

type UserProfile = {
  id: number;
  name: string;
  boards: { id: number; title: string }[];
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // LOAD PROFILE DATA
  useEffect(() => {
    // 1. Read user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // 2. Pass the real user ID in the headers!
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile`, {
          method: "GET",
          headers: {
            "x-user-id": parsedUser.id.toString(),
          },
        }); 
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    // Get the ID for the delete header
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);

    setDeleting(true);
    try {
      const res = await fetch(`/api/profile`, {
        method: "DELETE",
        headers: {
          "x-user-id": parsedUser.id.toString(),
        },
      });

      if (res.ok) {
        localStorage.removeItem("user"); // Clean up local storage after deletion
        alert("Account deleted.");
        router.push("/"); 
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong deleting the account.");
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      
      {/* SIDEBAR COMPONENT */}
      <Sidebar />

      {/* MAIN PROFILE VIEW CONTAINER */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "40px 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "30px",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            height: "700px",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ margin: "0 0 20px 0", fontSize: "1.5rem", color: "#0f172a" }}>
            Profile Settings
          </h1>

          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8" }}>
              <p>Loading profile data...</p>
            </div>
          ) : profile ? (
            /* Layout Container takes full remaining height to pin elements correctly */
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
              
              {/* USER USERNAME ENTRY */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>NAME</label>
                <div style={{ fontSize: "1.1rem", color: "#334155", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
                  {profile.name || "Unknown User"}
                </div>
              </div>

              {/* BOARDS DIRECTORY */}
              <div>
                <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                  YOUR BOARDS ({profile.boards?.length || 0})
                </label>
                <div style={{ background: "#f1f5f9", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {profile.boards && profile.boards.length > 0 ? (
                    profile.boards.map((board) => (
                      <div key={board.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                        <span style={{ fontWeight: "500", color: "#0f172a" }}>{board.title}</span>
                        <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>ID: {board.id}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic" }}>
                      No boards created yet.
                    </p>
                  )}
                </div>
              </div>
            
              {/* FLEX GROW SPACER: Absorbs all open space in the middle, pushing the danger zone to the bottom */}
              <div style={{ flexGrow: 1 }} />

              {/* DANGER ZONE */}
              <div style={{ paddingTop: "20px", borderTop: "2px dashed #f87171" }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#ef4444", fontSize: "1.1rem" }}>Warning</h3>
                <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "0.9rem" }}>
                  Deleting your account will wipe out all your saved board, including its contents.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: deleting ? "#fca5a5" : "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: deleting ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {deleting ? "Wiping Account..." : "Delete Account"}
                </button>
              </div>

            </div>
          ) : (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#ef4444" }}>
              <p>Could not load profile. Please make sure you are logged in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}