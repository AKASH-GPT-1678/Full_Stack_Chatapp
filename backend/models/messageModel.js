import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageModel = new Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    
    status: {
        type: String,
        enum: ['success', 'pending', 'error'],
        default: 'pending'
    },
    app: { type: String, required: true }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', MessageModel);
export default Message;
