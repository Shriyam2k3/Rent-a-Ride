export type UserRole = "user" | "admin";

export interface IUser {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CarCategory = "SUV" | "Sedan" | "Luxury" | "Electric" | "Sports" | "Hatchback";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";
export type TransmissionType = "Automatic" | "Manual";

export interface ICar {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  dailyRate: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  doors: number;
  mileage: string;
  features: string[];
  images: string[];
  location: {
    city: string;
    address: string;
  };
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  createdAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface IBooking {
  _id: string;
  bookingCode: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  carId: string;
  car: {
    title: string;
    brand: string;
    model: string;
    image: string;
    dailyRate: number;
    category: string;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  pickupLocation: string;
  returnLocation: string;
  notes?: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  carId: string;
  userId: string;
  bookingId?: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}
