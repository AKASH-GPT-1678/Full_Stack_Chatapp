import redis from "redis";
import dotenv from "dotenv";

dotenv.config();
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

// Connect to Redis
redisClient.connect().then(() => {
  console.log('✅ Connected to Redis');
}).catch(console.error);


export default redisClient;