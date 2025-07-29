import redis from "redis";

const redisClient = redis.createClient({
    url: "redis://localhost:6379",
});

// Connect to Redis
redisClient.connect().then(() => {
  console.log('✅ Connected to Redis');
}).catch(console.error);


export default redisClient