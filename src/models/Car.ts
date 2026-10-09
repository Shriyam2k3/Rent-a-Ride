import mongoose, { Schema, Document } from "mongoose";
import { CarCategory, FuelType, TransmissionType } from "@/types";

export interface ICarDocument {
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
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICarDocument>(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ["SUV", "Sedan", "Luxury", "Electric", "Sports", "Hatchback"],
      index: true,
    },
    dailyRate: { type: Number, required: true, min: 0 },
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Automatic", "Manual"],
    },
    seats: { type: Number, required: true, min: 1 },
    doors: { type: Number, default: 4 },
    mileage: { type: String, default: "Unlimited" },
    features: [{ type: String }],
    images: [{ type: String }],
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Car || mongoose.model<ICarDocument>("Car", CarSchema);
