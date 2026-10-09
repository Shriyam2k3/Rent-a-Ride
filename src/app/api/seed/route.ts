import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Car from "@/models/Car";
import Review from "@/models/Review";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { SEED_CARS, SEED_REVIEWS } from "@/lib/data/seed-data";

export async function POST() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        message: "Using in-memory database with preloaded fleet and reviews.",
      });
    }

    await Car.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});

    const insertedCars = await Car.insertMany(SEED_CARS);

    const reviewsToInsert = SEED_REVIEWS.map((r, index) => ({
      ...r,
      carId: insertedCars[index % insertedCars.length]._id,
      userId: `user_seed_${index}`,
      createdAt: new Date(),
    }));

    await Review.insertMany(reviewsToInsert);

    try {
      const indexes = await User.collection.indexes();
      for (const idx of indexes) {
        if (idx.name && idx.name !== "_id_" && idx.name !== "firebaseUid_1" && idx.name !== "email_1") {
          await User.collection.dropIndex(idx.name);
        }
      }
    } catch {
      // ignore if indexes cannot be dropped or already removed
    }

    const insertedUsers = await User.insertMany([
      {
        firebaseUid: "uid_admin",
        name: "Shriyam",
        email: "admin@rentaride.com",
        role: "admin",
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      },
      {
        firebaseUid: "uid_customer",
        name: "Aarav Sharma",
        email: "aarav.sharma@rentaride.com",
        role: "user",
        phone: "+91 98123 45678",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      },
      {
        firebaseUid: "uid_priya",
        name: "Priya Patel",
        email: "priya.patel@rentaride.com",
        role: "user",
        phone: "+91 98234 56789",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      },
      {
        firebaseUid: "uid_rahul",
        name: "Rahul Verma",
        email: "rahul.verma@rentaride.com",
        role: "user",
        phone: "+91 98345 67890",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      },
      {
        firebaseUid: "uid_ananya",
        name: "Ananya Iyer",
        email: "ananya.iyer@rentaride.com",
        role: "user",
        phone: "+91 98456 78901",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      },
    ]);

    // Initial bookings
    await Booking.insertMany([
      {
        bookingCode: "RAR-82914",
        userId: "uid_customer",
        user: {
          name: "Aarav Sharma",
          email: "aarav.sharma@rentaride.com",
          phone: "+91 98123 45678",
        },
        carId: insertedCars[0]._id,
        car: {
          title: insertedCars[0].title,
          brand: insertedCars[0].brand,
          model: insertedCars[0].model,
          image: insertedCars[0].images[0],
          dailyRate: insertedCars[0].dailyRate,
          category: insertedCars[0].category,
        },
        startDate: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 86400000 * 4),
        totalDays: 3,
        dailyRate: 7500,
        subtotal: 22500,
        tax: 4050,
        totalAmount: 26550,
        status: "confirmed",
        paymentStatus: "paid",
        pickupLocation: "Civil Lines Hub & MG Marg, Prayagraj",
        returnLocation: "Civil Lines Hub & MG Marg, Prayagraj",
        notes: "Request child safety seat",
      },
      {
        bookingCode: "RAR-71043",
        userId: "uid_customer",
        user: {
          name: "Aarav Sharma",
          email: "aarav.sharma@rentaride.com",
          phone: "+91 98123 45678",
        },
        carId: insertedCars[1]._id,
        car: {
          title: insertedCars[1].title,
          brand: insertedCars[1].brand,
          model: insertedCars[1].model,
          image: insertedCars[1].images[0],
          dailyRate: insertedCars[1].dailyRate,
          category: insertedCars[1].category,
        },
        startDate: new Date(Date.now() - 86400000 * 12),
        endDate: new Date(Date.now() - 86400000 * 9),
        totalDays: 3,
        dailyRate: 8500,
        subtotal: 25500,
        tax: 4590,
        totalAmount: 30090,
        status: "completed",
        paymentStatus: "paid",
        pickupLocation: "Prayagraj Junction (PRYJ) & Leader Road Hub",
        returnLocation: "Bamrauli Airport (IXD) VIP Lounge Hub, Prayagraj",
      },
    ]);

    return NextResponse.json({
      success: true,
      message: `Database populated with ${insertedCars.length} cars, ${reviewsToInsert.length} reviews, ${insertedUsers.length} users, and 2 sample bookings.`,
    });
  } catch (error: unknown) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
