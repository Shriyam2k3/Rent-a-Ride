import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Car from "@/models/Car";
import Review from "@/models/Review";
import { mockDb } from "@/lib/mock-db";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const car = await Car.findById(id).lean();
        if (car) {
          const reviews = await Review.find({ carId: car._id }).sort({ createdAt: -1 }).lean();
          return NextResponse.json({ success: true, car, reviews });
        }
      }
    }

    // Mock fallback
    const car = mockDb.getCarById(id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    const reviews = mockDb.getReviews(car._id);
    return NextResponse.json({ success: true, car, reviews });
  } catch (error: unknown) {
    console.error("GET /api/cars/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch car details" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const db = await connectToDatabase();
    if (db) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updatedCar = await Car.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
        if (updatedCar) {
          return NextResponse.json({ success: true, car: updatedCar });
        }
      }
    }

    const updatedCar = mockDb.updateCar(id, body);
    if (!updatedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, car: updatedCar });
  } catch (error: unknown) {
    console.error("PUT /api/cars/[id] error:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Car.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Car deleted successfully" });
      }
    }

    const success = mockDb.deleteCar(id);
    if (!success) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Car deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE /api/cars/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}
