import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { mockDb } from "@/lib/mock-db";
import mongoose from "mongoose";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const users = await User.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, count: users.length, users });
    }

    const users = mockDb.getUsers();
    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: unknown) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = { firebaseUid: userId };
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query.$or = [{ _id: userId }, { firebaseUid: userId }];
        delete query.firebaseUid;
      }

      const updated = await User.findOneAndUpdate(query, { $set: { role } }, { new: true });
      if (updated) {
        return NextResponse.json({ success: true, user: updated });
      }
    }

    const updated = mockDb.updateUserRole(userId, role);
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
