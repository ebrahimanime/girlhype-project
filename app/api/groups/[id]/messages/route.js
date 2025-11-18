import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongodb.js";
import Group from "../../../../models/Group.js";
import User from "../../../../models/User.js";

// POST /api/groups/[id]/messages
export async function POST(req, { params }) {
  try {
    await connectMongoDB();

    const { id } = params; // groupId
    const { senderId, text } = await req.json();

    if (!text || !senderId) {
      return NextResponse.json(
        { message: "Missing message text or senderId" },
        { status: 400 }
      );
    }

    // Validate sender exists
    const sender = await User.findById(senderId).select("name email");
    if (!sender)
      return NextResponse.json(
        { message: "Sender not found" },
        { status: 404 }
      );

    // Create message object
    const newMessage = {
      sender: senderId,
      text,
      createdAt: new Date(),
    };

    // Save to the group
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { $push: { messages: newMessage } },
      { new: true }
    ).populate("messages.sender", "name email");

    if (!updatedGroup)
      return NextResponse.json({ message: "Group not found" }, { status: 404 });

    // return last message
    const savedMessage =
      updatedGroup.messages[updatedGroup.messages.length - 1];

    return NextResponse.json(savedMessage, { status: 201 });
  } catch (err) {
    console.error("❌ Error saving message:", err);
    return NextResponse.json(
      { message: "Failed to save message" },
      { status: 500 }
    );
  }
}
