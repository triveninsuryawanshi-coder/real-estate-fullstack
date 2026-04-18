import { useState } from "react";
import "./dashboard.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("BUY");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (!city) return;

    navigate(`/dashboard/properties?listingType=${activeTab}&city=${city}`);
  };

  return (
    <div className="dashboard">
      {/* 🔷 HERO SECTION */}
      <div className="hero">
        <h1>Find Your Dream Home 🏡</h1>
        <p>Buy or Rent properties without brokerage. Trusted by thousands.</p>

        {/* 🔷 TABS */}
        <div className="tabs">
          <span
            className={activeTab === "BUY" ? "active" : ""}
            onClick={() => setActiveTab("BUY")}
          >
            Buy
          </span>

          <span
            className={activeTab === "RENT" ? "active" : ""}
            onClick={() => setActiveTab("RENT")}
          >
            Rent
          </span>
        </div>

        {/* 🔷 SEARCH */}
        <div className="search-box">
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select City</option>
            <option>Pune</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
            <option>Nashik</option>
          </select>

          <button disabled={!city} onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* 🔷 INFO SECTION */}
      <div className="info-section">
        <div className="info-card">
          <h3>🏠 100% Verified Listings</h3>
          <p>All properties are verified for trust & safety.</p>
        </div>

        <div className="info-card">
          <h3>💰 No Brokerage</h3>
          <p>Save money by connecting directly with owners.</p>
        </div>

        <div className="info-card">
          <h3>⚡ Fast Search</h3>
          <p>Find your home quickly with smart filters.</p>
        </div>
      </div>

      {/* 🔷 MOTIVATION SECTION */}
      <div className="motivation">
        <h2>Your Dream Home Awaits ✨</h2>
        <p>
          Whether you want to buy your first home or rent a comfortable place,
          we make the journey simple, fast, and stress-free.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
