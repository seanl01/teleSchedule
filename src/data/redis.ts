import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
    }
});
await client.connect();

// @ts-ignore
client.on("error", (error) => {
    console.error(error);
});

export default client;
