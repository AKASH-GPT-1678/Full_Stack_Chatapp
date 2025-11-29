import upload , {uploadToS3} from "../configs/multer.config.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import files from "fs";
import path from "path";

const addProfileImage = async (req, res) => {
    try {
        if (!req.user) {
            console.log("Unauthorized request");
            return res.status(401).json({
                verified: false,
                message: "Unauthorized request"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: "No profile image uploaded"
            });
        }

   
        const uploaded = await uploadToS3(req.file);


        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { profileImage: uploaded.url }, // SAVE URL!!!
        });

        console.log("Profile image updated successfully");

        return res.status(200).json({
            message: "Profile image updated successfully",
            profileImage: uploaded.url,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error uploading profile image:", error);
        return res.status(500).json({
            error: "Something went wrong",
            details: error.message
        });
    }
};



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
export {  saveProduct,addProfileImage };