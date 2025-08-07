import server from "./app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});


