import "./Features.css";

function Features() {
  return (
    <section className="features">

      <h2>Why Choose Foodie Hub?</h2>

      <div className="features-container">

        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3>Fast Delivery</h3>
          <p>
            Get your favorite meals delivered quickly and fresh to your doorstep.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👨‍🍳</div>
          <h3>Authentic Recipes</h3>
          <p>
            Enjoy delicious dishes prepared using traditional Indian recipes.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Top Rated</h3>
          <p>
            Loved by food enthusiasts for quality, taste, and excellent service.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Features;