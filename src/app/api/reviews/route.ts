import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import Car from "@/models/Car";
import { mockDb } from "@/lib/mock-db";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const carId = searchParams.get("carId") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const db = await connectToDatabase();
    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      if (carId && mongoose.Types.ObjectId.isValid(carId)) {
        query.carId = carId;
      }

      let q = Review.find(query).sort({ createdAt: -1 });
      if (limit) q = q.limit(limit);

      const reviews = await q.lean();
      return NextResponse.json({ success: true, count: reviews.length, reviews });
    }

    // Mock fallback
    let reviews = mockDb.getReviews(carId);
    if (limit) reviews = reviews.slice(0, limit);

    return NextResponse.json({ success: true, count: reviews.length, reviews });
  } catch (error: unknown) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { carId, userId, bookingId, userName, userAvatar, rating, comment } = body;

    if (!carId || !userName || !rating || !comment) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating)));
    const db = await connectToDatabase();

    if (db && mongoose.Types.ObjectId.isValid(carId)) {
      const review = await Review.create({
        carId,
        userId: userId || "user_anonymous",
        bookingId: bookingId || "",
        userName,
        userAvatar,
        rating: numericRating,
        comment,
      });

      // Recalculate car rating
      const allReviews = await Review.find({ carId });
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await Car.findByIdAndUpdate(carId, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: allReviews.length,
      });

      return NextResponse.json({ success: true, review }, { status: 201 });
    }

    // Mock fallback
    const review = mockDb.createReview({
      carId,
      userId: userId || "user_anonymous",
      bookingId: bookingId || "",
      userName,
      userAvatar,
      rating: numericRating,
      comment,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Review ID required" }, { status: 400 });

    const db = await connectToDatabase();
    if (db && mongoose.Types.ObjectId.isValid(id)) {
      await Review.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: "Review deleted" });
    }

    mockDb.deleteReview(id);
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error: unknown) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
