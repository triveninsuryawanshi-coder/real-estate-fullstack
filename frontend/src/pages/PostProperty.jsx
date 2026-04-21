import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PostProperty.css";

function PostProperty() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [view, setView] = useState("LIST"); // FORM | LIST | DETAIL
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    price: "",
    type: "APARTMENT",
    bedrooms: "",
    bathrooms: "",
    address: "",
    description: "",
    listingType: "SELL",
  });

  // ✅ Load data
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get("view");

    if (viewParam === "form") {
      setView("FORM");
    } else if (viewParam === "list") {
      setView("LIST");
    } else {
      setView("LIST"); // default
    }

    fetchProperties();
  }, [location.search]);
  const fetchProperties = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/properties/owner/${user?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("API DATA 👉", res.data); // 🔥 debug
      setProperties(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ownerId: user?.userId,
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      status: editId ? "PENDING" : "PENDING",
    };
    let propertyId;
    let res;

    if (editId) {
      res = await axios.put(
        `http://localhost:8080/api/properties/${editId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      propertyId = editId;
    } else {
      res = await axios.post("http://localhost:8080/api/properties", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      propertyId = res.data.propertyId;
    }
    if (images.length > 0) {
      const imgData = new FormData();

      for (let i = 0; i < images.length; i++) {
        imgData.append("files", images[i]);
      }

      await axios.post(
        `http://localhost:8080/api/properties/${propertyId}/images`,
        imgData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
    await fetchProperties();
    setView("LIST"); // 🔥 switch to list
    setEditId(null);
    setFormData({
      title: "",
      city: "",
      price: "",
      type: "APARTMENT",
      bedrooms: "",
      bathrooms: "",
      address: "",
      description: "",
      listingType: "SELL",
    });
    setImages([]);
  };

  // ✅ Edit
  const handleEdit = (p) => {
    setEditId(p.propertyId);
    setFormData({
      title: p.title || "",
      city: p.city || "",
      price: p.price || "",
      type: p.type || "APARTMENT",
      bedrooms: p.bedrooms || "",
      bathrooms: p.bathrooms || "",
      address: p.address || "",
      description: p.description || "",
      listingType: p.listingType || "SELL",
    });
    setImages([]);
    setView("FORM");
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/properties/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchProperties();
  };

  // ✅ View Details
  const handleView = (p) => {
    setSelectedProperty(p);
    setView("DETAIL");
  };

  return (
    <div className="post-property">
      {/* 🔷 FORM VIEW */}
      {view === "FORM" && (
        <>
          <h2>{editId ? "Edit Property" : "Add Property"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <div className="row1">
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
              >
                <option value="SELL">Sell</option>
                <option value="RENT">Rent</option>
              </select>

              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="HOUSE">House</option>
              </select>
            </div>
            <input
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <div className="row">
              <input
                name="bedrooms"
                placeholder="Bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <input
                name="bathrooms"
                placeholder="Bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              type="file"
              multiple
              onChange={(e) => {
                setImages(e.target.files);
                console.log("Selected images:", e.target.files);
              }}
            />

            <button type="submit">
              {editId ? "Update Property" : "Add Property"}
            </button>
          </form>
        </>
      )}
      {view === "LIST" && (
        <div className="list-container">
          <h2>Your Properties</h2>

          {properties.length === 0 ? (
            <p>No Properties Found</p>
          ) : (
            <div className="property-grid">
              {properties.map((p) => (
                <div key={p.propertyId} className="property-card">
                  <div className="property-img-container">
                    {p.images?.length > 0 ? (
                      <img
                        src={`http://localhost:8080${p.images[0].imageUrl}`}
                        alt="property"
                      />
                    ) : (
                      <div className="no-img">No Image</div>
                    )}
                  </div>

                  <div className="property-info">
                    <h4>{p.title}</h4>
                    <p className="city">{p.city}</p>
                    <p className="price">₹ {p.price}</p>

                    <div className="card-buttons">
                      <button
                        onClick={() => {
                          handleView(p);
                          setCurrentIndex(0);
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          handleEdit(p);
                          navigate("?view=form");
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.propertyId)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {view === "DETAIL" && selectedProperty && (
        <div className="detail-container">
          <h2>Property Details</h2>

          <div className="detail-card">
            {selectedProperty.images?.length > 0 ? (
              <div className="detail-images">
                <img
                  src={`http://localhost:8080${selectedProperty.images[currentIndex].imageUrl}`}
                  alt="property"
                  className="main-image"
                />
                <div className="thumbnail-row">
                  {selectedProperty.images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:8080${img.imageUrl}`}
                      alt="thumb"
                      className={`thumb ${index === currentIndex ? "active" : ""}`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-img">No images available</div>
            )}

            {/* RIGHT SIDE → DETAILS */}
            <div className="detail-info">
              <h3>{selectedProperty.title}</h3>

              <p className="price">₹ {selectedProperty.price}</p>

              <p>
                <strong>📍 Location:</strong> {selectedProperty.city}
              </p>
              <p>
                <strong>🏠 Type:</strong> {selectedProperty.type}
              </p>
              <p>
                <strong>🛏 Bedrooms:</strong> {selectedProperty.bedrooms}
              </p>
              <p>
                <strong>🛁 Bathrooms:</strong> {selectedProperty.bathrooms}
              </p>
              <p>
                <strong>📌 Address:</strong> {selectedProperty.address}
              </p>

              <hr />

              <p className="desc">
                {selectedProperty.description || "No description available"}
              </p>

              <div className="card-buttons">
                <button onClick={() => handleEdit(selectedProperty)}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedProperty.propertyId)}
                >
                  Delete
                </button>
                <button onClick={() => setView("LIST")}>Back</button>
              </div>
            </div>
          </div>
        </div>
      )}
      ;
    </div>
  );
}

export default PostProperty;
