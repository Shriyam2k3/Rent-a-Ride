import { ICar, IReview } from "@/types";

export const SEED_CARS: Omit<ICar, "_id" | "createdAt">[] = [
  {
    title: "Tesla Model 3 Long Range",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    category: "Electric",
    dailyRate: 7500,
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "570 km range",
    features: ["Autopilot", "Panoramic Glass Roof", "15-inch Touchscreen", "Wireless Charging", "Heated Seats", "Premium Audio"],
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80"
    ],
    location: {
      city: "Prayagraj",
      address: "Civil Lines Hub & MG Marg, Prayagraj"
    },
    isAvailable: true,
    rating: 4.9,
    reviewCount: 38,
    description: "Experience effortless electric driving with blistering acceleration, dual-motor all-wheel drive, and state-of-the-art tech. Ideal for both business commuters and road trips across Uttar Pradesh."
  },
  {
    title: "BMW 3 Series 330i M Sport",
    brand: "BMW",
    model: "330i",
    year: 2023,
    category: "Sedan",
    dailyRate: 8500,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "16.1 km/l",
    features: ["M Sport Package", "Apple CarPlay & Android Auto", "Harman Kardon Audio", "Adaptive Cruise Control", "Leather Interior", "Sunroof"],
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
    ],
    location: {
      city: "Prayagraj",
      address: "Prayagraj Junction (PRYJ) & Leader Road Hub"
    },
    isAvailable: true,
    rating: 4.8,
    reviewCount: 29,
    description: "The benchmark of executive sport sedans. Combines precision German engineering, refined interior craftsmanship, and dynamic driving dynamics for an exhilarating ride."
  },
  {
    title: "Porsche Macan GTS",
    brand: "Porsche",
    model: "Macan GTS",
    year: 2024,
    category: "Luxury",
    dailyRate: 18500,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "11.2 km/l",
    features: ["Twin-Turbo V6", "Sport Chrono Package", "Bose Surround Sound", "Air Suspension", "Active All-Wheel Drive", "Ventilated Seats"],
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
    ],
    location: {
      city: "Prayagraj",
      address: "Bamrauli Airport (IXD) VIP Lounge Hub, Prayagraj"
    },
    isAvailable: true,
    rating: 5.0,
    reviewCount: 22,
    description: "A compact luxury SUV with pure sports car DNA. Thrilling 434-horsepower twin-turbo power paired with unmistakable Porsche ergonomics, ideal for arriving in style."
  },
  {
    title: "Audi Q5 45 TFSI Quattro",
    brand: "Audi",
    model: "Q5",
    year: 2023,
    category: "SUV",
    dailyRate: 11500,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "13.4 km/l",
    features: ["Quattro AWD", "Virtual Cockpit Plus", "Panoramic Sunroof", "Bang & Olufsen 3D Sound", "Lane Assist", "Power Liftgate"],
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541348263662-e0c82661210e?auto=format&fit=crop&w=1200&q=80"
    ],
    location: {
      city: "Lucknow",
      address: "Chaudhary Charan Singh Airport & Gomti Nagar Hub, Lucknow"
    },
    isAvailable: true,
    rating: 4.85,
    reviewCount: 31,
    description: "Versatile luxury SUV designed for comfort in all weather conditions. Generous cargo capacity, intuitive tech displays, and supreme road stability."
  },
  {
    title: "Ford Mustang GT Premium",
    brand: "Ford",
    model: "Mustang GT",
    year: 2023,
    category: "Sports",
    dailyRate: 14000,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 4,
    doors: 2,
    mileage: "10.5 km/l",
    features: ["5.0L Coyote V8", "Active Valve Performance Exhaust", "Brembo Brakes", "SYNC 4 Infotainment", "Digital Cluster", "Track Apps"],
    images: [
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80"
    ],
    location: {
      city: "Varanasi",
      address: "Lal Bahadur Shastri Airport & Cantt Station Hub, Varanasi"
    },
    isAvailable: true,
    rating: 4.9,
    reviewCount: 45,
    description: "Iconic muscle with a roaring 450-hp V8 engine. Designed for unforgettable highway cruising with aggressive styling and unmatched rumble."
  },
  {
    title: "Toyota RAV4 Hybrid XSE",
    brand: "Toyota",
    model: "RAV4 Hybrid",
    year: 2024,
    category: "SUV",
    dailyRate: 4800,
    fuelType: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "21.2 km/l",
    features: ["Electronic On-Demand AWD", "Toyota Safety Sense 2.5", "JBL 11-Speaker Audio", "Roof Rails", "Heated Steering Wheel", "Blind Spot Monitor"],
    images: [
      "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
    ],
    location: {
      city: "Prayagraj",
      address: "Triveni Sangam Darshan & Naini Bridge Hub, Prayagraj"
    },
    isAvailable: true,
    rating: 4.75,
    reviewCount: 52,
    description: "The ultimate road trip companion. Incredible fuel economy, ample ground clearance for spiritual trips and expressway touring, and proven Toyota durability."
  },
  {
    title: "Mercedes-Benz C-Class C300",
    brand: "Mercedes-Benz",
    model: "C300",
    year: 2024,
    category: "Sedan",
    dailyRate: 9800,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "16.9 km/l",
    features: ["MBUX Voice Control", "64-Color Ambient Lighting", "Burmester 3D Sound", "Active Parking Assist", "Leather Seats", "Sunroof"],
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    ],
    location: {
      city: "Ayodhya",
      address: "Maharishi Valmiki Airport & Ram Mandir Dham Hub, Ayodhya"
    },
    isAvailable: true,
    rating: 4.88,
    reviewCount: 34,
    description: "Modern luxury defined. A tranquil cabin packed with intuitive digital innovation, supple materials, and a smooth turbocharged mild-hybrid powertrain."
  },
  {
    title: "Hyundai Ioniq 5 Limited",
    brand: "Hyundai",
    model: "Ioniq 5",
    year: 2024,
    category: "Electric",
    dailyRate: 6500,
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    doors: 4,
    mileage: "631 km range",
    features: ["Ultra-Fast 800V Charging", "Heads-Up Display with AR", "Relaxation Front Seats", "Smart Cruise Control 2", "Vehicle-to-Load (V2L)"],
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80"
    ],
    location: {
      city: "Kanpur",
      address: "Kanpur Central & Swaroop Nagar Hub, Kanpur"
    },
    isAvailable: true,
    rating: 4.82,
    reviewCount: 19,
    description: "Award-winning retro-futuristic electric crossover. Super-fast 10-to-80% charge in just 18 minutes, whisper-quiet ride, and spacious lounge-like interior."
  }
];

export const SEED_REVIEWS: Omit<IReview, "_id" | "carId" | "userId" | "createdAt">[] = [
  {
    userName: "Aarav Sharma",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Renting the Tesla Model 3 in Prayagraj was seamless from start to finish. The car was spotless, fully charged at Civil Lines, and the pickup took less than 3 minutes. Perfect for driving around Sangam and city visits!"
  },
  {
    userName: "Priya Patel",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "The Porsche Macan GTS was in showroom condition. Picked it up at Bamrauli Airport Prayagraj for a weekend expressway drive to Varanasi. Best rental experience with zero hidden fees!"
  },
  {
    userName: "Rahul Verma",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Extremely reliable car and very easy booking flow. Customer support at the Prayagraj Junction hub was top tier and helped us with luggage loading for the Audi Q5. 10/10 service."
  },
  {
    userName: "Ananya Iyer",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 4,
    comment: "Great experience with the BMW 3 Series from Civil Lines, Prayagraj. The car drove like a dream on the Purvanchal Expressway. Courteous staff and quick key handover."
  }
];
