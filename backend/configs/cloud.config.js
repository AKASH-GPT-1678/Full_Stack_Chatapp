import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";


function initializeStorage() {
    let storage;
    console.log("NODE_ENV:", process.env.NODE_ENV);

    if (process.env.NODE_ENV === "production1") {
        storage = new Storage({
            projectId: process.env.PROJECT_ID,
            keyFilename: "fleetops-464008-e4e6f94b9da1.json"
        });
    } else if (process.env.NODE_ENV === "production2") {
        storage = new Storage({
            projectId: process.env.PROJECT_ID,
            keyFilename: "/etc/secrets/GCP_FILE"
        });
    } else {
        // Local development fallback
        storage = new Storage({
            projectId: process.env.PROJECT_ID,
            keyFilename: path.join(process.cwd(), "fleetops-464008-e4e6f94b9da1.json")
        });
    }

    return storage;
}


const storage = initializeStorage();

export default storage;