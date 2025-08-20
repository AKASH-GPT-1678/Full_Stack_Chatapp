import { bucketName } from "../configs/multer.config.js";
import storage from "../configs/cloud.config.js";
import { PrismaClient } from "@prisma/client";
import { pathname } from "../configs/multer.config.js";
const prisma = new PrismaClient();
import files from "fs";
import path from "path";
async function addProfileImage(req, res) {
    if (!req.user) {
        return res.status(401).json({ verified: false, message: "Unauthorized request" });
    }

    const userId = req.user.id;
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const bucket = storage.bucket(bucketName);

    // Direct upload from buffer, no local file
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
    });

    blobStream.on('error', err => {
        console.error("Upload error:", err);
        return res.status(500).json({ message: "Upload failed", error: err });
    });

    blobStream.on('finish', async () => {
        const fileUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(req.file.originalname)}`;
        await prisma.user.update({ where: { id: userId }, data: { profileImage: fileUrl } });
        return res.status(201).json({ message: "Profile Photo Added", profilePhoto: fileUrl });
    });

    blobStream.end(req.file.buffer);
}
;

const saveProduct = async (req, res) => {
    try {
        console.log("Request arrived")
        console.log(req.body);
        if (!req.user) {
            console.log("Unauthorized request");
            return { verified: false, status: 401, message: "Unauthorized request" };
        }


        if (!req.file) {
            console.log("No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }


        console.log("pathname:", pathname);
        console.log("req.file:", req.file);
        console.log("req.file.filename:", req.file?.originalname);


        const localFilePath = path.join(pathname, req.file.originalname);
        const bucket = storage.bucket(bucketName);
        if (req.file) {

            await bucket.upload(localFilePath, {
                destination: req.file.originalname,
                resumable: false,


            });




        }

        const fileUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(req.file.originalname)}`;
        console.log("File uploaded successfully");



        const product = await prisma.user.update({ where: { id: req.user.id }, data: { profileImage: fileUrl } });
        files.unlinkSync(localFilePath);





        return res.status(201).json({
            message: "Profile Photo Added",

        });









    } catch (error) {
        res.status(500).json({ message: "Ae madarchod sahi se bhejna Data ", error: error.message })
    }

};
export { addProfileImage, saveProduct };