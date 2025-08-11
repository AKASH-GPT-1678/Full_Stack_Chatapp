import { bucketName } from "../configs/multer.config.js";
import storage from "../configs/cloud.Config.js";
import path from 'path';
import { pathname } from "../configs/multer.config.js";
import User from "../models/user.model.js";
import files from 'fs';

async function addProfileImage(req, res) {
    if (!req.user) {
        return res.status(401).json({ verified: false, message: "Unauthorized request" });
    }

    const userId = req.user.id;
    console.log(userId);

    const user = await User.findById(userId); // Await added

    if (!user) {
        console.log("User not found");
        return res.status(401).json({ verified: false, message: "Unauthorized request" });
    }

    const localFilePath = path.join(pathname, req.file.originalname);
    const bucket = storage.bucket(bucketName);

    if (req.file) {
        await bucket.upload(localFilePath, {
            destination: req.file.originalname,
            resumable: false,
        });

        const fileUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(req.file.originalname)}`;
        console.log("File uploaded successfully");

        user.profileUrl = fileUrl; 
        await user.save(); // now works

        files.unlinkSync(localFilePath); // delete local file
        return res.status(201).json({ message: "Profile Photo Added", profilePhoto: fileUrl });
    }

    files.unlinkSync(localFilePath);
}



export { addProfileImage };