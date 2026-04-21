import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../service/api";
import "../styles/PropertyDetails.css";

const getPropertyImages = (property, id) =>
  property?.images?.length
    ? property.images.map((image) => `http://localhost:8080${image.imageUrl}`)
    : [
        `https://picsum.photos/800/400?random=${id}1`,
        `https://picsum.photos/800/400?random=${id}2`,
        `https://picsum.photos/800/400?random=${id}3`,
      ];

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [sendingEnquiry, setSendingEnquiry] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [enquiryData, setEnquiryData] = useState({
    buyerName: user.fullName || "",
    buyerEmail: user.email || "",
    buyerPhone: user.phone || "",
    message: "",
  });

  useEffect(() => {
    if (!id) return;
    API
      .get(`/properties/${Number(id)}`)
      .then((res) => setProperty(res.data))
      .catch((err) => {
        console.error("Error:", err);
        setProperty(null);
      });
  }, [id]);

  const handleEnquiryChange = (e) => {
    setEnquiryData({ ...enquiryData, [e.target.name]: e.target.value });
  };

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    setSendingEnquiry(true);
    setEnquiryMessage("");

    try {
      await API.post("/inquiries", {
        propertyId: property.propertyId,
        ...enquiryData,
      });
      setEnquiryMessage("Enquiry sent successfully.");
      setEnquiryData((prev) => ({
        ...prev,
        message: "",
      }));
    } catch (error) {
      console.error("Enquiry error:", error);
      setEnquiryMessage("Failed to send enquiry.");
    } finally {
      setSendingEnquiry(false);
    }
  };

  const generateDescription = (property) => {
    if (!property) return "";

    return `${property.type} located in ${property.city}, ${property.state}. 
It is a well-designed property with ${property.bedrooms || "multiple"} bedrooms and ${property.bathrooms || "multiple"} bathrooms. 
Spanning ${property.areaSqft || "N/A"} sqft, this home is priced at ₹${property.price}. 
It offers comfortable living with nearby schools, hospitals, transport, and shopping facilities.`;
  };
  if (!property) return <p className="loading">Loading...</p>;

  const propertyImages = getPropertyImages(property, id);

  return (
    <div className="detail-container">
      {/* TITLE */}
      <h2 className="title">{property.title || "No Title"}</h2>

      <div className="image-section">
        {/* LEFT SIDE - THUMBNAILS */}
        <div className="thumbnail-list">
          {propertyImages.map((img, index) => (
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
            src={propertyImages[currentImage]}
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

        <div className="owner-section">
          <h3>Send Enquiry</h3>
          <form onSubmit={handleSendEnquiry}>
            <input
              type="text"
              name="buyerName"
              placeholder="Your Name"
              value={enquiryData.buyerName}
              onChange={handleEnquiryChange}
              required
              style={formInput}
            />
            <input
              type="email"
              name="buyerEmail"
              placeholder="Your Email"
              value={enquiryData.buyerEmail}
              onChange={handleEnquiryChange}
              required
              style={formInput}
            />
            <input
              type="text"
              name="buyerPhone"
              placeholder="Your Phone"
              value={enquiryData.buyerPhone}
              onChange={handleEnquiryChange}
              style={formInput}
            />
            <textarea
              name="message"
              placeholder="Write your enquiry"
              value={enquiryData.message}
              onChange={handleEnquiryChange}
              required
              rows="4"
              style={formInput}
            />
            <button type="submit" className="pay-btn" disabled={sendingEnquiry}>
              {sendingEnquiry ? "Sending..." : "Mail Owner"}
            </button>
          </form>
          {enquiryMessage ? <p>{enquiryMessage}</p> : null}
        </div>
      </div>
    </div>
  );
}

const formInput = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxSizing: "border-box",
};

export default PropertyDetail;
