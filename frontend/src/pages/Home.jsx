import React from "react";
import logo from "../assets/logo.png";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

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
      <div className="wardrobe-top-row">
        <img src={logo} alt="Clueless Logo" height="120" />
      </div>

      {/* Horizontal Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
        }}
      >
        <button
          onClick={() => navigate("/signup")}
          style={{
            fontFamily: "var(--font-primary)",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            cursor: "pointer",
            background: "var(--latte)",
            color: "var(--terra-cotta)",
            border: "2px solid var(--warm-clay)",
          }}
        >
          Sign Up
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            fontFamily: "var(--font-primary)",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            cursor: "pointer",
            background: "var(--terra-cotta)",
            color: "var(--latte)",
            border: "2px solid var(--warm-clay)",
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
