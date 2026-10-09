import { ICar, IBooking, IReview, IUser } from "@/types";
import { SEED_CARS, SEED_REVIEWS } from "./data/seed-data";

class MockDatabase {
  private cars: ICar[] = [];
  private bookings: IBooking[] = [];
  private reviews: IReview[] = [];
  private users: IUser[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    this.cars = SEED_CARS.map((car, index) => ({
      ...car,
      _id: `car_${index + 1}`,
      createdAt: new Date(Date.now() - (index + 1) * 86400000 * 5).toISOString(),
    }));

    this.users = [
      {
        _id: "user_admin",
        firebaseUid: "uid_admin",
        name: "Shriyam",
        email: "admin@rentaride.com",
        role: "admin",
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "user_customer",
        firebaseUid: "uid_customer",
        name: "Aarav Sharma",
        email: "aarav.sharma@rentaride.com",
        role: "user",
        phone: "+91 98123 45678",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "user_priya",
        firebaseUid: "uid_priya",
        name: "Priya Patel",
        email: "priya.patel@rentaride.com",
        role: "user",
        phone: "+91 98234 56789",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        _id: "user_rahul",
        firebaseUid: "uid_rahul",
        name: "Rahul Verma",
        email: "rahul.verma@rentaride.com",
        role: "user",
        phone: "+91 98345 67890",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      },
      {
        _id: "user_ananya",
        firebaseUid: "uid_ananya",
        name: "Ananya Iyer",
        email: "ananya.iyer@rentaride.com",
        role: "user",
        phone: "+91 98456 78901",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      },
    ];

    this.reviews = SEED_REVIEWS.map((r, index) => ({
      _id: `review_${index + 1}`,
      carId: this.cars[index % this.cars.length]._id,
      userId: `user_seed_${index}`,
      userName: r.userName,
      userAvatar: r.userAvatar,
      rating: r.rating,
      comment: r.comment,
      createdAt: new Date(Date.now() - (index + 2) * 86400000 * 3).toISOString(),
    }));

    // Seed realistic active & completed bookings
    this.bookings = [
      {
        _id: "booking_1",
        bookingCode: "RAR-82914",
        userId: "uid_customer",
        user: {
          name: "Aarav Sharma",
          email: "aarav.sharma@rentaride.com",
          phone: "+91 98123 45678",
        },
        carId: this.cars[0]._id,
        car: {
          title: this.cars[0].title,
          brand: this.cars[0].brand,
          model: this.cars[0].model,
          image: this.cars[0].images[0],
          dailyRate: this.cars[0].dailyRate,
          category: this.cars[0].category,
        },
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
        totalDays: 3,
        dailyRate: 7500,
        subtotal: 22500,
        tax: 4050,
        totalAmount: 26550,
        status: "confirmed",
        paymentStatus: "paid",
        pickupLocation: "Civil Lines Hub & MG Marg, Prayagraj",
        returnLocation: "Bamrauli Airport (IXD) VIP Lounge Hub, Prayagraj",
        notes: "Request child safety seat",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        _id: "booking_2",
        bookingCode: "RAR-71043",
        userId: "uid_customer",
        user: {
          name: "Aarav Sharma",
          email: "aarav.sharma@rentaride.com",
          phone: "+91 98123 45678",
        },
        carId: this.cars[1]._id,
        car: {
          title: this.cars[1].title,
          brand: this.cars[1].brand,
          model: this.cars[1].model,
          image: this.cars[1].images[0],
          dailyRate: this.cars[1].dailyRate,
          category: this.cars[1].category,
        },
        startDate: new Date(Date.now() - 86400000 * 12).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 9).toISOString(),
        totalDays: 3,
        dailyRate: 8500,
        subtotal: 25500,
        tax: 4590,
        totalAmount: 30090,
        status: "completed",
        paymentStatus: "paid",
        pickupLocation: "Prayagraj Junction (PRYJ) & Leader Road Hub",
        returnLocation: "Bamrauli Airport (IXD) VIP Lounge Hub, Prayagraj",
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
    ];
  }

