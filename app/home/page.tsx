"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import BoardFile from "@/components/BoardFile";
import CreateBoard from "@/components/CreateBoard";
import JoinBoard from "@/components/JoinBoard";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);


  const [createdBoards, setCreatedBoards] = useState<any[]>([]);
  const [joinedBoards, setJoinedBoards] = useState<any[]>([]);

  // -------------------------
  // LOAD USER + BOARDS
  // -------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    loadBoards(parsedUser.id);
  }, []);

  // -------------------------
  // LOAD BOARDS
  // -------------------------
  async function loadBoards(userId: number) {
    const res = await fetch(`/api/boards?userId=${userId}`);
    const data = await res.json();

    if (res.ok) {
      setCreatedBoards(data.created || []);
      setJoinedBoards(data.joined || []);
    }
  }

  // -------------------------
  // DELETE BOARD
  // -------------------------
  async function handleDeleteBoard(id: number) {
    const res = await fetch(`/api/boards/${id}?userId=${user.id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      alert(data?.error || "Delete failed");
      return;
    }

    setCreatedBoards((prev) => prev.filter((b) => b.id !== id));
  }
  // -------------------------
  // LEAVE BOARD
  // -------------------------
  async function handleLeaveBoard(boardId: number) {
  const res = await fetch("/api/boards/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      boardId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  // remove from joined boards UI
  setJoinedBoards((prev) => prev.filter((b) => b.id !== boardId));
}

  // -------------------------
  // RENDER BOARD CARD
  // -------------------------
  const renderBoard = (board: any) => (
    <BoardFile
      key={board.id}
      id={board.id}
      title={board.title}
      role={user.id === board.ownerId ? "Owner" : "Member"}
      isOwner={user.id === board.ownerId}
      members={board._count?.members ?? 0}
      inviteCode={board.inviteCode}
      handleDelete={handleDeleteBoard}
      handleLeave={handleLeaveBoard} 
    />
  );

  return (
    <div style={{ display: "flex", }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "240px",
          flex: 1,
          padding: "60px 70px 70px 130px",
          fontFamily: "Arial, sans-serif",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* WELCOME */}
        <div style={{ marginBottom: "60px" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700" }}>
            Welcome Back, {user?.username}
          </h1>

          <p style={{ color: "#64748b", marginTop: "5px" }}>
            you may now rest in peace
          </p>
        </div>

        {/* CREATED BOARDS */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "15px", fontWeight: "600" }}>
            Created Boards
          </h2>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {createdBoards.map(renderBoard)}
          </div>
        </div>

        {/* JOINED BOARDS */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "15px", fontWeight: "600" }}>
            Joined Boards
          </h2>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {joinedBoards.map(renderBoard)}
          </div>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            maxWidth: "1100px",
          }}
        >
          {/* CREATE CARD */}
          
          <CreateBoard
            user={user}
            onBoardCreated={(newBoard) =>
              setCreatedBoards((prev) => [...prev, newBoard])
            }
          />

          {/* JOIN CARD */}
             <JoinBoard
            user={user}
            onJoined={() => loadBoards(user.id)}
          />
        </div>
      </div>
    </div>
  );
}