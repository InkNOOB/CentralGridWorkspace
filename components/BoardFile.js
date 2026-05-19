import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BoardFile({
  id,
  title,
  role,
  members,
  inviteCode,
  handleDelete,
  handleLeave,
  isOwner,
}) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const copyInviteCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        width: "220px",
        padding: "20px",
        minHeight: "200px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TITLE */}
      <div style={{ display: "flex",flexDirection: "row", cursor:"pointer",justifyContent: "space-between"}}>
      <h3 style={{ margin: "0 0 5px 0", fontWeight: "700",width: "100px",overflow: "hidden", textOverflow: "ellipsis" }}>
        {title}
      </h3>
        <div onClick={() => router.push(`/board/${id}`)}>
          <img
              src="/images/join.png"
              alt="join"
              style={{
                width: "22px",
                opacity: "70%",
                transition: "0.2s ease",
              }}
            /></div>

      </div>
      {/* ROLE */}
      <p
        style={{
          color: "#64748b",
          margin: "0 0 15px 0",
          fontSize: "14px",
        }}
      >
        {role}
      </p>

      {/* INVITE CODE BOX */}
      <div
        style={{
          background: "#f1f5f9",
          padding: "10px",
          borderRadius: "10px",
          fontSize: "13px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <span style={{ fontWeight: "600" }}>
          {inviteCode}
        </span>

        <button
          onClick={copyInviteCode}
          style={{
            background: copied ? "#22c55e" : "#3b82f6",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* DELETE BUTTON (ONLY OWNER) */}
      {isOwner && (
        <button
          onClick={() => {
          console.log("DELETE CLICK ID:", id);
          handleDelete(id);
        }}
          style={{
            marginBottom: "10px",
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      )}
      {/* LEAVE (MEMBER ONLY) */}
      {!isOwner && (
        <button
          onClick={() => handleLeave(id)}
          style={{
            background: "#efa544ff",
            color: "white",
            border: "none",
            padding: "6px",
            borderRadius: "8px",
            marginBottom: "5px",
          }}
        >
          Leave
        </button>
      )}
      


      {/* MEMBERS */}
      <div style={{ marginTop: "auto" }}>
        <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
          {members} members
        </p>
      </div>
    </div>
  );
}
