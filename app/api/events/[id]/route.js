import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function PUT(req, { params }) {
  const { id } = params;
  const updatedData = await req.json();
  await connectMongoDB();
  await Event.findByIdAndUpdate(id, updatedData);
  return NextResponse.json({ message: "Event updated successfully" });
}