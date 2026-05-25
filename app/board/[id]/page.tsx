"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SideBar from "@/components/Sidebar";
import Notes from "@/components/Widgets/notes";
import Todo from "@/components/Widgets/todo";
import Calendar from "@/components/Widgets/calendar";
import Links from "@/components/Widgets/links";
import ImgGallery from "@/components/Widgets/gallery";
import Files from "@/components/Widgets/files";


export default function BoardPage() {
  const router = useRouter();
  const { id } = useParams();

  const [board, setBoard] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/boards/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": parsedUser.id.toString(), 
          },
        });

        if (res.status === 403 || res.status === 401) {
          alert("Access Denied: You are not a member of this board.");
          router.push("/home"); 
          return;
        }

        if (!res.ok) throw new Error("Failed to load board");

        const data = await res.json();
        setBoard(data);
      } catch (error) {
        console.error("Error loading board:", error);
        router.push("/home");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, router]);

  if (loading || !board) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    /* FIXED: Added minWidth: "max-content" so the layout container matches the full width of your 3 columns on small screens */
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif", minWidth: "max-content", width: "100%" }}>
      <SideBar />

      <header
        style={{
          height: "100px",
          width: "100%",
          backgroundColor: "#bdcadbff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "300px",
          paddingRight: "40px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "inset 10px 0px 10px rgba(0, 0, 0, 0.36)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0, marginRight: "20px" }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: "1.5rem", 
            fontWeight: "700", 
            color: "#0f172a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {board.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b", whiteSpace: "nowrap" }}>
              Invite Code: {board.inviteCode}
            </p>

            <div
              style={{
                backgroundColor: user?.id === board.ownerId ? "#dcfce7" : "#e0f2fe",
                color: user?.id === board.ownerId ? "#166534" : "#075985",
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              {user?.id === board.ownerId ? "Owner" : "Member"}
            </div>
          </div>
        </div>

        <div style={{ background: "#f1f5f9", padding: "8px 14px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", color: "#334155", border: "1px solid", flexShrink: 0 }}>
          Members: {board._count?.members || 0}
        </div>
      </header>

      {/* Kept exactly as your original 3-column layout */}
      <div
        style={{
          marginLeft: "290px",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          alignItems: "flex-start",
        }}
      > 
        <Todo boardId={Number(id)}/>
        <Notes boardId={Number(id)}/>  
        <Calendar/>
        <Links boardId={Number(id)}/>
        <Files boardId={Number(id)}/>
        <ImgGallery boardId={Number(id)}/>
      </div>
    </div>
  );
}