const foodData = [
  // =========================
  // SOUTH INDIAN
  // =========================
  {
    id: 1,
    name: "Hyderabadi Biryani",
    state: "Telangana",
    category: "South Indian",
    price: 280,
    rating: 4.9,
    image: "/biriyani.jpg",
    description:
      "Authentic Hyderabadi biryani prepared with fragrant basmati rice, aromatic spices, and rich traditional flavors.",
    ingredients: [
      "Basmati Rice",
      "Chicken",
      "Saffron",
      "Mint",
      "Fried Onion",
    ],
  },

  {
    id: 2,
    name: "Masala Dosa",
    state: "Tamil Nadu",
    category: "South Indian",
    price: 140,
    rating: 4.8,
    image: "/dosa.jpg",
    description:
      "A crispy golden dosa filled with delicious potato masala and served with coconut chutney and sambar.",
    ingredients: [
      "Rice Batter",
      "Potato",
      "Mustard Seeds",
      "Curry Leaves",
      "Sambar",
    ],
  },

  {
    id: 3,
    name: "Idli",
    state: "Tamil Nadu",
    category: "South Indian",
    price: 80,
    rating: 4.7,
    image: "/idli.jpg",
    description:
      "Soft and fluffy steamed rice cakes served with fresh coconut chutney and hot sambar.",
    ingredients: [
      "Rice",
      "Urad Dal",
      "Coconut Chutney",
      "Sambar",
    ],
  },

  {
    id: 4,
    name: "Vada",
    state: "Tamil Nadu",
    category: "South Indian",
    price: 90,
    rating: 4.7,
    image: "/vada.jpg",
    description:
      "Crispy deep-fried lentil doughnuts with a soft center served with chutneys.",
    ingredients: [
      "Urad Dal",
      "Black Pepper",
      "Curry Leaves",
      "Oil",
    ],
  },

  {
    id: 5,
    name: "Appam",
    state: "Kerala",
    category: "South Indian",
    price: 120,
    rating: 4.8,
    image: "/appam.jpg",
    description:
      "Soft and fluffy Kerala-style appam served with delicious vegetable curry.",
    ingredients: [
      "Rice",
      "Coconut Milk",
      "Yeast",
      "Sugar",
    ],
  },

  // =========================
  // NORTH INDIAN
  // =========================
  {
    id: 6,
    name: "Butter Chicken",
    state: "Punjab",
    category: "North Indian",
    price: 320,
    rating: 4.9,
    image: "/butterchicken.jpg",
    description:
      "Tender chicken cooked in a creamy tomato-based gravy with butter and aromatic Indian spices.",
    ingredients: [
      "Chicken",
      "Butter",
      "Tomato",
      "Cream",
      "Spices",
    ],
  },

  {
    id: 7,
    name: "Paneer Butter Masala",
    state: "Punjab",
    category: "North Indian",
    price: 260,
    rating: 4.8,
    image: "/paneer.jpg",
    description:
      "Soft paneer cubes simmered in a rich buttery tomato gravy flavored with traditional spices.",
    ingredients: [
      "Paneer",
      "Butter",
      "Tomato",
      "Cream",
      "Cashews",
    ],
  },

  {
    id: 8,
    name: "Chole Bhature",
    state: "Delhi",
    category: "North Indian",
    price: 180,
    rating: 4.8,
    image: "/cholebhature.jpg",
    description:
      "Fluffy fried bhature served with spicy chickpea curry, onions, and pickle.",
    ingredients: [
      "Chickpeas",
      "Flour",
      "Onion",
      "Spices",
    ],
  },

  {
    id: 9,
    name: "Rajma Chawal",
    state: "Delhi",
    category: "North Indian",
    price: 170,
    rating: 4.7,
    image: "/rajmachawal.jpg",
    description:
      "Comforting combination of kidney bean curry served over steamed basmati rice.",
    ingredients: [
      "Rajma",
      "Rice",
      "Tomato",
      "Onion",
      "Spices",
    ],
  },

  {
    id: 10,
    name: "Dal Makhani",
    state: "Punjab",
    category: "North Indian",
    price: 210,
    rating: 4.8,
    image: "/dalmakhani.jpg",
    description:
      "Rich and creamy black lentils slow-cooked with butter and fresh cream.",
    ingredients: [
      "Black Lentils",
      "Butter",
      "Cream",
      "Tomato",
    ],
  },

  {
    id: 11,
    name: "Aloo Paratha",
    state: "Punjab",
    category: "North Indian",
    price: 150,
    rating: 4.7,
    image: "/alooparatha.jpg",
    description:
      "Whole wheat flatbread stuffed with spiced mashed potatoes and served with curd.",
    ingredients: [
      "Wheat Flour",
      "Potato",
      "Butter",
      "Spices",
    ],
  },

  // =========================
  // STREET FOOD
  // =========================
  {
    id: 12,
    name: "Vada Pav",
    state: "Maharashtra",
    category: "Street Food",
    price: 60,
    rating: 4.8,
    image: "/vadapav.jpg",
    description:
      "Mumbai's famous street snack made with spicy potato filling inside a soft bun.",
    ingredients: [
      "Pav",
      "Potato",
      "Garlic Chutney",
      "Green Chilli",
    ],
  },

  {
    id: 13,
    name: "Veg Sandwich",
    state: "Maharashtra",
    category: "Street Food",
    price: 110,
    rating: 4.4,
    image: "/sandwich.jpg",
    description:
      "Fresh vegetable sandwich layered with cheese, chutneys, and crunchy vegetables.",
    ingredients: [
      "Bread",
      "Cheese",
      "Tomato",
      "Cucumber",
      "Potato",
    ],
  },

  {
    id: 14,
    name: "Momos",
    state: "Delhi",
    category: "Street Food",
    price: 120,
    rating: 4.8,
    image: "/momos.jpg",
    description:
      "Steamed dumplings stuffed with seasoned vegetables and served with spicy sauce.",
    ingredients: [
      "Flour",
      "Cabbage",
      "Carrot",
      "Spring Onion",
    ],
  },

  {
    id: 15,
    name: "Pani Puri",
    state: "Maharashtra",
    category: "Street Food",
    price: 70,
    rating: 4.9,
    image: "/panipuri.jpg",
    description:
      "Crispy hollow puris filled with tangy tamarind water, potatoes, and chickpeas.",
    ingredients: [
      "Puri",
      "Potato",
      "Chickpeas",
      "Tamarind Water",
    ],
  },

  {
    id: 16,
    name: "Kathi Roll",
    state: "West Bengal",
    category: "Street Food",
    price: 130,
    rating: 4.8,
    image: "/kathiroll.jpg",
    description:
      "Soft paratha wrapped around flavorful fillings with vegetables and sauces.",
    ingredients: [
      "Paratha",
      "Paneer",
      "Onion",
      "Capsicum",
      "Sauce",
    ],
  },

  // =========================
  // DESSERTS
  // =========================
  {
    id: 17,
    name: "Chocolate Cake",
    state: "Dessert",
    category: "Dessert",
    price: 160,
    rating: 4.9,
    image: "/cake.jpg",
    description:
      "Rich and moist chocolate cake topped with smooth chocolate frosting.",
    ingredients: [
      "Flour",
      "Chocolate",
      "Butter",
      "Sugar",
      "Eggs",
    ],
  },

  {
    id: 18,
    name: "Gulab Jamun",
    state: "Dessert",
    category: "Dessert",
    price: 120,
    rating: 4.9,
    image: "/gulabjamun.jpg",
    description:
      "Soft milk dumplings soaked in warm sugar syrup flavored with cardamom.",
    ingredients: [
      "Milk Solids",
      "Sugar Syrup",
      "Cardamom",
    ],
  },

  {
    id: 19,
    name: "Rasmalai",
    state: "Dessert",
    category: "Dessert",
    price: 140,
    rating: 4.8,
    image: "/rasmalai.jpg",
    description:
      "Creamy cottage cheese patties served in sweet saffron-flavored milk.",
    ingredients: [
      "Paneer",
      "Milk",
      "Saffron",
      "Pistachio",
    ],
  },

  {
    id: 20,
    name: "Jalebi",
    state: "Dessert",
    category: "Dessert",
    price: 100,
    rating: 4.8,
    image: "/jalebi.jpg",
    description:
      "Freshly fried crispy spirals dipped in aromatic sugar syrup.",
    ingredients: [
      "Flour",
      "Sugar",
      "Saffron",
      "Ghee",
    ],
  },

  {
    id: 21,
    name: "Rasgulla",
    state: "Dessert",
    category: "Dessert",
    price: 120,
    rating: 4.9,
    image: "/rasgulla.jpg",
    description:
      "Soft and spongy cottage cheese balls soaked in light sugar syrup.",
    ingredients: [
      "Paneer",
      "Sugar Syrup",
      "Cardamom",
    ],
  },

  {
    id: 22,
    name: "Kulfi",
    state: "Dessert",
    category: "Dessert",
    price: 90,
    rating: 4.8,
    image: "/kulfi.jpg",
    description:
      "Traditional Indian frozen dessert made with milk, nuts, and cardamom.",
    ingredients: [
      "Milk",
      "Pistachio",
      "Almond",
      "Cardamom",
    ],
  },

  // =========================
  // DRINKS
  // =========================
  {
    id: 23,
    name: "Fresh Juice",
    state: "Drinks",
    category: "Drinks",
    price: 80,
    rating: 4.8,
    image: "/juice.jpg",
    description:
      "Refreshing mixed fruit juice prepared with fresh seasonal fruits.",
    ingredients: [
      "Seasonal Fruits",
      "Ice",
      "Mint",
    ],
  },

  {
    id: 24,
    name: "Mango Lassi",
    state: "Punjab",
    category: "Drinks",
    price: 90,
    rating: 4.9,
    image: "/lassi.jpg",
    description:
      "Creamy yogurt drink blended with sweet ripe mangoes for a refreshing taste.",
    ingredients: [
      "Yogurt",
      "Mango",
      "Sugar",
      "Cardamom",
    ],
  },

  {
    id: 25,
    name: "Masala Chai",
    state: "India",
    category: "Drinks",
    price: 40,
    rating: 4.8,
    image: "/chai.jpg",
    description:
      "Traditional Indian tea brewed with milk, ginger, and aromatic spices.",
    ingredients: [
      "Tea Leaves",
      "Milk",
      "Ginger",
      "Cardamom",
      "Sugar",
    ],
  },
];

export default foodData;