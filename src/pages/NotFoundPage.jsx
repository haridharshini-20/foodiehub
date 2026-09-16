import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="not-found-icon">🍽️</div>

      <h1>404</h1>

      <h2>Oops! Page Not Found</h2>

      <p>
        The page you're looking for doesn't exist
        or may have been moved.
      </p>

      <Link to="/" className="home-btn">
        🏠 Back to Home
      </Link>
    </section>
  );
}

export default NotFoundPage;