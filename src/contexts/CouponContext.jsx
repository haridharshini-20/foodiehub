import { createContext, useState } from "react";

export const CouponContext = createContext();

function CouponProvider({ children }) {
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const savedCoupon = localStorage.getItem("foodiehub_coupon");
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch {
      return null;
    }
  });

  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);

    localStorage.setItem(
      "foodiehub_coupon",
      JSON.stringify(coupon)
    );
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("foodiehub_coupon");
  };

  return (
    <CouponContext.Provider
      value={{
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export default CouponProvider;