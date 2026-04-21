import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Properties.css";

const getPropertyImageSrc = (property, index = 0) => {
  const imageUrl = property.images?.[index]?.imageUrl;
  return imageUrl
    ? `http://localhost:8080${imageUrl}`
    : `https://picsum.photos/300/200?random=${property.propertyId}`;
};

function Properties() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const city = query.get("city");
  const listingType = query.get("listingType");

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters state
  const [bhk, setBhk] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [availability, setAvailability] = useState("");
  const [parking, setParking] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // ✅ API CALL (removed listingType for now due to BE issue)
  useEffect(() => {
    if (!city && !listingType) return;

    setLoading(true);
    setError("");

    axios
      .get("http://localhost:8080/api/search", {
        params: {
          ...(city && { city }),
          ...(listingType && { listingType }),
          ...(selectedCategory === "LAND" && { type: "LAND" }),
          ...(propertyType && { propertyType }),
          ...(bhk && { bhk }),
          ...(furnishing && { furnishing }),
          ...(availability && { availability }),
          ...(parking && { parking }),

          sortBy: priceSort ? "price" : "createdAt",
          sortDir:
            priceSort === "LOW_HIGH"
              ? "asc"
              : priceSort === "HIGH_LOW"
                ? "desc"
                : "desc",
        },
      })
      .then((res) => {
        setProperties(res.data.content);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load properties");
      })
      .finally(() => setLoading(false));
  }, [
    city,
    listingType,
    bhk,
    selectedCategory,
    furnishing,
    availability,
    parking,
    priceSort,
  ]);

  useEffect(() => {
    setSelectedCategory(""); // default = ALL
  }, [city, listingType]);

  const filteredProperties = properties.filter((item) => {
    const type = (item.type || "").toUpperCase();
    if (!selectedCategory) return true;

    // LAND ONLY
    if (selectedCategory === "LAND") {
      return type === "LAND";
    }

    // FULL HOUSE ONLY
    if (selectedCategory === "FULL_HOUSE") {
      if (
        !(
          // type === "FULL_HOUSE" ||
          (type === "APARTMENT" || type === "VILLA" || type === "HOUSE")
        )
      )
        return false;
    }
    if (propertyType) {
      return (item.propertyType || "").toUpperCase() === propertyType;
    }

    return true;
  });

  const {
    clearFilters,
  } = () => {
    setBhk("");
    setPropertyType("");
    setPriceSort("");
    setFurnishing("");
    setParking("");
    setAvailability("");
    setSelectedCategory("FULL_HOUSE");
  };
  return (
    <div className="properties-page">
      {/* 🔷 Navbar*/}
      <header className="navbar">
        <h2>Real Estate Dashboard</h2>
      </header>
      <div className="main-content">
        {/* 🔷 SIDEBAR */}
        <aside className="sidebar">
          <h3>Filters</h3>
          {listingType === "BUY" && (
            <div className="filter-group">
              <h4>Property Category</h4>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="FULL_HOUSE"
                    checked={selectedCategory === "FULL_HOUSE"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  Full House
                </label>

                <label>
                  <input
                    type="radio"
                    value="LAND"
                    checked={selectedCategory === "LAND"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  Land / Plot
                </label>
              </div>
            </div>
          )}
          {/* FULL HOUSE FILTER (BUY + RENT) */}
          {((listingType === "BUY" && selectedCategory === "FULL_HOUSE") ||
            listingType === "RENT") && (
            <div className="filter-group">
              <h4>Filters</h4>

              <div className="filter-item">
                <label>BHK Type:</label>
                <select value={bhk} onChange={(e) => setBhk(e.target.value)}>
                  <option value="">Select</option>
                  <option value="1">1BHK</option>
                  <option value="2">2BHK</option>
                  <option value="3">3BHK</option>
                </select>
              </div>

              <div className="filter-item">
                <label>Property Type:</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="HOUSE">House</option>
                </select>
              </div>

              <div className="filter-item">
                <label>Price:</label>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="LOW_HIGH">Low to High</option>
                  <option value="HIGH_LOW">High to Low</option>
                </select>
              </div>

              <div className="filter-item">
                <label>Furnishing:</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="FULL">Full</option>
                  <option value="SEMI">Semi</option>
                  <option value="NONE">None</option>
                </select>
              </div>

              <div className="filter-item">
                <label>Availability:</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="READY">Ready</option>
                  <option value="UNDER_CONSTRUCTION">Under Construction</option>
                </select>
              </div>

              <div className="filter-item">
                <label>Parking:</label>
                <select
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="2W">2W</option>
                  <option value="4W">4W</option>
                </select>
              </div>
            </div>
          )}
          {/* LAND FILTER (ONLY BUY) */}
          {listingType === "BUY" && selectedCategory === "LAND" && (
            <div className="filter-group">
              <h4>Land / Plot Filters</h4>

              <div className="filter-item">
                <label>Price:</label>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="LOW_HIGH">Low to High</option>
                  <option value="HIGH_LOW">High to Low</option>
                </select>
              </div>
            </div>
          )}
          <button
            className="clear-btn"
            onClick={() => {
              setBhk("");
              setPropertyType("");
              setPriceSort("");
              setFurnishing("");
              setAvailability("");
              setParking("");
            }}
          >
            Clear Filters
          </button>
        </aside>
        {/* PROPERTY CARDS */}
        <section className="property-cards">
          <h2>
            {listingType === "BUY"
              ? "Properties for Sale"
              : "Properties for Rent"}{" "}
            in {city}
          </h2>

          {loading ? (
            <p className="no-data">Loading...</p>
          ) : error ? (
            <p className="no-data">{error}</p>
          ) : properties.length === 0 ? (
            <p className="no-data">No properties found</p>
          ) : (
            filteredProperties.map((property) => (
              <div key={property.propertyId} className="card-horizontal">
                <div className="card-img">
                  <img
                    src={getPropertyImageSrc(property)}
                    alt="property"
                  />
                </div>
                <div className="card-info">
                  <h3>{property.title || "No Title"}</h3>

                  <p className="location">📍 {property.city}</p>

                  <p className="price">
                    ₹ {property.price ? property.price.toLocaleString() : "N/A"}
                  </p>

                  <p className="extra">{property.areaSqft} sqft</p>

                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(`/dashboard/property/${property.propertyId}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default Properties;
