import React, { useState, useCallback, useEffect } from "react";
import "../styles/wardrobe.css";

const CATEGORY_OPTIONS = ["Tops", "Bottoms", "One-piece", "Outerwear", "Accessories", "Shoes"];
const COLOR_OPTIONS = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Black", "White", "Grey", "Mixed"];
const OCCASION_OPTIONS = ["Business casual", "Casual", "Formal", "Black tie", "Ethnic", "Leisure"];
const WEATHER_OPTIONS = ["Spring", "Summer", "Fall", "Winter"];

export default function Wardrobe() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 = upload, 2 = tagging
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [category, setCategory] = useState(null);
  const [color, setColor] = useState(null);
  const [occasion, setOccasion] = useState(null);
  const [weather, setWeather] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  
  const [filterCategory, setFilterCategory] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterOccasion, setFilterOccasion] = useState("");
  const [filterWeather, setFilterWeather] = useState("");

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [editColor, setEditColor] = useState(null);
  const [editOccasion, setEditOccasion] = useState(null);
  const [editWeather, setEditWeather] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);

  useEffect(() => {
    const fetchWardrobeItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch("http://localhost:8000/wardrobe", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wardrobe items");
        }

        const data = await response.json();
        setWardrobeItems(data.items);
      } catch (error) {
        console.error("Fetch wardrobe items error:", error);
      }
    };

    fetchWardrobeItems();
  }, []);

  const filteredItems = wardrobeItems.filter(item => {
    return (
      (!filterCategory || item.category === filterCategory) &&
      (!filterColor || item.color === filterColor) &&
      (!filterOccasion || item.occasion === filterOccasion) &&
      (!filterWeather || item.weather === filterWeather)
    );
  });

  const resetState = () => {
    setStep(1);
    setFile(null);
    setPreviewUrl("");
    setCategory(null);
    setColor(null);
    setOccasion(null);
    setWeather(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetState();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleFileSelected = (selected) => {
    if (!selected) return;
    const f = Array.isArray(selected) ? selected[0] : selected;
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelected(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
      }
    },
    [] // no deps
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImport = () => {
    if (!file) return;
    setStep(2);
  };

  const handleAdd = async () => {
    if (!file || !category || !color || !occasion || !weather) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", category.toLowerCase());
      formData.append("color", color.toLowerCase());
      formData.append("occasion", occasion.toLowerCase());
      formData.append("weather", weather.toLowerCase());
      
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8000/wardrobe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload wardrobe item");
      }
      
      const data = await response.json();
      console.log("Wardrobe item uploaded successfully:", data);
      
      // Add the new item to the wardrobe items list
      setWardrobeItems(prev => [...prev, data.cloth]);
      
      closeModal();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload wardrobe item: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const isTaggingValid = category && color && occasion && weather;

  // Edit modal functions
  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditCategory(item.category.charAt(0).toUpperCase() + item.category.slice(1));
    setEditColor(item.color.charAt(0).toUpperCase() + item.color.slice(1));
    setEditOccasion(item.occasion.charAt(0).toUpperCase() + item.occasion.slice(1));
    setEditWeather(item.weather.charAt(0).toUpperCase() + item.weather.slice(1));
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
    setEditCategory(null);
    setEditColor(null);
    setEditOccasion(null);
    setEditWeather(null);
  };

  const handleUpdate = async () => {
    if (!editingItem || !editCategory || !editColor || !editOccasion || !editWeather) return;
    
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8000/wardrobe/${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: editCategory,
          color: editColor,
          occasion: editOccasion,
          weather: editWeather,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update wardrobe item");
      }
      
      const data = await response.json();
      console.log("Wardrobe item updated successfully:", data);
      
      // Update the item in the wardrobe items list
      setWardrobeItems(prev => 
        prev.map(item => 
          item._id === editingItem._id ? data.cloth : item
        )
      );
      
      closeEditModal();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update wardrobe item: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8000/wardrobe/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete wardrobe item");
      }
      
      console.log("Wardrobe item deleted successfully");
      
      // Remove the item from the wardrobe items list
      setWardrobeItems(prev => prev.filter(item => item._id !== itemId));
      
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete wardrobe item: " + error.message);
    }
  };

  const isEditValid = editCategory && editColor && editOccasion && editWeather;

  // View modal functions
  const handleViewClick = (item) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingItem(null);
  };

  return (
    <>
      <div className="wardrobe-container">
        {/* Sidebar Filters */}
        <div className="wardrobe-sidebar">
          <h3 style={{ marginBottom: "10px" }}>Filters</h3>

          <label className="filter-label">Category</label>
          <select 
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="one-piece">One-piece</option>
            <option value="outerwear">Outerwear</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>

          <label className="filter-label">Color</label>
          <select 
            className="filter-select"
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
          >
            <option value="">All</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="pink">Pink</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="grey">Grey</option>
            <option value="mixed">Mixed</option>
          </select>

          <label className="filter-label">Occasion</label>
          <select 
            className="filter-select"
            value={filterOccasion}
            onChange={(e) => setFilterOccasion(e.target.value)}
          >
            <option value="">All</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="business casual">Business Casual</option>
            <option value="black tie">Black Tie</option>
            <option value="ethnic">Ethnic</option>
            <option value="leisure">Leisure</option>
          </select>

          <label className="filter-label">Weather</label>
          <select 
            className="filter-select"
            value={filterWeather}
            onChange={(e) => setFilterWeather(e.target.value)}
          >
            <option value="">All</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
          </select>
        </div>

        {/* Main Section */}
        <div className="wardrobe-main">

          <div className="wardrobe-title-row">
            <h1>MY WARDROBE</h1>
          </div>

          {/* Clothing Grid */}
          <div className="wardrobe-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div className="wardrobe-card" key={item._id}>
                  <div className="wardrobe-card-image">
                    <img
                      src={item.imageData}
                      alt={`${item.category} - ${item.color}`}
                    />
                  </div>

                  <p className="wardrobe-card-title">
                    {item.category}
                  </p>
                  <p className="wardrobe-card-details">
                    {item.color} • {item.occasion}
                  </p>
                  <p className="wardrobe-card-weather">
                    {item.weather}
                  </p>

                  <div className="wardrobe-card-buttons">
                    <button 
                      className="wardrobe-card-btn"
                      onClick={() => handleViewClick(item)}
                    >
                      View
                    </button>
                    <button 
                      className="wardrobe-card-btn"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-card-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : wardrobeItems.length === 0 ? (
              <div className="wardrobe-empty">
                <h3>No wardrobe items yet</h3>
                <p>Click "Add Item" to upload your first clothing item!</p>
              </div>
            ) : (
              <div className="wardrobe-empty">
                <h3>No items match your filters</h3>
                <p>Try adjusting your filter settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav-bar">

        {/* Upload */}
        <div 
          className="nav-circle-btn"
          onClick={handleOpenModal}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
      </div>

      {/* Upload + Tagging Modal */}
      {isModalOpen && (
        <>
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="modal-container">
            {step === 1 ? (
              <>
                <h2 className="modal-title">
                  ADD WARDROBE ITEM!
                </h2>

                <div
                  className="upload-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="upload-icon">
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="upload-text">
                    DRAG & DROP OR{" "}
                    <label className="upload-file-label">
                      CHOOSE FILE
                      <input
                        type="file"
                        accept="image/*"
                        className="upload-file-input"
                        onChange={(e) => handleFileSelected(e.target.files?.[0])}
                      />
                    </label>{" "}
                    TO UPLOAD
                  </div>
                </div>

                <div className="modal-buttons">
                  <button onClick={closeModal} className="modal-btn modal-btn-cancel">
                    CANCEL
                  </button>
                  <button 
                    onClick={handleImport}
                    disabled={!file}
                    className="modal-btn modal-btn-primary"
                  >
                    IMPORT
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="preview-container">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="preview-image"
                    />
                  )}
                </div>

                <div className="tag-grid">
                  {/* Category */}
                  <TagColumn
                    title="Category"
                    options={CATEGORY_OPTIONS}
                    selected={category}
                    onSelect={setCategory}
                  />

                  {/* Color */}
                  <TagColumn
                    title="Color"
                    options={COLOR_OPTIONS}
                    selected={color}
                    onSelect={setColor}
                  />

                  {/* Occasion */}
                  <TagColumn
                    title="Occasion"
                    options={OCCASION_OPTIONS}
                    selected={occasion}
                    onSelect={setOccasion}
                  />

                  {/* Weather */}
                  <TagColumn
                    title="Weather"
                    options={WEATHER_OPTIONS}
                    selected={weather}
                    onSelect={setWeather}
                  />
                </div>

                <div className="tag-buttons">
                  <button onClick={closeModal} className="tag-btn-cancel">
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!isTaggingValid || isUploading}
                    className="tag-btn-add"
                  >
                    {isUploading ? "Uploading..." : "Add"}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <>
          <div className="modal-backdrop" onClick={closeEditModal} />
          <div className="modal-container">
            <div className="preview-container">
              {editingItem && (
                <img
                  src={editingItem.imageData}
                  alt="Edit preview"
                  className="preview-image"
                />
              )}
            </div>

            <div className="tag-grid">
              {/* Category */}
              <TagColumn
                title="Category"
                options={CATEGORY_OPTIONS}
                selected={editCategory}
                onSelect={setEditCategory}
              />

              {/* Color */}
              <TagColumn
                title="Color"
                options={COLOR_OPTIONS}
                selected={editColor}
                onSelect={setEditColor}
              />

              {/* Occasion */}
              <TagColumn
                title="Occasion"
                options={OCCASION_OPTIONS}
                selected={editOccasion}
                onSelect={setEditOccasion}
              />

              {/* Weather */}
              <TagColumn
                title="Weather"
                options={WEATHER_OPTIONS}
                selected={editWeather}
                onSelect={setEditWeather}
              />
            </div>

            <div className="tag-buttons">
              <button onClick={closeEditModal} className="tag-btn-cancel">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!isEditValid || isUpdating}
                className="tag-btn-add"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <>
          <div className="modal-backdrop" onClick={closeViewModal} />
          <div className="view-modal-container">
            {viewingItem && (
              <>
                <button 
                  className="view-modal-close"
                  onClick={closeViewModal}
                >
                  ×
                </button>
                
                <div className="view-modal-image">
                  <img
                    src={viewingItem.imageData}
                    alt={`${viewingItem.category} - ${viewingItem.color}`}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

function TagColumn({ title, options, selected, onSelect }) {
  return (
    <div className="tag-column">
      <div className="tag-column-title">
        {title}
      </div>
      <div className="tag-options">
        {options.map((opt) => {
          const isActive = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(isActive ? null : opt)}
              className={`tag-option ${isActive ? 'active' : ''}`}
            >
              <span>{opt}</span>
              <span>{isActive ? "−" : "+"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}