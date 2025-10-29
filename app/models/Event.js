import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    time: { type: String },
    type: { type: String },
    description: { type: String },
    location: { type: String },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite errors in Next.js
const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
export default Event;
