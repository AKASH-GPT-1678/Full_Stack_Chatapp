import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();

function initializeStorage() {
  let storage;
  console.log("NODE_ENV:", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    // Local development: use service account file
    if (!process.env.PROJECT_ID) {
      throw new Error("❌ PROJECT_ID not set in .env for development");
    }

    storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: "fleetops-464008-e4e6f94b9da1.json",
    });

  } else {
    // Production: use base64 encoded credentials from env
    const encoded = process.env.GCP_CREDENTIALS;
    if (!encoded) {
      throw new Error("❌ GCP_CREDENTIALS not set in environment variables");
    }

    let credentials;
    try {
      credentials = JSON.parse(
        Buffer.from(encoded, "base64").toString("utf-8")
      );
    } catch (err) {
      throw new Error("❌ Failed to parse GCP_CREDENTIALS: " + err.message);
    }

    storage = new Storage({
      projectId: credentials.project_id,
      credentials,
    });
  }

  return storage;
}

const storage = initializeStorage();
export default storage;
