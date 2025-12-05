import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";


export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        borderBottom: "1px solid #ccc",
        fontFamily: "sans-serif",
      }}
    >
      { /* <Link to="/" style={{ textDecoration: "none", color: "black", fontSize: "24px", fontWeight: "bold" }}>Clueless</Link> */}
      <div className="wardrobe-top-row">
        <img src={logo} alt="Clueless Logo" height="80" />
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/account" style={{ textDecoration: "none", color: "black" }}>
          Account
        </Link>

        {/* ROUTED TO /llmsearch AS REQUESTED */}
        <Link
          to="/wardrobe"
          style={{ textDecoration: "none", color: "black" }}
        >
          Wardrobe
        </Link>

        <Link to="/outfits" style={{ textDecoration: "none", color: "black" }}>
          My Oufits
        </Link>

        <Link to="/llmsearch" style={{ textDecoration: "none", color: "black" }}>
          Generate Oufit
        </Link>

        <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
          Login
        </Link>
      </div>
    </nav>
  );
}
