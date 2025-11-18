import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb.js";
import Group from "../../../models/Group.js";
import User from "../../../models/User.js";


export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;

    const group = await Group.findById(id)
      .populate("members", "name email")
      .populate("messages.sender", "name email");

    if (!group)
      return NextResponse.json({ message: "Group not found" }, { status: 404 });

    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching group:", error);
    return NextResponse.json({ message: "Error fetching group" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;

    const deleted = await Group.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ message: "Group not found" }, { status: 404 });

    return NextResponse.json({ message: "Group deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting group:", error);
    return NextResponse.json({ message: "Failed to delete group" }, { status: 500 });
  }
}
