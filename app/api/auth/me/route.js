import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongodb";
import User from "../../../models/User";
import { verifyToken } from "../../../../lib/auth";

export async function GET(request) {
  try {
    // ✅ Get token from headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ✅ Connect to MongoDB
    await connectMongoDB();

    // ✅ Find the user by ID using Mongoose
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User authenticated", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { message: "Error verifying token", error: error.message },
      { status: 500 }
    );
  }
}
