import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();


function initializeStorage() {
    let storage;
    console.log("NODE_ENV:", process.env.NODE_ENV);

    if (process.env.NODE_ENV === "development") {
        storage = new Storage({
            projectId: process.env.PROJECT_ID,
            keyFilename: "fleetops-464008-e4e6f94b9da1.json"
        });
    } else {

        const credentials = JSON.parse(
            Buffer.from(process.env.GCP_CREDENTIALS, "base64").toString("utf-8")
        );

        if (!credentials) throw new Error("GCP_CREDENTIALS not found");
        storage = new Storage({
            projectId: credentials.project_id,
            credentials: credentials
        });
    }

    return storage;
}


const storage = initializeStorage();

export default storage;