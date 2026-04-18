import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PropertyDetails.css";

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:8080/api/properties/${Number(id)}`)
      .then((res) => setProperty(res.data))
      .catch((err) => {
        console.error("Error:", err);
        setProperty(null);
      });
  }, [id]);
  const generateDescription = (property) => {
    if (!property) return "";

    return `${property.type} located in ${property.city}, ${property.state}. 
It is a well-designed property with ${property.bedrooms || "multiple"} bedrooms and ${property.bathrooms || "multiple"} bathrooms. 
Spanning ${property.areaSqft || "N/A"} sqft, this home is priced at ₹${property.price}. 
It offers comfortable living with nearby schools, hospitals, transport, and shopping facilities.`;
  };
  if (!property) return <p className="loading">Loading...</p>;

  return (
    <div className="detail-container">
      {/* TITLE */}
      <h2 className="title">{property.title || "No Title"}</h2>

      <div className="image-section">
        {/* LEFT SIDE - THUMBNAILS */}
        <div className="thumbnail-list">
          {(property.imageUrls?.length
            ? property.imageUrls
            : [
                `https://picsum.photos/800/400?random=${id}1`,
                `https://picsum.photos/800/400?random=${id}2`,
                `https://picsum.photos/800/400?random=${id}3`,
              ]
          ).map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumb"
              className={currentImage === index ? "active-thumb" : ""}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>

        {/* RIGHT SIDE - MAIN IMAGE */}
        <div className="main-image">
          <img
            src={
              property.imageUrls?.length
                ? property.imageUrls[currentImage]
                : `https://picsum.photos/800/400?random=${id}${currentImage}`
            }
            alt="property"
          />
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="detail-card">
        <div className="info-grid">
          <p>
            <strong>📍 City:</strong> {property.city}
          </p>
          <p>
            <strong>💰 Price:</strong> ₹ {property.price}
          </p>
          <p>
            <strong>🏢 Type:</strong> {property.type}
          </p>
          <p>
            <strong>📊 Status:</strong> {property.status}
          </p>
          <p>
            <strong>🛏 Bedrooms:</strong> {property.bedrooms || "N/A"}
          </p>
          <p>
            <strong>📐 Area:</strong> {property.areaSqft || "N/A"} sqft
          </p>
        </div>
        {/* DESCRIPTION SECTION */}
        <div className="description-section">
          <h3>Description</h3>
          <p>{generateDescription(property)}</p>
        </div>

        <hr />

        {/* OWNER */}
        <div className="owner-section">
          <h3>Owner Details</h3>
          <p>
            <strong> Name:</strong> {property.contactName}
          </p>

          <p>
            <strong>Contact Number:</strong> {property.contactNumber}
          </p>
          <p>
            <strong>Email:</strong> {property.contactEmail}
          </p>
        </div>

        {/* PAYMENT */}
        <div className="payment-section">
          <h3>Payment</h3>
          <button
            className="pay-btn"
            onClick={() => {
              console.log("BUTTON CLICKED");

              navigate("/dashboard/payment", {
                state: property,
              });
            }}
          >
            Pay Booking Amount
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
