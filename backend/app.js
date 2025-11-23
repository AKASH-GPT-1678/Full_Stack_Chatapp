import express from 'express';
const app = express();
import decodeToken from './middlewares/checkTokenMiddleware.js';
import cors from 'cors';
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import redisClient from './configs/rediClient.js';
import router from './routes/router.js';
import "./configs/mongClient.js";
import { checkPendingMessagesPG, saveMessagePG, updateStatusPG } from './controllers/message.controller.js';
import { getMembersIds } from './controllers/chatter.group.controller.js';

dotenv.config();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // must be specific, not "*"
    credentials: true, // allow cookies / tokens
  }));
app.use(decodeToken);
app.use("/api", router);
io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;
    console.log(`User ${userId} connected`);
    socket.userId = userId;

    // JOIN USER TO THEIR OWN ROOM - This is crucial!
    socket.join(userId);

    redisClient.set(userId, "Online");

    // Check for pending messages
    const checkAndSendPending = async () => {
        const messages = await checkPendingMessagesPG(userId);
        if (messages && messages.length > 0) {
            socket.emit(userId, messages);
            await updateStatusPG(userId);
        }
    };
    checkAndSendPending();

    socket.on('chat-message', async (msg) => {
        try {
            const getStatus = await redisClient.get(msg.receiverId);

            if (getStatus) {

                const newMessage = {
                    senderId: msg.senderId,
                    groupId: "na",
                    receiverId: msg.receiverId,
                    content: msg.content,
                    timestamp: new Date()
                };

                io.to(msg.receiverId).emit(msg.receiverId, newMessage);

                await saveMessagePG(msg.senderId, msg.receiverId, msg.content, "na", "SUCCESS", msg.app);

                socket.emit('message-sent', { success: true, message: newMessage });
            } else {

                await saveMessagePG(msg.senderId, msg.receiverId, msg.content, "na", "PENDING", msg.app);
                socket.emit('message-sent', { success: true, pending: true });
            }
        } catch (error) {
            console.error('Error handling chat message:', error);
            socket.emit('message-error', { error: 'Failed to send message' });
        }
    });

    socket.on('group-message', async (msg) => {
        if (!msg.groupId) {
            return;

        }
        const allIds = await getMembersIds(msg.groupId);
        const filteredMembers = allIds.filter(id => id !== msg.senderId);
        console.log(filteredMembers);

        async function checkandUpdate(memberIds) {
            if (!memberIds) return;

            try {
                for (let i = 0; i < memberIds.length; i++) {
                    const status = await redisClient.get(memberIds[i]);
                    if (status) {
                        const newMessage = {
                            senderId: msg.senderId,
                            groupId: msg.groupId,
                            receiverId: memberIds[i],
                            content: msg.content,
                            timestamp: new Date()
                        };
                        let reciever = memberIds[i];

                        io.to(reciever).emit(reciever, newMessage);

                        await saveMessagePG(msg.senderId, reciever, msg.content, msg.groupId, "SUCCESS", msg.app);


                        socket.emit('message-sent', { success: true, message: newMessage });

                    }
                    else {
                        let receiver = memberIds[i];
                        console.log(" ia m pending", receiver)

                        await saveMessagePG(msg.senderId, receiver, msg.content, msg.groupId, "PENDING", msg.app);
                        socket.emit('message-sent', { success: true, pending: true });

                    }

                }


            } catch (error) {
                console.error('Error handling chat message:', error);
                socket.emit('message-error', { error: 'Failed to send message' });

            }




        }

        checkandUpdate(filteredMembers);


    })

    socket.on('typing', (data) => {
        // Emit typing indicator to receiver
        io.to(data.receiverId).emit('user-typing', {
            senderId: data.senderId,
            isTyping: data.isTyping
        });
    });

    socket.on('disconnect', async () => {
        console.log(`User ${socket.userId} disconnected`);
        await redisClient.del(socket.userId);
    });
});


app.get("/", (req, res) => {
    res.send("Hello World!");
});




export default server;