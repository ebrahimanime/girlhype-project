import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
