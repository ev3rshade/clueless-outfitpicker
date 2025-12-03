import React from "react";

export default function Wardrobe() {
  return (
    <div
      className="page-container"
      style={{ display: "flex", padding: "20px", fontFamily: "--font-primary" }}
    >
      {/* Sidebar Filters */}
      <div
        className="sidebar"
        style={{
          width: "220px",
          borderRight: "1px solid #ddd",
          paddingRight: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Filters</h3>

        <label className="filter-label">Category</label>
        <select className="filter-select" style={{ padding: "8px" }}>
          <option>Tops</option>
          <option>Bottoms</option>
          <option>One-Piece</option>
          <option>Outerwear</option>
          <option>Shoes</option>
          <option>Accessories</option>
        </select>

        <label className="filter-label">Color</label>
        <select className="filter-select" style={{ padding: "8px" }}>
          <option>Red</option>
          <option>Orange</option>
          <option>Yellow</option>
          <option>Green</option>
          <option>Blue</option>
          <option>Purple</option>
          <option>Pink</option>
          <option>Black</option>
          <option>White</option>
          <option>Mixed</option>
        </select>

        <label className="filter-label">Occasion</label>
        <select className="filter-select" style={{ padding: "8px" }}>
          <option>Casual</option>
          <option>Formal</option>
          <option>Athletic</option>
          <option>Business</option>
          <option>Business Casual</option>
          <option>Ethnic</option>
          <option>Leisure</option>
        </select>

        <label className="filter-label">Weather</label>
        <select className="filter-select" style={{ padding: "8px" }}>
          <option>Summer</option>
          <option>Winter</option>
          <option>Fall</option>
          <option>Spring</option>
        </select>
      </div>

      {/* Main Section */}
      <div style={{ flex: 1, paddingLeft: "40px" }}>
        <div
          className="top-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img src="/logo.png" alt="Logo" height="40" />

          <button
            className="button-primary"
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "1px solid #000",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Upload
          </button>
        </div>

        <h1 style={{ marginTop: "20px" }}>MY WARDROBE</h1>

        {/* Clothing Grid */}
        <div
          className="outfit-grid"
          style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
          }}
        >
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div
                className="outfit-card"
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    background: "#e8e8e8",
                    height: "180px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                ></div>

                <p style={{ marginBottom: "10px" }}>Item {i + 1}</p>

                <button
                  className="button-primary"
                  style={{
                    width: "100%",
                    padding: "8px 0",
                    background: "#222",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}