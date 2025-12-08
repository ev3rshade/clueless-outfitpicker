import React, { useEffect, useState } from "react";

export default function Account() {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/account", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        alert("Session expired");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    loadUser();
  }, []);

  if (!user) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
  <div
    className="page-container"
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // vertical center
      alignItems: "center",     // horizontal center
      backgroundColor: "var(--color-background)",
      padding: "20px",
      textAlign: "center",
    }}
  >
    {/* Profile Avatar */}
    <div
      style={{
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        background: "var(--terra-cotta)",
        color: "var(--latte)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-primary)",
        fontSize: "60px",
        fontWeight: "bold",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        userSelect: "none",
      }}
    >
      {user.name?.charAt(0).toUpperCase() || "?"}
    </div>

    {/* User Name */}
    <h1
      style={{
        fontFamily: "var(--font-primary)",
        fontSize: "48px",
        letterSpacing: "2px",
        marginBottom: "40px",
        color: "var(--terra-cotta)",
      }}
    >
      {user.name?.toUpperCase()}
    </h1>

    {/* Account Details Card */}
    <div
      className="section-card"
      style={{
        width: "400px",
        padding: "30px",
        borderRadius: "25px",
        border: "1px solid var(--terra-cotta)",
        background: "var(--latte)",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
        textAlign: "left",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-primary)",
          fontSize: "22px",
          letterSpacing: "2px",
          color: "var(--terra-cotta)",
          marginBottom: "15px",
        }}
      >
        Account Details
      </h3>

      <p style={{ fontFamily: "var(--font-primary)", marginBottom: "10px" }}>
        <strong>Email:</strong> {user.email}
      </p>
      <p style={{ fontFamily: "var(--font-primary)" }}>
        <strong>Age:</strong> {user.age}
      </p>
    </div>

    {/* Logout Button */}
    <button
      style={{
        fontFamily: "var(--font-primary)",
        marginTop: "40px",
        borderRadius: "12px",
        background: "red",
        color: "white",
        padding: "12px 25px",
        border: "none",
        cursor: "pointer",
      }}
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}
    >
      Log Out
    </button>
  </div>
);
}