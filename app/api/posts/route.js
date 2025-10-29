import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Post from "../../models/Post"; // ✅ Correct path (models is inside app/)

export async function GET() {
  try {
    await connectMongoDB();
    const posts = await Post.find();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json(
      { message: "Error fetching posts", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId, content, image } = await req.json();
    await connectMongoDB();
    const post = await Post.create({ userId, content, image });
    return NextResponse.json({ message: "Post created", post }, { status: 201 });
  } catch (error) {
    console.error("POST posts error:", error);
    return NextResponse.json(
      { message: "Error creating post", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await connectMongoDB();
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("DELETE posts error:", error);
    return NextResponse.json(
      { message: "Error deleting post", error: error.message },
      { status: 500 }
    );
  }
}
