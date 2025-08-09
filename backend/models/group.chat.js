// models/Group.js
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId, // links to User collection
    ref: "User",
    required: true
  },
  memberName: {
    type: String,
    required: true
  },
  memberStatus: {
    type: String,
    enum: ["active", "inactive", "blocked", "left"],
    default: "active"
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member"
  }
});

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [memberSchema], // array of member objects
    groupAvatar: {
      type: String, // URL for group image
      default: ""
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    lastMessage: {
      type: String
    }
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
