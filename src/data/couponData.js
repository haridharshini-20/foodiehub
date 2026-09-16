const couponData = [
  {
    code: "FOODIE20",
    title: "20% OFF",
    description: "Get 20% off on your food order",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 300,
    icon: "🔥",
  },

  {
    code: "WELCOME50",
    title: "₹50 OFF",
    description: "Flat ₹50 off on your order",
    discountType: "flat",
    discountValue: 50,
    minOrder: 250,
    icon: "🎁",
  },

  {
    code: "SAVE100",
    title: "₹100 OFF",
    description: "Flat ₹100 off on bigger orders",
    discountType: "flat",
    discountValue: 100,
    minOrder: 500,
    icon: "💰",
  },

  {
    code: "TASTY10",
    title: "10% OFF",
    description: "Enjoy 10% off your favorite meals",
    discountType: "percentage",
    discountValue: 10,
    minOrder: 200,
    icon: "🍕",
  },
];

export default couponData;