  // Cars
  getCars(filter?: {
    search?: string;
    category?: string;
    brand?: string;
    transmission?: string;
    fuelType?: string;
    maxPrice?: number;
    sortBy?: string;
  }): ICar[] {
    let result = [...this.cars];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.location.city.toLowerCase().includes(q)
      );
    }

    if (filter?.category && filter.category !== "All") {
      result = result.filter((c) => c.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter?.brand && filter.brand !== "All") {
      result = result.filter((c) => c.brand.toLowerCase() === filter.brand!.toLowerCase());
    }

    if (filter?.transmission && filter.transmission !== "All") {
      result = result.filter((c) => c.transmission.toLowerCase() === filter.transmission!.toLowerCase());
    }

    if (filter?.fuelType && filter.fuelType !== "All") {
      result = result.filter((c) => c.fuelType.toLowerCase() === filter.fuelType!.toLowerCase());
    }

    if (filter?.maxPrice) {
      result = result.filter((c) => c.dailyRate <= filter.maxPrice!);
    }

    if (filter?.sortBy) {
      switch (filter.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.dailyRate - b.dailyRate);
          break;
        case "price-desc":
          result.sort((a, b) => b.dailyRate - a.dailyRate);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          result.sort((a, b) => b.year - a.year);
          break;
        default:
          break;
      }
    }

    return result;
  }

  getCarById(id: string): ICar | undefined {
    return this.cars.find((c) => c._id === id);
  }

  createCar(carData: Omit<ICar, "_id" | "createdAt" | "rating" | "reviewCount">): ICar {
    const newCar: ICar = {
      ...carData,
      _id: `car_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.cars.unshift(newCar);
    return newCar;
  }

  updateCar(id: string, updates: Partial<ICar>): ICar | null {
    const index = this.cars.findIndex((c) => c._id === id);
    if (index === -1) return null;
    this.cars[index] = { ...this.cars[index], ...updates };
    return this.cars[index];
  }

  deleteCar(id: string): boolean {
    const prevLen = this.cars.length;
    this.cars = this.cars.filter((c) => c._id !== id);
    return this.cars.length < prevLen;
  }

  // Bookings
  getBookings(userId?: string): IBooking[] {
    if (userId) {
      return this.bookings.filter((b) => b.userId === userId);
    }
    return [...this.bookings];
  }

  getBookingById(id: string): IBooking | undefined {
    return this.bookings.find((b) => b._id === id || b.bookingCode === id);
  }

  createBooking(bookingData: Omit<IBooking, "_id" | "createdAt" | "bookingCode">): IBooking {
    const randomCode = `RAR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: IBooking = {
      ...bookingData,
      _id: `booking_${Date.now()}`,
      bookingCode: randomCode,
      createdAt: new Date().toISOString(),
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }

  updateBookingStatus(id: string, status: IBooking["status"]): IBooking | null {
    const b = this.bookings.find((item) => item._id === id || item.bookingCode === id);
    if (!b) return null;
    b.status = status;
    return b;
  }

  checkAvailability(carId: string, start: string, end: string): boolean {
    const reqStart = new Date(start).getTime();
    const reqEnd = new Date(end).getTime();

    // Check existing active bookings for this car
    const conflicts = this.bookings.filter((b) => {
      if (b.carId !== carId) return false;
      if (b.status === "cancelled") return false;
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      return reqStart < bEnd && reqEnd > bStart;
    });

    return conflicts.length === 0;
  }

  // Reviews
  getReviews(carId?: string): IReview[] {
    if (carId) {
      return this.reviews.filter((r) => r.carId === carId);
    }
    return [...this.reviews];
  }

  createReview(review: Omit<IReview, "_id" | "createdAt">): IReview {
    const newReview: IReview = {
      ...review,
      _id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.reviews.unshift(newReview);

    // Update car rating
    const carReviews = this.reviews.filter((r) => r.carId === review.carId);
    const avg = carReviews.reduce((sum, r) => sum + r.rating, 0) / carReviews.length;
    const car = this.cars.find((c) => c._id === review.carId);
    if (car) {
      car.rating = Math.round(avg * 10) / 10;
      car.reviewCount = carReviews.length;
    }

    return newReview;
  }

  deleteReview(id: string): boolean {
    const prev = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r._id !== id);
    return this.reviews.length < prev;
  }

  // Users
  getUsers(): IUser[] {
    return [...this.users];
  }

  getUserById(id: string): IUser | undefined {
    return this.users.find((u) => u._id === id || u.firebaseUid === id || u.email === id);
  }

  syncUser(userData: { firebaseUid: string; email: string; name: string; avatar?: string }): IUser {
    const existing = this.users.find((u) => u.firebaseUid === userData.firebaseUid || u.email === userData.email);
    const isAdmin =
      userData.email.toLowerCase().includes("admin") ||
      (process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).includes(userData.email.toLowerCase()));

    if (existing) {
      existing.name = userData.name || existing.name;
      if (userData.avatar) existing.avatar = userData.avatar;
      if (isAdmin && existing.role !== "admin") existing.role = "admin";
      return existing;
    }

    const newUser: IUser = {
      _id: `user_${Date.now()}`,
      firebaseUid: userData.firebaseUid,
      email: userData.email,
      name: userData.name || userData.email.split("@")[0],
      role: isAdmin ? "admin" : "user",
      avatar: userData.avatar,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUserRole(userId: string, role: "user" | "admin"): IUser | null {
    const u = this.users.find((item) => item._id === userId || item.firebaseUid === userId);
    if (!u) return null;
    u.role = role;
    return u;
  }
}

// Global singleton for hot reloading in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __mockDbInstance: MockDatabase | undefined;
}

if (!global.__mockDbInstance) {
  global.__mockDbInstance = new MockDatabase();
}

export const mockDb = global.__mockDbInstance;
