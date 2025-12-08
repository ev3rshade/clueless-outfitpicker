import React, { useState } from "react";
import Outfit from "../../../backend/models/Outfit.js";

// Filter options (matching your wardrobe categories)
const CATEGORY_OPTIONS = ["Tops", "Bottoms", "One-piece", "Outerwear", "Accessories", "Shoes"];
const COLOR_OPTIONS = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Black", "White", "Grey", "Mixed"];
const OCCASION_OPTIONS = ["Business casual", "Casual", "Formal", "Black tie", "Ethnic", "Leisure"];
const WEATHER_OPTIONS = ["Spring", "Summer", "Fall", "Winter"];

async function saveOutfit({ userId, description, base64Image }) {
  try {
    // remove the base64 prefix

    const outfit = new Outfit({
      userId,
      description,
      image: base64Imagee,
    });

    await outfit.save();

    return { success: true, outfit };
  } catch (err) {
    console.error("Error saving outfit:", err);
    return { success: false, error: err.message };
  }
}

export default function LLMSearch() {
  const [userPrompt, setUserPrompt] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outfitResult, setOutfitResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Filter states - all optional
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState([]);

  // Dropdown expansion states
  const [expandedDropdowns, setExpandedDropdowns] = useState({
    categories: false,
    colors: false,
    occasions: false,
    weather: false,
  });

  const toggleDropdown = (dropdown) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  // Helper function to toggle filter selection
  const toggleFilter = (filterArray, setFilterArray, item) => {
    if (filterArray.includes(item)) {
      setFilterArray(filterArray.filter(f => f !== item));
    } else {
      setFilterArray([...filterArray, item]);
    }
  };

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setOutfitResult(null);

    try {
      const token = localStorage.getItem("token");
      
      // Compile filter requirements
      const requirements = {
        ...(selectedCategories.length > 0 && { categories: selectedCategories }),
        ...(selectedColors.length > 0 && { colors: selectedColors }),
        ...(selectedOccasions.length > 0 && { occasions: selectedOccasions }),
        ...(selectedWeather.length > 0 && { weather: selectedWeather })
      };

      const response = await fetch("http://localhost:8000/outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          prompt: userPrompt,
          requirements: Object.keys(requirements).length > 0 ? requirements : undefined
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
    <div style={{ fontFamily: "var(--font-primary)", padding: "20px 40px" }}>
      
      {/* HEADER */}

      <h1 style={{ textAlign: "center", fontSize: "38px", fontWeight: "300", letterSpacing: "2px" }}>
        OUTFIT INSPIRATION
      </h1>

      {/* SEARCH BAR */}
      <div
        style={{
          background: "var(--latte)",
          borderRadius: "30px",
          padding: "15px 20px",
          maxWidth: "1100px",
          margin: "0 auto 40px auto",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          border: "1px solid var(--terra-cotta)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "#666" }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>

        <input
          type="text"
          placeholder="Describe the outfit you want..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ fontFamily: "var(--font-primary)", flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "16px" }}
        />

        {/*<span style={{ fontSize: "18px", cursor: "pointer" }}>🎤</span> */}
      </div>

      {/* LAYOUT WITH LEFT SIDEBAR FILTERS */}
      <div style={{ display: "flex", gap: "30px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* LEFT SIDEBAR - FILTERS */}
        <div style={{ width: "280px", flexShrink: 0 }}>
          <h3 style={{ 
            fontSize: "16px", 
            fontWeight: "600",
            color: "#333",
            marginBottom: "15px"
          }}>
            Filter By (Optional)
          </h3>

          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "white",
              color: "#666",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "var(--font-primary)",
              marginBottom: "15px"
            }}
            onClick={() => {
              setSelectedCategories([]);
              setSelectedColors([]);
              setSelectedOccasions([]);
              setSelectedWeather([]);
            }}
          >
            Clear All Filters
          </button>

          {/* CATEGORY DROPDOWN */}
          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={() => toggleDropdown("categories")}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#f9f9f9",
                color: "#333",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "var(--font-primary)",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease"
              }}
            >
              CATEGORY
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                {expandedDropdowns.categories ? "▼" : "▶"}
              </span>
            </button>
            {expandedDropdowns.categories && (
              <div style={{ paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {CATEGORY_OPTIONS.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleFilter(selectedCategories, setSelectedCategories, category.toLowerCase())}
                    style={{
                      fontFamily: "var(--font-primary)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: selectedCategories.includes(category.toLowerCase()) ? "1px solid #B0674B" : "1px solid #ddd",
                      background: selectedCategories.includes(category.toLowerCase()) ? "#B0674B" : "#fff",
                      color: selectedCategories.includes(category.toLowerCase()) ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {category}
                    <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                      {selectedCategories.includes(category.toLowerCase()) ? "-" : "+"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLOR DROPDOWN */}
          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={() => toggleDropdown("colors")}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#f9f9f9",
                color: "#333",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "var(--font-primary)",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease"
              }}
            >
              COLOR
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                {expandedDropdowns.colors ? "▼" : "▶"}
              </span>
            </button>
            {expandedDropdowns.colors && (
              <div style={{ paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleFilter(selectedColors, setSelectedColors, color.toLowerCase())}
                    style={{
                      fontFamily: "var(--font-primary)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: selectedColors.includes(color.toLowerCase()) ? "1px solid #B0674B" : "1px solid #ddd",
                      background: selectedColors.includes(color.toLowerCase()) ? "#B0674B" : "#fff",
                      color: selectedColors.includes(color.toLowerCase()) ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {color}
                    <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                      {selectedColors.includes(color.toLowerCase()) ? "-" : "+"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* OCCASION DROPDOWN */}
          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={() => toggleDropdown("occasions")}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#f9f9f9",
                color: "#333",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "var(--font-primary)",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease"
              }}
            >
              OCCASION
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                {expandedDropdowns.occasions ? "▼" : "▶"}
              </span>
            </button>
            {expandedDropdowns.occasions && (
              <div style={{ paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {OCCASION_OPTIONS.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => toggleFilter(selectedOccasions, setSelectedOccasions, occasion.toLowerCase())}
                    style={{
                      fontFamily: "var(--font-primary)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: selectedOccasions.includes(occasion.toLowerCase()) ? "1px solid #B0674B" : "1px solid #ddd",
                      background: selectedOccasions.includes(occasion.toLowerCase()) ? "#B0674B" : "#fff",
                      color: selectedOccasions.includes(occasion.toLowerCase()) ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {occasion}
                    <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                      {selectedOccasions.includes(occasion.toLowerCase()) ? "-" : "+"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* WEATHER DROPDOWN */}
          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={() => toggleDropdown("weather")}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#f9f9f9",
                color: "#333",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "var(--font-primary)",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease"
              }}
            >
              WEATHER
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                {expandedDropdowns.weather ? "▼" : "▶"}
              </span>
            </button>
            {expandedDropdowns.weather && (
              <div style={{ paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {WEATHER_OPTIONS.map((weather) => (
                  <button
                    key={weather}
                    onClick={() => toggleFilter(selectedWeather, setSelectedWeather, weather.toLowerCase())}
                    style={{
                      fontFamily: "var(--font-primary)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: selectedWeather.includes(weather.toLowerCase()) ? "1px solid #B0674B" : "1px solid #ddd",
                      background: selectedWeather.includes(weather.toLowerCase()) ? "#B0674B" : "#fff",
                      color: selectedWeather.includes(weather.toLowerCase()) ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {weather}
                    <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                      {selectedWeather.includes(weather.toLowerCase()) ? "-" : "+"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS SECTION */}
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
                  onClick={() => {saveOutfit(userId, outfitResult.items.map(), outfitResult.outfitImage)}}
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
    </div>
  );
}