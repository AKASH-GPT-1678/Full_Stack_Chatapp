import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    app : { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
