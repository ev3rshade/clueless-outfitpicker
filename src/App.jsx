// TODO 404 not found
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./frontend/components/Navbar.jsx";

import Home from "./frontend/pages/Home.jsx";
import LLMSearch from "./frontend/pages/LLMsearch.jsx";
import Wardrobe from "./frontend/pages/Wardrobe.jsx";
import Outfits from "./frontend/pages/SavedOutfits.jsx"

import Login from "./frontend/pages/Login.jsx";
import Signup from "./frontend/pages/Signup.jsx";
import Account from "./frontend/pages/Account.jsx";


// import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/llmsearch" element={<LLMSearch />} />
        <Route path="/wardrobe" element={<Wardrobe/>} />
        <Route path="/outfits" element={<Outfits/>} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account/>} />
      </Routes>
    </>
  );
}
