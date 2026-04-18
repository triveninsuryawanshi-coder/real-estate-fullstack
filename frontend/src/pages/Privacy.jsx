import React from "react";
import Footer from "../components/Footer";
import "../styles/privacy.css";

function Privacy() {
  return (
    <>
      <div className="privacy-container">
        <div className="privacy-box">
          <h1 className="privacy-title">Privacy Policy</h1>

          <p>
            At <strong>MyProperty</strong>, we respect your privacy and ensure
            your data is protected.
          </p>

          <h3>1. Data Collection</h3>
          <p>
            We collect personal, technical, and transactional data to improve
            our services.
          </p>

          <h3>2. How We Use Data</h3>
          <ul>
            <li>Provide better services</li>
            <li>Improve user experience</li>
            <li>Send updates and offers</li>
          </ul>

          <h3>3. Sharing</h3>
          <p>
            We do not sell your data. It is shared only with trusted partners
            when necessary.
          </p>

          <h3>4. Security</h3>
          <p>
            We use industry-standard security practices to protect your data.
          </p>

          <h3>5. User Rights</h3>
          <p>You can access, update, or delete your data anytime.</p>

          <h3>6. Contact</h3>
          <p>Email: support@myproperty.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Privacy;
