import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { mockDb } from "@/lib/mock-db";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      // Search by _id or bookingCode
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = { bookingCode: id };
      if (mongoose.Types.ObjectId.isValid(id)) {
        query.$or = [{ _id: id }, { bookingCode: id }];
        delete query.bookingCode;
      }
      const booking = await Booking.findOne(query).lean();
      if (booking) {
        return NextResponse.json({ success: true, booking });
      }
    }

    // Mock fallback
    const booking = mockDb.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: unknown) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const db = await connectToDatabase();
    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = { bookingCode: id };
      if (mongoose.Types.ObjectId.isValid(id)) {
        query.$or = [{ _id: id }, { bookingCode: id }];
        delete query.bookingCode;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;

      const updated = await Booking.findOneAndUpdate(query, { $set: updateData }, { new: true }).lean();
      if (updated) {
        return NextResponse.json({ success: true, booking: updated });
      }
    }

    // Mock fallback
    const updated = mockDb.updateBookingStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
