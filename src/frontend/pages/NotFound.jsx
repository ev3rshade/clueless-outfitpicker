import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
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
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "6rem", fontWeight: "bold", margin: 0 }}>404</h1>
      <h2 style={{ fontSize: "2rem", margin: 0 }}>Page Not Found</h2>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "#1e90ff",
          color: "white",
          textDecoration: "none",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}

