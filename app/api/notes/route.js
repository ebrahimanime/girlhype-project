import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";
import Note from "../../models/Notes.js";

// 🧠 GET all notes
export async function GET() {
  await connectDB();
  const notes = await Note.find({});
  return NextResponse.json(notes);
}

// 📝 POST (create new note)
export async function POST(req) {
  try {
    await connectDB();
    const { text } = await req.json();

    const newNote = await Note.create({ text });
    return NextResponse.json(newNote);
  } catch (error) {
    console.error("❌ Error creating note:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
