import mongoose from "mongoose";

let isConnected = false; // 🔒 prevents multiple connections

const connectMongoDB = async () => {
  if (isConnected) {
    return;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || undefined,
    });

    isConnected = true;
    console.log("📦 MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

export default connectMongoDB;
