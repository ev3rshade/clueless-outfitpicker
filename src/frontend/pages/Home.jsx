import React from "react";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      {/* Big Logo */}
      <h1 style={{ fontSize: "4rem", fontWeight: "bold" }}>CLUELESS</h1>

      {/* Horizontal Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
        }}
      >
        <button
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#1e90ff",
            color: "white",
          }}
        >
          Sign Up
        </button>

        <button
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #1e90ff",
            cursor: "pointer",
            background: "white",
            color: "#1e90ff",
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
