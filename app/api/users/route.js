import { NextResponse } from "next/server";
import connectMongoDB from "../../lib/mongodb";
import User from "../../models/User";

// GET /api/users?q=search
export async function GET(req) {
  try {
    await connectMongoDB();

    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";

    // If empty search, return empty list
    if (!q.trim()) {
      return NextResponse.json({ users: [] });
    }

    // Search by name OR email (case-insensitive)
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    }).select("name email _id");

    return NextResponse.json({ users });
  } catch (err) {
    console.error("❌ User search error:", err);
    return NextResponse.json(
      { message: "Failed to search users" },
      { status: 500 }
    );
  }
}
