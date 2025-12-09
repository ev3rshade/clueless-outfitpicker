import React, { useState } from "react";
import Outfit from "../../../backend/models/Outfit.js";

// Filter options (matching your wardrobe categories)
const CATEGORY_OPTIONS = ["Tops", "Bottoms", "One-piece", "Outerwear", "Accessories", "Shoes"];
const COLOR_OPTIONS = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Black", "White", "Grey", "Mixed"];
const OCCASION_OPTIONS = ["Business casual", "Casual", "Formal", "Black tie", "Ethnic", "Leisure"];
const WEATHER_OPTIONS = ["Spring", "Summer", "Fall", "Winter"];

async function saveOutfit({ token, imagePrompt, outfitImage, items }) {
  try {
    const res = await fetch("http://localhost:8000/outfits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imagePrompt,
        outfitImage,
        items,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to save outfit.");

    console.log("Outfit saved:", data);
    alert("Outfit saved!");
  } catch (error) {
    console.error("Save error:", error);
    alert(error.message);
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
  
  // 1024x1024
  const test64Image = "iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAIAAADwf7zUAAAb20lEQVR4nOzZjxf39fzfcReXEesKK4rEkhItm5SSouQqMsxKaiy0Rmqpo0lh1mRxyI/mmN/StCVipxlqMpbLmIo4J8LMmR9ZjtK+ym/X929wXud8n+c699vtL3ic9znv9/ncP8+Nm/Y+6m7bss03XzM9YckL/vuO0xOWbLrbvtMTljzlg2dMT1jysYM+ND1hyc0XnDg9Ycnbb37X9IQlV57wV9MTlrzythOmJyw592U/nJ6wZPMu95uesOQTF1w6PWHJUS/5R9MTlpz5+tOmJyy57sInTE9YcvfpAQAAwN8cAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBk4zfe87jpDUt2POeQ6QlL3nrpgdMTllz82KOmJyw5deeN0xOWvHe/HaYnLHnFTtv2+/u4r04vWHPP//yR6QlLPrf3SdMTltxy8U3TE5Yceexe0xOWnPPzbfv5b3zRRdMTllx/yS3TE5Y8+j63T09Y4gIAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAEDIhg98+kvTG5a84bE/mZ6w5Gunb5mesGS3l189PWHJj449fHrCktd/+9XTE5Y87OLLpycsedMJD5mesOSiPXeZnrDkjj0OmZ6w5L63nj89YcnD77tt/4f4zFuPm56w5NLjd5yesOToK745PWHJQe95+PSEJdv22wsAAPxFBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAICQDQ869KXTG5bs8uh/Oz1hyX5HbtvP/9ZTj56esGT/r2yZnrDksj88ZXrCktfcvHV6wpJjzn7h9IQl93nIq6YnLDnpxj9PT1jyLz50/PSEJZfs+prpCUtOOf0n0xOW/PYx501PWPKo/7Ztfz+/uP3O0xOWuAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABCy8Z3P+9T0hiVXbv3E9IQlZ5722ekJS96/dcv0hCUffOdt0xOWvOWPO09PWLLr80+YnrDkvHt8aXrCkift+vemJyzZ6dDjpicsedqjLp+esGTL2WdNT1iyy09vn56wZMtdB09PWPKxg7bt9/efvPKU6QlLXAAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAjZ8Lgv/Xh6w5K/e8l50xOWHPbc7aYnLDnoo7dMT1jy5mNeMT1hybd+vml6wpKPvO6a6QlLnnT9+6YnLLntjU+cnrDkiCc/cHrCkjN2uNf0hCVX/PIF0xOWPOP4k6YnLLnP8VdNT1jy6H/5h+kJS7a+7orpCUtcAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACNn47rcfOL1hye8//a+nJyx5zpN/OD1hyTHbHzc9Ycnvr71iesKS93/h/tMTlmw+7lvTE5b8wyMfPz1hyc67v3l6wpJnfPRj0xOW7Puz705PWLLHFdtPT1jypx2eMj1hyTf2+cj0hCW3b9k6PWHJ2x7w8OkJS1wAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAI2fjg/7NlesOSDWfsNj1hycnHPHV6wpId7nHG9IQlD73k49MTltz9jL89PWHJJU///vSEJTv/4q7pCUv2PPbq6QlLzjr4C9MTlnzgT2+anrBknzf8bnrCkod+9QnTE5Zce8BV0xOWvPiLF0xPWHL2/7hzesISFwAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEI2vGXLH6c3LHnes3eanrDkh3f+bnrCkvM3XzE9Ycn3vv7E6QlLnvXNbbvh//7GI6cnLDn0sDdNT1jyrqNePj1hyeZr3j09Yclpf9p7esKS2w85ZHrCkgd8fq/pCUtOuuEF0xOW7HO3r01PWLLXhgdOT1iybf96AAAA/iICAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQMiGg//fOdMblpx51n+cnrDkxn/ziekJS4687sbpCUuedf1/nZ6w5JQnnDA9Yckb9vza9IQlR9x43fSEJR968Lb9/Pc9+ifTE5bcctl+0xOWPPutz5mesOSe7714esKSLefdNT1hyf/95OemJyz50fv+8fSEJS4AAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACEbNhh7x2nNyzZ9Mn/OT1hyd4bnz89Ycn+l1w9PWHJtZ+/eXrCkrddd9T0hCX/67/sPD1hyesPOHl6wpIX33ng9IQle134yOkJS8465WXTE5a87TO/np6w5D0v3Gd6wpKjPrjf9IQl1z/iuukJS078W/97esISFwAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEI2fuvw/aY3rDnuQdMLlpy53WXTE5bccer/n56wZNO/3zg9YckeJ585PWHJU391/fSEJYe9+cTpCUu+u/nK6QlLXvtPt05PWPKYl/276QlL3nXRZ6cnLPnwy8+YnrDkV7edNj1hyTf22356wpKj7/2F6QlLXAAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAjZ+L3DXj29YclFO7x0esKSg845f3rCkgMe/+XpCUsu/eY/m56w5MarL5mesGT7o2+fnrDk62/87fSEJffc+pLpCUvuuuCn0xOWPOIfPH16wpIjX73/9IQl//z+J05PWPKOH1w7PWHJD457x/SEJT++atP0hCUuAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhGz4zn0/M71hyZ6nvnR6wpIb7/eS6QlLHnHHa6cnLDn98humJyy5+ahdpycsectuX56esGS7s588PWHJ5sP/OD1hyZaD3z89Ycmd3/7F9IQlH9+03/SEJTe994jpCUt+c+i2/f3c/zvnT09YsuWY06cnLHEBAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgZMO5h18+vWHJoTf8eHrCkqf94WHTE5bcsfnvTE9Y8shb/8P0hCVbX3ju9IQlD3z2tr3/4K9cOD1hydZzd5+esOSwI0+enrDkdTtvNz1hyRFP+vP0hCV/fuce0xOWbHrWr6cnLPn60feanrDkwKueNz1hiQsAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhG6980YunNyz52W92n56w5Pe/PHF6wpIzd//V9IQlz/3qrtMTlhz2/XdMT1iy29l3TE9Y8qmbrpmesOTjx142PWHJNa/6wfSEJQd8797TE5ZceNEzpycs+fCm/zQ9YcnhO90wPWHJTftu29+fxz/gX01PWOICAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAiAAAAIAQAQAAACECAAAAQgQAAACECAAAAAgRAAAAECIAAAAgRAAAAECIAAAAgBABAAAAIQIAAABCBAAAAIQIAAAACBEAAAAQIgAAACBEAAAAQIgAAACAEAEAAAAhAgAAAEIEAAAAhAgAAAAIEQAAABAiAAAAIEQAAABAyF8HAAD//3wOdjTHktclAAAAAElFTkSuQmCC"

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setOutfitResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/outfits/generate", {
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

    // test case
    // const outfit = {
    //       "items": [],
    //       "imagePrompt": "describe the outfit visually"
    // };

    // setOutfitResult({
    //     success: true,
    //     outfit,
    //     outfitImage: test64Image,
    // });

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
              handleSearch()}
            }
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
                  onClick={() => 
                    saveOutfit({
                      token: localStorage.getItem("token"),
                      items: outfitResult.outfit.items,
                      imagePrompt: outfitResult.outfit.imagePrompt,
                      outfitImage: outfitResult.outfitImage,
                    })
                  }
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