import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";
import Note from "../../../models/Notes.js";

// 🗑 DELETE a note by ID
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    console.error("❌ Error deleting note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
