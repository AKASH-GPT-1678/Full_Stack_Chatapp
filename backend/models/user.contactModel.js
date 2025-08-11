import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: { type: String, required: true },
    nickname: { type: String },
    phone: { type: String },
    email: { type: String },
    profileUrl : { type: String  , required : false },
    createdAt: { type: Date, default: Date.now },
    accepted: { type: Boolean, default: false },
});

const MyContact = mongoose.model('MyContact', contactSchema);
export default MyContact;
