import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Car from "@/models/Car";
import User from "@/models/User";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const [totalCars, totalUsers, bookings] = await Promise.all([
        Car.countDocuments(),
        User.countDocuments(),
        Booking.find().sort({ createdAt: -1 }).lean(),
      ]);

      const totalRevenue = bookings
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const activeBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;

      // Group popular cars
      const carBookingCount: Record<string, { title: string; image: string; count: number; revenue: number }> = {};
      bookings.forEach((b) => {
        const key = b.car?.title || "Vehicle";
        if (!carBookingCount[key]) {
          carBookingCount[key] = {
            title: b.car?.title || "Vehicle",
            image: b.car?.image || "",
            count: 0,
            revenue: 0,
          };
        }
        carBookingCount[key].count += 1;
        if (b.status !== "cancelled") {
          carBookingCount[key].revenue += b.totalAmount || 0;
        }
      });

      const popularCars = Object.values(carBookingCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return NextResponse.json({
        success: true,
        stats: {
          totalRevenue,
          activeBookings,
          totalCars,
          totalUsers,
          recentBookings: bookings.slice(0, 6),
          popularCars,
        },
      });
    }

    // Mock fallback
    const bookings = mockDb.getBookings();
    const cars = mockDb.getCars();
    const users = mockDb.getUsers();

    const totalRevenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const activeBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;

    const popularCars = cars.slice(0, 4).map((c, i) => ({
      title: c.title,
      image: c.images[0],
      count: 12 - i * 2,
      revenue: (12 - i * 2) * c.dailyRate * 3,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        activeBookings,
        totalCars: cars.length,
        totalUsers: users.length,
        recentBookings: bookings.slice(0, 6),
        popularCars,
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to generate admin stats" }, { status: 500 });
  }
}
