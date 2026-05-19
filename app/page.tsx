'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);  
  async function handleLogin() {
  const res = await fetch("/api/login", {
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
    alert("Login successful!");
    localStorage.setItem("user", JSON.stringify(data.user));
    router.push("/home");
    
  } else {
    alert(data.error || "Login failed");
  }
}

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#e5e7eb" }}>
      {/* LEFT SIDE: THE LOGIN CARD */}
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
          padding: "60px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
         
        }}>
          <h2 style={{ color: "#64748b", letterSpacing: "3px", marginBottom: "30px",fontSize: "1.4rem" }}>LOGIN</h2>
          
          {/* User Icon Placeholder */}
          <div style={{ 
            width: "80px", 
            height: "80px", 
            border: "2px solid #64748b", 
            borderRadius: "50%", 
            marginBottom: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={{ width: "40px", height: "40px", overflow: "hidden" }}>
  <img 
    src="/images/user.png" 
    alt="profile" 
    style={{ 
      width: "40px", 
      height: "40px", 
      opacity: "1", 
      filter: "drop-shadow(40px 0 0 #35465aff)", 
      position: "relative",
      left: "-40px"
    }} 
  />
</div>
             
          </div>

          <input 
            placeholder="Enter Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: "100%", padding: "12px", marginBottom: "20px", 
              borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc",boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)" 
            }} 
          />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password" 
            style={{ 
            width: "100%", padding: "12px", marginBottom: "30px", 
            borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc" ,boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)" 
            }} 
          />

          <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleLogin}
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
            Login
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: WELCOME PANEL */}
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
            WELCOME BACK
          </h1>
          <p style={{ fontSize: "1.5rem", opacity: "0.7", margin: "10px 0" }}>
            Central Grid Workspace
          </p>
        </div>

        <div style={{ marginTop: "10vh" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>Login to your Account</h2>
          <p style={{ fontSize: "1.1rem", opacity: "0.6", marginBottom: "25px" }}>
            Doesn't have an Account yet?
          </p>
         <Link href="/signup">
          <button style={{
            padding: "12px 40px",
            borderRadius: "50px",
            border: "1.5px solid white",
            fontSize: "1.1rem",
            color: "white",
            backgroundColor: "transparent",
            cursor: "pointer"
          }}>
            Create Account
          </button>
        </Link>
        </div>
      </div>
    </div>
  );
}