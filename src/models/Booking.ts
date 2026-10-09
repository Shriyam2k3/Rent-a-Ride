import mongoose, { Schema, Document } from "mongoose";
import { BookingStatus, PaymentStatus } from "@/types";

export interface IBookingDocument {
  bookingCode: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  carId: mongoose.Types.ObjectId;
  car: {
    title: string;
    brand: string;
    model: string;
    image: string;
    dailyRate: number;
    category: string;
  };
  startDate: Date;
  endDate: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    bookingCode: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true, index: true },
    car: {
      title: { type: String, required: true },
      brand: { type: String, required: true },
      model: { type: String, required: true },
      image: { type: String, required: true },
      dailyRate: { type: Number, required: true },
      category: { type: String, required: true },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true, min: 1 },
    dailyRate: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "confirmed",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "paid",
    },
    pickupLocation: { type: String, required: true },
    returnLocation: { type: String, required: true },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", BookingSchema);
