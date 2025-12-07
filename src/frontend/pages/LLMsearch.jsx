import React, { useState } from "react";

export default function LLMSearch() {
  const [userPrompt, setUserPrompt] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outfitResult, setOutfitResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setOutfitResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          prompt: userPrompt,
          requirements: activeFilters, // optional for now
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError("Could not generate outfit.");
        return;
      }

      setOutfitResult(data);
    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    }

    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px 40px" }}>
      
      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <img src="/logo-black.png" alt="Logo" style={{ height: "40px" }} />
        <button style={{ padding: "10px 25px", borderRadius: "25px", border: "1px solid #000", background: "#fff" }}>
          My Account
        </button>
      </header>

      <h1 style={{ textAlign: "center", fontSize: "38px", fontWeight: "300", letterSpacing: "2px" }}>
        OUTFIT INSPIRATION
      </h1>

      {/* SEARCH BAR */}
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
          placeholder="Describe the outfit you want..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "16px" }}
        />

        <span style={{ fontSize: "18px", cursor: "pointer" }}>🎤</span>
      </div>

      {/* LAYOUT */}
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
          <div style={{ textAlign: "center", marginBottom: "10px" }}>Filter By</div>

          <details open style={{ marginBottom: "15px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Category</summary>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
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

          <details style={{ marginBottom: "15px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Color</summary>
          </details>

          <details style={{ marginBottom: "15px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Occasion</summary>
          </details>

          <details style={{ marginBottom: "15px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Weather</summary>
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

        {/* RESULTS */}
        <div style={{ flex: 1 }}>

          {loading && <h2>⏳ Generating outfit…</h2>}
          {error && <h2 style={{ color: "red" }}>{error}</h2>}

          {/* SHOW RESULT FROM BACKEND */}
          {outfitResult && (
            <div style={{ display: "flex", gap: "40px" }}>
              
              {/* AI IMAGE */}
              <div
                style={{
                  background: "#C78C5E",
                  height: "420px",
                  width: "320px",
                  borderRadius: "10px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={`data:image/png;base64,${outfitResult.outfitImage}`}
                  alt="Generated Outfit"
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              </div>

              {/* OUTFIT DETAILS */}
              <div>
                <h2>Recommended Outfit</h2>
                <ul>
                  {outfitResult.outfit.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: "12px" }}>
                      <strong>{item.name}</strong>
                      <br />
                      <span style={{ opacity: 0.8 }}>{item.notes}</span>
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    marginTop: "20px",
                    background: "#B0674B",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save Outfit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <footer
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "60px",
          paddingTop: "25px",
          borderTop: "1px solid #ccc",
        }}
      >
        <button style={{ background: "#333", color: "white", width: "55px", height: "55px", borderRadius: "50%", border: "none" }}>
          🏷️
        </button>

        <button style={{ background: "#333", color: "white", width: "55px", height: "55px", borderRadius: "50%", border: "none" }}>
          👜
        </button>

        <button style={{ background: "#333", color: "white", width: "55px", height: "55px", borderRadius: "50%", border: "none" }}>
          🏠
        </button>
      </footer>
    </div>
  );
}