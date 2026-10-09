import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { mockDb } from "@/lib/mock-db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firebaseUid, email, name, avatar } = body;

    if (!firebaseUid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rentaride.com")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    const isAdmin = adminEmails.includes(email.toLowerCase()) || email.toLowerCase().includes("admin");

    const db = await connectToDatabase();
    if (db) {
      let user = await User.findOne({
        $or: [{ firebaseUid }, { email }],
      });

      if (user) {
        if (name && user.name !== name) user.name = name;
        if (avatar && user.avatar !== avatar) user.avatar = avatar;
        if (isAdmin && user.role !== "admin") user.role = "admin";
        await user.save();
      } else {
        user = await User.create({
          firebaseUid,
          email,
          name: name || email.split("@")[0],
          avatar,
          role: isAdmin ? "admin" : "user",
        });
      }

      return NextResponse.json({ success: true, user });
    }

    // Fallback to mockDb
    const syncedUser = mockDb.syncUser({ firebaseUid, email, name, avatar });
    return NextResponse.json({ success: true, user: syncedUser });
  } catch (error: unknown) {
    console.error("Auth sync error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
