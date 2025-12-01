import React from "react";

export default function Wardrobe() {
    return (
        <div className="page-container" style={{ display: "flex" }}>

            {/* Sidebar Filters */}
            <div className="sidebar">
                <h3 style={{ marginBottom: "20px" }}>Filters</h3>

                <label className="filter-label">Category</label>
                <select className="filter-select">
                    <option>Tops</option>
                    <option>Bottoms</option>
                    <option>One-Piece</option>
                    <option>Outerwear</option>
                    <option>Shoes</option>
                    <option>Accessories</option>
                </select>

                <label className="filter-label">Color</label>
                <select className="filter-select">
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
                <select className="filter-select">
                    <option>Casual</option>
                    <option>Formal</option>
                    <option>Athletic</option>
                    <option>Business</option>
                    <option>Business Casual</option>
                    <option>Ethnic</option>
                    <option>Leisure</option>
                </select>

                <label className="filter-label">Weather</label>
                <select className="filter-select">
                    <option>Summer</option>
                    <option>Winter</option>
                    <option>Fall</option>
                    <option>Spring</option>
                </select>
            </div>

            {/* Main Section */}
            <div style={{ flex: 1, paddingLeft: "40px" }}>
                <div className="top-row">
                    <img src="/logo.png" alt="Logo" height="40" />

                    <button className="button-primary">Upload</button>
                </div>

                <h1 style={{ marginTop: "20px" }}>MY WARDROBE</h1>

                <div className="outfit-grid">
                {Array(9)
                    .fill(0)
                    .map((_, i) => (
                    <div className="outfit-card" key={i}>
                        <div>
                        <img alt="Clothing placeholder" />
                        </div>
                        <p>Item {i + 1}</p>
                        <button className="button-primary" style={{ width: "100%" }}>
                        View
                        </button>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
