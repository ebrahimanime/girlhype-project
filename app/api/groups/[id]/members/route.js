// app/api/groups/[id]/members/route.js
import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongodb.js";
import Group from "../../../../models/Group.js";
import User from "../../../../models/User.js";

/**
 * POST  /api/groups/[id]/members   -> add a member (body: { userId })
 * DELETE /api/groups/[id]/members  -> remove a member (body: { userId })
 * GET   /api/groups/[id]/members   -> optional: return members list
 */

export async function GET(req, { params }) {
  try {
    const { id } = params;
    await connectMongoDB();

    const group = await Group.findById(id).populate("members", "name email").lean();
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    return NextResponse.json({ members: group.members }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching members:", error);
    return NextResponse.json({ message: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "userId required" }, { status: 400 });
    }

    await connectMongoDB();

    const [group, user] = await Promise.all([
      Group.findById(id),
      User.findById(userId).select("name email"),
    ]);

    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (group.members.map(String).includes(String(userId))) {
      return NextResponse.json({ message: "User already a member" }, { status: 400 });
    }

    group.members.push(userId);
    await group.save();

    const updated = await Group.findById(id).populate("members", "name email");
    return NextResponse.json({ message: "Member added", members: updated.members }, { status: 200 });
  } catch (error) {
    console.error("❌ Error adding member:", error);
    return NextResponse.json({ message: "Failed to add member" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "userId required" }, { status: 400 });
    }

    await connectMongoDB();

    const group = await Group.findById(id);
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    if (!group.members.map(String).includes(String(userId))) {
      return NextResponse.json({ message: "User not a member" }, { status: 400 });
    }

    group.members = group.members.filter((m) => m.toString() !== userId);
    await group.save();

    // optional: delete group if empty
    if (group.members.length === 0) {
      await Group.findByIdAndDelete(id);
      return NextResponse.json({ message: "Member removed — group deleted (no members left)" }, { status: 200 });
    }

    const updated = await Group.findById(id).populate("members", "name email");
    return NextResponse.json({ message: "Member removed", members: updated.members }, { status: 200 });
  } catch (error) {
    console.error("❌ Error removing member:", error);
    return NextResponse.json({ message: "Failed to remove member" }, { status: 500 });
  }
}
