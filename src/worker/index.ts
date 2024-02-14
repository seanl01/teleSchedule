import { Queue, Worker } from 'bullmq';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import IORedis from 'ioredis'

dotenv.config();

// @ts-ignore
const token = process.env.TELE_KEY;
const bot = new TelegramBot(token);
const connection = new IORedis({maxRetriesPerRequest: null});

console.log(process.env.QUEUE_NAME)

console.log("File is being run!")

// const q = new Queue(process.env.QUEUE_NAME, { connection });

// setInterval(async () => {
//     const repeatableJobs = await q.getRepeatableJobs();
//     console.log(repeatableJobs);
// }, 10000);


const worker = new Worker(process.env.QUEUE_NAME, async job => {
  console.log(job.data);
  const data = job.data as Action;
    const { templateMessageId, chatId } = data;

    console.log(data, "run!")
    await bot.copyMessage(chatId, chatId, templateMessageId);
}, { connection })