import { bucketName } from "../configs/multer.config.js";
import storage from "../configs/cloud.Config.js";
import path from 'path';
import { pathname } from "../configs/multer.config.js";
import User from "../models/user.model.js";
import files from 'fs';

async function addProfileImage(req, res) {
    if (!req.user) {
        return { verified: false, status: 401, message: "Unauthorized request" };
    };

    const userId = req.user.id;

    const users = User.findById(userId);

    if (!users) {
        return { verified: false, status: 401, message: "Unauthorized request" };


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
        users.profileUrl = fileUrl;
        await users.save();
        return res.status(201).json({ message: "Profile Photo Added", profilePhoto: fileUrl });





    };


    files.unlinkSync(localFilePath);

}


export { addProfileImage };