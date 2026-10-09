import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Car from "@/models/Car";
import { mockDb } from "@/lib/mock-db";
import { SEED_CARS } from "@/lib/data/seed-data";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const transmission = searchParams.get("transmission") || undefined;
    const fuelType = searchParams.get("fuelType") || undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const db = await connectToDatabase();
    if (db) {
      // Auto seed if database is empty
      const count = await Car.countDocuments();
      if (count === 0) {
        await Car.insertMany(SEED_CARS);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
          { "location.city": { $regex: search, $options: "i" } },
        ];
      }
      if (category && category !== "All") {
        query.category = { $regex: new RegExp(`^${category}$`, "i") };
      }
      if (brand && brand !== "All") {
        query.brand = { $regex: new RegExp(`^${brand}$`, "i") };
      }
      if (transmission && transmission !== "All") {
        query.transmission = transmission;
      }
      if (fuelType && fuelType !== "All") {
        query.fuelType = fuelType;
      }
      if (maxPrice) {
        query.dailyRate = { $lte: maxPrice };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let sortOpt: any = { createdAt: -1 };
      if (sortBy === "price-asc") sortOpt = { dailyRate: 1 };
      else if (sortBy === "price-desc") sortOpt = { dailyRate: -1 };
      else if (sortBy === "rating") sortOpt = { rating: -1 };
      else if (sortBy === "newest") sortOpt = { year: -1 };

      let queryExec = Car.find(query).sort(sortOpt);
      if (featured) {
        queryExec = queryExec.limit(6);
      } else if (limit) {
        queryExec = queryExec.limit(limit);
      }

      const cars = await queryExec.lean();
      return NextResponse.json({ success: true, count: cars.length, cars });
    }

    // Mock fallback
    let cars = mockDb.getCars({ search, category, brand, transmission, fuelType, maxPrice, sortBy });
    if (featured) {
      cars = cars.slice(0, 6);
    } else if (limit) {
      cars = cars.slice(0, limit);
    }

    return NextResponse.json({ success: true, count: cars.length, cars });
  } catch (error: unknown) {
    console.error("GET /api/cars error:", error);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      brand,
      model,
      year,
      category,
      dailyRate,
      fuelType,
      transmission,
      seats,
      doors,
      mileage,
      features,
      images,
      location,
      description,
    } = body;

    if (!title || !brand || !model || !dailyRate || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db) {
      const car = await Car.create({
        title,
        brand,
        model,
        year: Number(year) || new Date().getFullYear(),
        category,
        dailyRate: Number(dailyRate),
        fuelType: fuelType || "Petrol",
        transmission: transmission || "Automatic",
        seats: Number(seats) || 5,
        doors: Number(doors) || 4,
        mileage: mileage || "Unlimited",
        features: Array.isArray(features) ? features : [],
        images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"],
        location: location || { city: "Prayagraj", address: "Civil Lines Hub & MG Marg, Prayagraj" },
        description: description || "Premium rental vehicle maintained in top condition.",
        isAvailable: true,
        rating: 5.0,
        reviewCount: 0,
      });

      return NextResponse.json({ success: true, car }, { status: 201 });
    }

    // Mock fallback
    const car = mockDb.createCar({
      title,
      brand,
      model,
      year: Number(year) || new Date().getFullYear(),
      category,
      dailyRate: Number(dailyRate),
      fuelType: fuelType || "Petrol",
      transmission: transmission || "Automatic",
      seats: Number(seats) || 5,
      doors: Number(doors) || 4,
      mileage: mileage || "Unlimited",
      features: Array.isArray(features) ? features : [],
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"],
      location: location || { city: "Prayagraj", address: "Civil Lines Hub & MG Marg, Prayagraj" },
      description: description || "Premium rental vehicle maintained in top condition.",
      isAvailable: true,
    });

    return NextResponse.json({ success: true, car }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/cars error:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}
