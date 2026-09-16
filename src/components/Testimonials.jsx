import "./Testimonials.css";

function Testimonials() {
  return (
    <section className="testimonials">

      <h2>What Our Customers Say</h2>

      <div className="testimonial-container">

        <div className="testimonial-card">
          <p>
            "The food was delicious and delivered on time.
            My family loved the Hyderabadi Biryani!"
          </p>

          <h4>— Rahul Sharma</h4>

          <span>⭐⭐⭐⭐⭐</span>
        </div>

        <div className="testimonial-card">
          <p>
            "Amazing variety of Indian dishes.
            The ordering process was smooth and simple."
          </p>

          <h4>— Priya Patel</h4>

          <span>⭐⭐⭐⭐⭐</span>
        </div>

        <div className="testimonial-card">
          <p>
            "One of the best food ordering websites I've used.
            The desserts were absolutely delicious!"
          </p>

          <h4>— Arjun Kumar</h4>

          <span>⭐⭐⭐⭐⭐</span>
        </div>

      </div>

    </section>
  );
}

export default Testimonials;