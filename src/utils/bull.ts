import Bull from "bull";
import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore
const queue = new Bull<Action>(process.env.QUEUE_NAME);

export default queue;
