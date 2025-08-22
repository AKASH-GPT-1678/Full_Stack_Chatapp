import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";


function initializeStorage() {
    let storage;
    console.log("NODE_ENV:", process.env.NODE_ENV);

    if (process.env.NODE_ENV === "development") {
        storage = new Storage({
            projectId: process.env.PROJECT_ID,
            keyFilename: "fleetops-464008-e4e6f94b9da1.json"
        });
    } else {

        const credentials = JSON.parse(process.env.GCP_CREDENTIALS);
        storage = new Storage({
            projectId: credentials.project_id,
            keyFilename: credentials
        });
    }

    return storage;
}


const storage = initializeStorage();

export default storage;