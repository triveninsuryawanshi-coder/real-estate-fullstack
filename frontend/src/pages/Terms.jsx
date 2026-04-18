import React from "react";
import Footer from "../components/Footer";
import "../styles/terms.css";

function Terms() {
  return (
    <>
      <div className="terms-container">
        <div className="terms-box">
          <h1 className="terms-title">Terms & Conditions</h1>

          <p>
            Welcome to <strong>MyProperty</strong>. By using our platform, you
            agree to comply with the following terms and conditions.
          </p>

          <h3>1. Definitions</h3>
          <p>
            Our platform provides services for buying, selling, and renting
            properties. Users must verify details before making decisions.
          </p>

          <h3>2. Booking & Payment</h3>
          <p>
            Booking requires a token amount. Payments must be made through
            authorized methods only.
          </p>

          <h3>3. Documentation</h3>
          <p>
            Valid ID proof such as Aadhar, PAN, or Passport is required for
            transactions.
          </p>

          <h3>4. Prohibited Activities</h3>
          <ul>
            <li>Posting false or misleading information</li>
            <li>Illegal activities</li>
            <li>Misuse of the platform</li>
          </ul>

          <h3>5. Liability</h3>
          <p>
            We are not responsible for disputes between users or third parties.
          </p>

          <h3>6. Updates</h3>
          <p>
            Terms may be updated anytime. Continued use implies acceptance of
            updated terms.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Terms;
