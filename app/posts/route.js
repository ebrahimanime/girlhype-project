// app/api/posts/route.js
import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Post from "../../../models/Post";

export async function GET() {
  try {
    // ✅ Connect to MongoDB using Mongoose
    await connectMongoDB();

    // ✅ Fetch posts from Mongoose model
    const posts = await Post.find().populate("author", "name email");

    // ✅ Return as JSON
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, content, author } = await req.json();
    await connectMongoDB();

    const newPost = await Post.create({ title, content, author });

    return NextResponse.json({ message: "Post created", id: newPost._id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}
