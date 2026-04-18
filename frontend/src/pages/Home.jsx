import bg from "../assets/images/bg.jpg";
import "../styles/home.css";
import Navbar from "../components/HomeNavbar";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Background Section */}
      <div className="home-container" style={{ backgroundImage: `url(${bg})` }}>
        <h1>Welcome to MyProperty</h1>
        <p>Find your dream home easily and quickly</p>
      </div>
    </div>
  );
}

export default Home;
