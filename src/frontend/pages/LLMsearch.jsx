// src/pages/OutfitInspiration.jsx
import React, { useState } from "react";

export default function OutfitInspiration() {
  const [showResults, setShowResults] = useState(false);

  function handleSearch() {
    setShowResults(true);
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px 40px" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <img
          src="/logo-black.png"
          alt="Clueless Logo"
          style={{ height: "40px" }}
        />
        <button
          style={{
            padding: "10px 25px",
            borderRadius: "25px",
            border: "1px solid #000",
            background: "#fff",
            fontSize: "14px",
          }}
        >
          My Account
        </button>
      </header>

      {/* Title */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "38px",
          fontWeight: "300",
          letterSpacing: "2px",
          marginBottom: "30px",
        }}
      >
        OUTFIT INSPIRATION
      </h1>

      {/* Search Bar */}
      <div
        style={{
          background: "#FAE9D5",
          borderRadius: "30px",
          padding: "15px 20px",
          maxWidth: "1100px",
          margin: "0 auto 40px auto",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          border: "1px solid #f2d8c3",
        }}
      >
        <span style={{ fontSize: "20px" }}>🔍</span>
        <input
          type="text"
          placeholder="User typed prompt..."
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "16px",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <span style={{ fontSize: "18px", cursor: "pointer" }}>🎤</span>
      </div>

      <div style={{ display: "flex", gap: "40px" }}>
        {/* FILTER SIDEBAR */}
        <div
          style={{
            width: "180px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "15px",
            height: "fit-content",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            Filter By
          </div>

          {/* Category */}
          <details open style={{ marginBottom: "15px" }}>
            <summary
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Category
            </summary>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Tops", "Bottoms", "Dresses", "Outerwear"].map((c) => (
                <button
                  key={c}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "20px",
                    border: "1px solid #000",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {c} <span>＋</span>
                </button>
              ))}
            </div>
          </details>

          {/* Color */}
          <details style={{ marginBottom: "15px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Color
            </summary>
          </details>

          {/* Occasion */}
          <details style={{ marginBottom: "15px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Occasion
            </summary>
          </details>

          {/* Weather */}
          <details style={{ marginBottom: "15px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Weather
            </summary>
          </details>

          <button
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #000",
              background: "#222",
              color: "white",
              marginTop: "10px",
            }}
            onClick={handleSearch}
          >
            Update Filters
          </button>
        </div>

        {/* OUTFIT RESULTS (Hidden until search) */}
        {showResults && (
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px",
            }}
          >
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                style={{
                  background: "#C78C5E",
                  height: "420px",
                  borderRadius: "10px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <h2 style={{ marginBottom: "10px" }}>OUTFIT {num}</h2>
                <button
                  style={{
                    background: "#B0674B",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <footer
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "60px",
          paddingTop: "25px",
          borderTop: "1px solid #ccc",
        }}
      >
        <div>
          <button
            style={{
              background: "#333",
              color: "white",
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              border: "none",
            }}
          >
            🏷️
          </button>
        </div>

        <div>
          <button
            style={{
              background: "#333",
              color: "white",
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              border: "none",
            }}
          >
            👜
          </button>
        </div>

        <div>
          <button
            style={{
              background: "#333",
              color: "white",
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              border: "none",
            }}
          >
            🏠
          </button>
        </div>
      </footer>
    </div>
  );
}