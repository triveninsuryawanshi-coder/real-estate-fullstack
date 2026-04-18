import { useState } from "react";
import Footer from "../components/Footer";
import "../styles/AboutUs.css";

function About() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <>
      <div className="about-container">
        {/* 🔷 SIDEBAR */}
        <div className="about-sidebar">
          <ul>
            <li
              className={activeTab === "about" ? "active" : ""}
              onClick={() => setActiveTab("about")}
            >
              About Us
            </li>

            <li
              className={activeTab === "contact" ? "active" : ""}
              onClick={() => setActiveTab("contact")}
            >
              Contact Us
            </li>
          </ul>
        </div>

        {/* 🔷 CONTENT */}
        <div className="about-content">
          {/* ABOUT SECTION */}
          {activeTab === "about" && (
            <div className="about-content-box">
              <h1 className="about-title">About Us</h1>

              <p>
                Welcome to <strong>MyProperty</strong> — your trusted partner in
                finding the perfect property.
              </p>

              <p>
                We simplify buying, selling, and renting homes with a seamless,
                transparent, and user-friendly experience.
              </p>

              <h3>Our Mission</h3>
              <p>
                To provide a simple, transparent, and efficient real estate
                experience using modern technology.
              </p>

              <h3>What We Offer</h3>
              <ul>
                <li>✔ Verified property listings</li>
                <li>✔ Direct owner communication</li>
                <li>✔ Advanced search filters</li>
                <li>✔ Easy property posting</li>
              </ul>

              <h3>Why Choose Us?</h3>
              <ul>
                <li>✔ No brokerage fees</li>
                <li>✔ Time-saving platform</li>
                <li>✔ Accurate property details</li>
              </ul>

              <h3>Our Vision</h3>
              <p>
                To become a leading digital real estate platform helping people
                find their dream homes quickly and easily.
              </p>
            </div>
          )}

          {/* CONTACT SECTION */}
          {activeTab === "contact" && (
            <div className="about-content-box">
              <h1 className="contact-title">Contact Us</h1>

              <p>Have questions or need assistance? Reach out to us anytime.</p>

              <div className="contact-row">
                <span className="label">Email</span>
                <a href="mailto:assist@myproperty.in" className="value">
                  assist@myproperty.in
                </a>
              </div>

              <div className="contact-row">
                <span className="label">Phone</span>
                <a href="tel:+919876543210" className="value">
                  +91 9876543210
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔷 FOOTER */}
      <Footer />
    </>
  );
}

export default About;
