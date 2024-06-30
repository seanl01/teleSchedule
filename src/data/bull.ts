import { Queue } from "bullmq";
import dotenv from 'dotenv';
import IORedis from 'ioredis';

dotenv.config();

// @ts-ignore
const connection = new IORedis({
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    maxRetriesPerRequest: null
});

const queue = new Queue<Action>(process.env.QUEUE_NAME, { connection });

export default queue;
