import { useNavigate } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      {/* 🔷 LINKS */}
      <div className="footer-links">
        <span onClick={() => navigate("/about")}>About Us</span>
        <span onClick={() => navigate("/terms")}>Terms</span>
        <span onClick={() => navigate("/privacy")}>Privacy</span>
        <span onClick={() => navigate("/faq")}>FAQs</span>
      </div>

      {/* 🔷 SOCIAL */}
      <div className="footer-social">
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noreferrer">
          Twitter
        </a>
      </div>

      {/* 🔷 COPYRIGHT */}
      <div className="footer-bottom">
        © 2025 MyProperty | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
