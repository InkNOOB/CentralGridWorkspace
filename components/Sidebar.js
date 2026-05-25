// User in new Pages
//style={{ marginLeft: "270px", minHeight: "100vh", padding: "20px" }}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


export default function Sidebar() {

  const pathname = usePathname();
  const router = useRouter();

  const [hoveredItem, setHoveredItem] = useState("");

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  const menuItem = (label, active = false) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor:
      active || hoveredItem === label
        ? "#ffffff22"
        : "transparent",

    color: "#f1f5f9",
    fontSize: "14px",
    fontWeight: active ? "600" : "500",

    transition: "0.2s ease",

    transform:
      hoveredItem === label
        ? "translateX(5px)"
        : "translateX(0px)",

    boxShadow:
      hoveredItem === label
        ? "0 4px 10px rgba(0,0,0,0.15)"
        : "none",
  });

  return (
    <div
      style={{
        width: "270px",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#465566ff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px",
        fontFamily: "Arial",
        zIndex: "20"

      }}
    >
      
      {/* TOP */}
      <div>
        {/* LOGO & TITLE */}
        <div
          style={{
            marginTop: "10px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            
          }}
        >
          <img
            src="/images/logo1.jpg"
            alt="logo"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              objectFit: "cover",

              transition: "0.3s ease",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: "20px",
                margin: 0,
              }}
            >
              CGWS
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontWeight: "600",
                fontSize: "12px",
                margin: 0,
              }}
            >
              Central Grid Workspace
            </p>
          </div>
        </div>

        {/* MENU */}
        <p
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            marginBottom: "10px",
          }}
        >
          MENU
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={menuItem("My Home", pathname === "/home")}
            onMouseEnter={() => setHoveredItem("My Home")}
            onMouseLeave={() => setHoveredItem("")}
            onClick = {()=> router.push("/home")}
          >
            <img
              src="/images/home.png"
              alt="home"
              style={{
                width: "22px",
                opacity: "70%",
                transition: "0.2s ease",
              }}
            />

            My Home
          </div>

          <div
            style={menuItem("My Boards" , pathname.startsWith("/board"))}
            onMouseEnter={() => setHoveredItem("My Boards")}
            onMouseLeave={() => setHoveredItem("")}
          >
            <img
              src="/images/dashboard.png"
              alt="boards"
              style={{
                width: "22px",
                opacity: "70%",
                transition: "0.2s ease",
              }}
            />

            My Boards
          </div>

          <div
            style={menuItem("Create Board")}
            onMouseEnter={() => setHoveredItem("Create Board")}
            onMouseLeave={() => setHoveredItem("")}
          >
            <img
              src="/images/create.png"
              alt="create"
              style={{
                width: "22px",
                opacity: "70%",
                transition: "0.2s ease",
              }}
            />

            Create Board
          </div>

          <div
            style={menuItem("Join Board")}
            onMouseEnter={() => setHoveredItem("Join Board")}
            onMouseLeave={() => setHoveredItem("")}
          >
            <img
              src="/images/join.png"
              alt="join"
              style={{
                width: "22px",
                opacity: "70%",
                transition: "0.2s ease",
              }}
            />

            Join Board
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{ paddingBottom: "100px" }}>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            marginBottom: "10px",
          }}
        >
          ACCOUNT
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={menuItem("Profile", pathname.startsWith("/profile"))}
            onMouseEnter={() => setHoveredItem("Profile")}
            onMouseLeave={() => setHoveredItem("")}
            onClick = {()=> router.push("/profile")}
          >
            <img
              src="/images/user.png"
              alt="profile"
              style={{
                width: "22px",
                opacity: "70%",
              }}
            />

            Profile
          </div>

          <div
            style={menuItem("Logout")}
            onMouseEnter={() => setHoveredItem("Logout")}
            onMouseLeave={() => setHoveredItem("")}
            onClick={handleLogout}
          >
            <img
              src="/images/logout.png"
              alt="logout"
              style={{
                width: "22px",
                opacity: "70%",
              }}
            />

            Logout
          </div>
        </div>
      </div>
    </div>
    
  );
}