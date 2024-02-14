import { Queue } from "bullmq";
import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore
const queue = new Queue<Action>(process.env.QUEUE_NAME);

export default queue;
