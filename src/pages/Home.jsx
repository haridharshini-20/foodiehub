import { useContext, useState } from "react";
import Hero from "../components/Hero";
import Menu from "../components/Menu";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import couponData from "../data/couponData";
import { CouponContext } from "../contexts/CouponContext";
import "./Home.css";

function Home() {
  const { appliedCoupon, applyCoupon } = useContext(CouponContext);
  const [copiedCoupon, setCopiedCoupon] = useState("");

 const handleCouponClick = async (coupon) => {
  try {
    await navigator.clipboard.writeText(coupon.code);
  } catch (error) {
    console.log("Could not copy coupon:", error);
  }

  applyCoupon(coupon);

  setCopiedCoupon(coupon.code);

  setTimeout(() => {
    setCopiedCoupon("");
  }, 1200);
};
  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Special Offers */}
      <section className="offers-section">

        <div className="offers-header">
          <h2>🔥 Special Offers</h2>
          <p>Save more on your favorite food!</p>
        </div>

        <div className="offers-container">

          {couponData.map((coupon) => (

            <div
             className={`offer-card ${
  appliedCoupon?.code === coupon.code ? "coupon-copied" : ""
}`}
              key={coupon.code}
              onClick={() => handleCouponClick(coupon)}
            >

              <div className="offer-icon">
                {coupon.icon}
              </div>

              <div className="offer-content">

                <h3>{coupon.title}</h3>

                <p>{coupon.description}</p>

                <div className="offer-bottom">

                  <span className="coupon-code">
                   {appliedCoupon?.code === coupon.code
  ? "✓ APPLIED!"
  : coupon.code}
                  </span>

                  <span className="min-order">
                    Min ₹{coupon.minOrder}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

        {copiedCoupon && (
          <div className="coupon-toast">
            🎉 Coupon <strong>{copiedCoupon}</strong> copied!
          </div>
        )}

      </section>

      {/* Features */}
      <Features />

      {/* Menu */}
      <Menu />

      {/* Stats */}
      <Stats />

      {/* Testimonials */}
      <Testimonials />
    </>
  );
}

export default Home;