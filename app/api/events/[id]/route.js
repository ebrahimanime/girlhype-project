
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("eventsApp");
  const events = await db.collection("events").find({}).toArray();
  return NextResponse.json(events);
}

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db("eventsApp");
  const data = await request.json();
  data.date = new Date(data.date);
  const result = await db.collection("events").insertOne(data);
  return NextResponse.json({ message: "Event added", id: result.insertedId });
}

export async function PUT(request) {
  const client = await clientPromise;
  const db = client.db("eventsApp");
  const data = await request.json();
  const { _id, ...updateData } = data;

  if (!_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db
    .collection("events")
    .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

  return NextResponse.json({ message: "Event updated" });
}

export async function DELETE(request) {
  const client = await clientPromise;
  const db = client.db("eventsApp");
  const { id } = await request.json();

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.collection("events").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Event deleted" });
}
