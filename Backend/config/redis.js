const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const REDIS_URL = process.env.REDIS_URL;

const client = createClient({
  url: REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

async function connectRedis() {
  await client.connect();
  console.log("Redis connected");
}
connectRedis();

module.exports = client;
