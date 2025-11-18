import { NextResponse } from "next/server";
import connectMongoDB from "../../lib/mongodb.js";
import Group from "../../models/Group.js";
import User from "../../models/User.js";

export async function GET() {
  try {
    await connectMongoDB();

    const groups = await Group.find()
      .populate("members", "name email")
      .populate("messages.sender", "name email");

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching groups:", error);
    return NextResponse.json(
      { message: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectMongoDB();
    const { name, description, members } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Group name is required" },
        { status: 400 }
      );
    }

    const newGroup = await Group.create({
      name: name.trim(),
      description: description || "",
      members: Array.isArray(members) ? members : [],
      messages: [],
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating group:", error);
    return NextResponse.json(
      { message: "Failed to create group" },
      { status: 500 }
    );
  }
}

// -----------------------------------------
// PATCH /api/groups → Add member to group
// -----------------------------------------
export async function PATCH(req) {
  try {
    await connectMongoDB();
    const { groupId, userId } = await req.json();

    if (!groupId || !userId) {
      return NextResponse.json(
        { message: "groupId & userId required" },
        { status: 400 }
      );
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }

    // Prevent duplicates
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    const updatedGroup = await Group.findById(groupId)
      .populate("members", "name email")
      .populate("messages.sender", "name email");

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error("❌ Error adding member:", error);
    return NextResponse.json(
      { message: "Failed to update group" },
      { status: 500 }
    );
  }
}
