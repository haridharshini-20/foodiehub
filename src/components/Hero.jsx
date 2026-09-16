import { useState } from "react";
import "./Hero.css";
import biryani from "../assets/foods/biriyani.jpg";

function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleExploreMenu = () => {
    const menuSection = document.getElementById("menu");

    if (menuSection) {
      menuSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-welcome">
          🍴 Welcome to Foodie Hub
        </div>

        <h1>
          Taste the Best
          <br />
          of <span>India</span>
        </h1>

        <p>
          Discover delicious Indian dishes, authentic flavors, and
          <br />
          your favorite meals all in one place.
        </p>

        <button
          className="hero-btn"
          onClick={handleExploreMenu}
        >
          Explore Menu 🍽
        </button>

      </div>

      <div className="hero-image-container">

        {!imageLoaded && (
          <div className="image-loader">
            🍛
          </div>
        )}

        <img
          src={biryani}
          alt="Delicious Indian Biryani"
          className={`hero-food-image ${
            imageLoaded ? "image-visible" : ""
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        <div className="hero-circle"></div>

        <div className="food-badge">
          ⭐ 4.9
          <span>Highly Rated</span>
        </div>

      </div>

    </section>
  );
}

export default Hero;