// saveMessage.js
import mongoose from "mongoose";
import Message from "../models/messageModel.js";

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect("mongodb://akash:gupta@localhost:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin"
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Connection Error:", error);
  }
}

// Main function to save a message
async function saveMessage() {
  await connectDB();

  const message = new Message({
    senderId: "user123",
    receiverId: "user456",
    status: "pending",
    app: "chat-app"
  });

  try {
    const saved = await message.save();
    console.log("✅ Message saved:", saved);
  } catch (err) {
    console.error("❌ Save error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

// Run it
saveMessage();
