import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Car from "@/models/Car";
import { mockDb } from "@/lib/mock-db";
import { calculateRentalDays } from "@/lib/utils";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Both startDate and endDate are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return NextResponse.json(
        { error: "Invalid date range: return date must be after pickup date" },
        { status: 400 }
      );
    }

    const days = calculateRentalDays(start, end);
    const db = await connectToDatabase();

    if (db && mongoose.Types.ObjectId.isValid(id)) {
      const car = await Car.findById(id);
      if (!car) {
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }

      // Check collision
      const conflictingBooking = await Booking.findOne({
        carId: id,
        status: { $ne: "cancelled" },
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } },
        ],
      });

      const dailyRate = car.dailyRate;
      const subtotal = dailyRate * days;
      const tax = Math.round(subtotal * 0.1 * 100) / 100;
      const totalAmount = Math.round((subtotal + tax) * 100) / 100;

      return NextResponse.json({
        success: true,
        available: !conflictingBooking && car.isAvailable,
        totalDays: days,
        dailyRate,
        subtotal,
        tax,
        totalAmount,
      });
    }

    // Mock fallback
    const car = mockDb.getCarById(id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const isAvailable = mockDb.checkAvailability(id, startDate, endDate) && car.isAvailable;
    const dailyRate = car.dailyRate;
    const subtotal = dailyRate * days;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const totalAmount = Math.round((subtotal + tax) * 100) / 100;

    return NextResponse.json({
      success: true,
      available: isAvailable,
      totalDays: days,
      dailyRate,
      subtotal,
      tax,
      totalAmount,
    });
  } catch (error: unknown) {
    console.error("Availability check error:", error);
    return NextResponse.json({ error: "Failed to verify car availability" }, { status: 500 });
  }
}
