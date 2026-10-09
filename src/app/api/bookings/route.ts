import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Car from "@/models/Car";
import { mockDb } from "@/lib/mock-db";
import { calculateRentalDays } from "@/lib/utils";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;
    const status = searchParams.get("status") || undefined;

    const db = await connectToDatabase();
    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      if (userId) query.userId = userId;
      if (status && status !== "all") query.status = status;

      const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, count: bookings.length, bookings });
    }

    // Mock fallback
    let bookings = mockDb.getBookings(userId);
    if (status && status !== "all") {
      bookings = bookings.filter((b) => b.status === status);
    }

    return NextResponse.json({ success: true, count: bookings.length, bookings });
  } catch (error: unknown) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      carId,
      userId,
      user,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      notes,
    } = body;

    if (!carId || !userId || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return NextResponse.json({ error: "Invalid booking dates" }, { status: 400 });
    }

    const totalDays = calculateRentalDays(start, end);
    const db = await connectToDatabase();

    if (db && mongoose.Types.ObjectId.isValid(carId)) {
      const car = await Car.findById(carId);
      if (!car) {
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }

      // Conflict check
      const conflict = await Booking.findOne({
        carId,
        status: { $ne: "cancelled" },
        startDate: { $lte: end },
        endDate: { $gte: start },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "The selected car is already booked for these dates." },
          { status: 409 }
        );
      }

      const dailyRate = car.dailyRate;
      const subtotal = dailyRate * totalDays;
      const tax = Math.round(subtotal * 0.1 * 100) / 100;
      const totalAmount = Math.round((subtotal + tax) * 100) / 100;
      const bookingCode = `RAR-${Math.floor(10000 + Math.random() * 90000)}`;

      const newBooking = await Booking.create({
        bookingCode,
        userId,
        user: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          phone: user?.phone || "+1 (555) 000-0000",
        },
        carId,
        car: {
          title: car.title,
          brand: car.brand,
          model: car.model,
          image: car.images[0] || "",
          dailyRate: car.dailyRate,
          category: car.category,
        },
        startDate: start,
        endDate: end,
        totalDays,
        dailyRate,
        subtotal,
        tax,
        totalAmount,
        status: "confirmed",
        paymentStatus: "paid",
        pickupLocation: pickupLocation || car.location.address,
        returnLocation: returnLocation || car.location.address,
        notes: notes || "",
      });

      return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
    }

    // Mock fallback
    const car = mockDb.getCarById(carId);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const available = mockDb.checkAvailability(carId, startDate, endDate);
    if (!available) {
      return NextResponse.json(
        { error: "The selected car is already booked for these dates." },
        { status: 409 }
      );
    }

    const dailyRate = car.dailyRate;
    const subtotal = dailyRate * totalDays;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const totalAmount = Math.round((subtotal + tax) * 100) / 100;

    const newBooking = mockDb.createBooking({
      userId,
      user: {
        name: user?.name || "Customer",
        email: user?.email || "customer@example.com",
        phone: user?.phone || "+1 (555) 000-0000",
      },
      carId,
      car: {
        title: car.title,
        brand: car.brand,
        model: car.model,
        image: car.images[0] || "",
        dailyRate: car.dailyRate,
        category: car.category,
      },
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      totalDays,
      dailyRate,
      subtotal,
      tax,
      totalAmount,
      status: "confirmed",
      paymentStatus: "paid",
      pickupLocation: pickupLocation || car.location.address,
      returnLocation: returnLocation || car.location.address,
      notes: notes || "",
    });

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
