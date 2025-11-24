import express from 'express';
const app = express();
import decodeToken from './middlewares/checkTokenMiddleware.js';
import cors from 'cors';
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import redisClient from './configs/rediClient.js';
import router from './routes/router.js';
// import "./configs/mongClient.js";  // Remove this for now if causing issues
import { checkPendingMessagesPG, saveMessagePG, updateStatusPG } from './controllers/message.controller.js';
import { getMembersIds } from './controllers/chatter.group.controller.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
dotenv.config();

// ✅ Add error handlers at the top
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION:', err);
  process.exit(1);
});

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://full-stack-chatapp-smoky.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

app.use("/api/auth", router);
app.use(decodeToken);
app.use("/api", router);

// ✅ FIX: Add error handling for Prisma
prisma.$connect()
  .then(() => {
    console.log("✅ Prisma Database connected");
  })
  .catch((err) => {
    console.error("❌ Prisma connection failed:", err);
    process.exit(1);
  });


redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ... rest of your socket.io code stays the same ...

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default server;