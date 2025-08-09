// saveMessage.js
import mongoose from "mongoose";
import Message from "../models/messageModel.js";
// import { getGroupMemberIds } from "../controllers/group.controller.js";
import Group from "../models/group.chat.js";
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


const getGroupMemberIds = async (groupId) => {
  await connectDB();
  try {
    if(!groupId){
        throw new Error("Group ID is required");
    }

    // Find the group and only fetch the members field
    const group = await Group.findById(groupId).select("members");

    if (!group) {
      return res.status(404).json({
        verified: false,
        status: 404,
        message: "Group not found",
      });
    }

    // Extract only the memberId values as strings
    const memberIds = group.members.map(m => m.memberId.toString());
    console.log(memberIds);

    return memberIds;

  } catch (error) {
    console.error("Error fetching member IDs:", error);

  }
};


getGroupMemberIds("68967cf60f63f6f5de5a7804"); //"68967cf60f63f6f5de5a7805"
// Run it
