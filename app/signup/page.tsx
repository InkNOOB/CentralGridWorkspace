"use client";
import { useState } from "react";
import Link from 'next/link';
export default function CreateAccount() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [isHovered, setIsHovered] = useState(false);  
const USERNAME_LIMIT = 30;

async function handleCreate() {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Account created!");
  } else {
    alert(data.error || "Something went wrong");
  }
}

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "row-reverse",
      minHeight: "100vh", 
      backgroundColor: "#e5e7eb" 
    }}>
      
      {/* RIGHT SIDE: THE FORM CARD */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "#ffffff", 
          width: "100%",
          maxWidth: "400px",
          padding: "50px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}>
          <h2 style={{ color: "#64748b", letterSpacing: "3px", marginBottom: "25px", fontSize: "1.2rem" }}>CREATE ACCOUNT</h2>
          
          {/* User Icon */}
          <div style={{ 
            width: "70px", 
            height: "70px", 
            border: "2px solid #64748b", 
            borderRadius: "50%", 
            marginBottom: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={{ width: "35px", height: "35px", overflow: "hidden" }}>
              <img 
                src="/images/user.png" 
                alt="profile" 
                style={{ 
                  width: "35px", 
                  height: "35px", 
                  filter: "drop-shadow(35px 0 0 #35465aff)", 
                  position: "relative",
                  left: "-35px" 
                }} 
              />
            </div>
          </div>

          <input 
            placeholder="Enter Username" 
            value={username}
            maxLength ={USERNAME_LIMIT}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: "100%", padding: "12px", marginBottom: "15px", 
              borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f1f5f9", 
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)"  
            }} 
          />
          <input 
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            style={{ 
              width: "100%", padding: "12px", marginBottom: "15px", 
              borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f1f5f9", 
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)"  
            }} 
          />
          <input 
            type="password"
            placeholder="Re-Enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            style={{ 
              width: "100%", padding: "12px", marginBottom: "25px", 
              borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f1f5f9", 
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)"  
            }} 
          />

          <button
        onClick={handleCreate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    style={{
    width: "100%",
    padding: "12px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: isHovered ? "#000000ff" : "#35465aff",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s ease"
  }}
>
  Create
</button>
        </div>
      </div>

      {/* LEFT SIDE: WELCOME PANEL */}
      <div
        style={{
          width: "40vw",
          backgroundColor: "#35465aff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          color: "white",
          textAlign: "center",
          padding: "40px"
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", letterSpacing: "8px", margin: "0" }}>
            WELCOME
          </h1>
          <p style={{ fontSize: "1.4rem", opacity: "0.8", margin: "10px 0" }}>
            Central Grid Workspace
          </p>
        </div>

        <div style={{ marginTop: "10vh" }}>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "10px" }}>Create an Account</h2>
          <p style={{ fontSize: "1.1rem", opacity: "0.6", marginBottom: "25px" }}>
            Already have an Account?
          </p>
        <Link href="/">
          <button style={{
            padding: "10px 60px",
            borderRadius: "50px",
            border: "1.5px solid white",
            fontSize: "1.1rem",
            color: "white",
            backgroundColor: "transparent",
            cursor: "pointer"
          }}>
            Login
          </button>
        </Link>
        </div>
      </div>
    </div>
  );
}
    