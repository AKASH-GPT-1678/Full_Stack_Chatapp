import mongoose from "mongoose";

const messageRequestSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    recieverId: { type: String, required: true },
    senderName: { type: String, required: true },
    accepted: { type: Boolean, default: false },



},
    {
        timestamps: true
    }


);

const MessageRequest = mongoose.model('Messagerequest', messageRequestSchema);
export default MessageRequest;
