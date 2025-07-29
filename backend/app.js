import express from 'express';
const app = express();
import decodeToken from './middlewares/checkTokenMiddleware.js';
import cors from 'cors';
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import redisClient from './configs/rediClient.js';
import "./configs/mongClient.js";
import { checkPendingMessages, saveMessage, updateStatus } from "./controllers/mongoActions.js";
import Message from './models/messageModel.js';

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());
// app.use(decodeToken);

io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;
    console.log(userId);
    socket.userId = userId;
    console.log('A user connected');
    redisClient.set(userId, "Online");
    const message = checkPendingMessages(userId);

    if (message) {
        socket.emit(userId, message);
        updateStatus(userId)
    }







    socket.on('chat-message', async (msg) => {
        const getStatus = await redisClient.get(msg.receiverId);


        if (getStatus) {
            const message = new Message({
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                status: "success",
                app: msg.app
            });

            socket.emit(msg.receiverId, message);
                await saveMessage(msg.senderId,  msg.receiverId, "success",msg.app);
        }
        else {
            const message = new Message({
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                status: "pending",
                app: msg.app
            })
            await saveMessage(msg.senderId,  msg.receiverId, "pending",msg.app);

        }


        console.log('message: ' + msg);

    });


    socket.on('typing', (data) => {
        console.log(data);

    });

    // Handle disconnection
    socket.on('disconnect', async () => {

        console.log('User disconnected');
        await redisClient.del(socket.userId);
        console.log("User Disconnected " , socket.userId);
    });
});



app.get("/", (req, res) => {
    res.send("Hello World!");
});




export default server