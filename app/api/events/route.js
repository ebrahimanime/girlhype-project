import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";


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
