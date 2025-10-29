import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Event from "../../models/Event"; // ✅ FIXED import path


// ✅ GET — Fetch all events
export async function GET() {
  try {
    await connectMongoDB();
    const events = await Event.find().sort({ date: 1 }); // upcoming first
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Error fetching events", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST — Add new event
export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    const { title, time, type, description, location, date } = body;
    if (!title || !date) {
      return NextResponse.json(
        { message: "Title and date are required" },
        { status: 400 }
      );
    }

    const newEvent = await Event.create({
      title,
      time,
      type,
      description,
      location,
      date,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error adding event:", error);
    return NextResponse.json(
      { message: "Error adding event", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT — Edit existing event
export async function PUT(request) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const { _id, ...updatedData } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "Missing event ID" },
        { status: 400 }
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Error updating event", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE — Remove event
export async function DELETE(request) {
  try {
    await connectMongoDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing event ID" },
        { status: 400 }
      );
    }

    await Event.findByIdAndDelete(id);
    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Error deleting event", error: error.message },
      { status: 500 }
    );
  }
}
