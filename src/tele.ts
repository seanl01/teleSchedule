import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv';
import { Message } from 'telegram-typings/index.js';
import Conversation from './controller/Conversation.js';
import conversationConfig from './controller/config.js';
import StateManager from './data/StateManager.js';

dotenv.config();

// @ts-ignore
const token = process.env.TELE_KEY;
const bot = new TelegramBot(token, { polling: true });

const stages = conversationConfig.map((config) => config.stage);
const conversation = new Conversation(stages, StateManager);

bot.onText(/\/start/, async (msg: Message) => {
    const response = await conversation.start(msg);
    console.log(response);
    await bot.sendMessage(msg.chat.id, response);
});


// 1: get session for chatId and userId (session key)
// 2: send answer and session key to convo layer
    // 3: convo layer validates answer
    // 4: If Error, send error message (and question again)
    // 5: If no error, respond with success message (and next question)
    // 6: convo layer updates session
// 7: bot layer sends message to user

// when user sends a message and state exists
bot.on("text", async (msg: Message) => {
    if (msg.text === "/start") return;

    // Ongoing conversation with user
    const response = await conversation.receiveMessage(msg);
    console.log(response);
    await bot.sendMessage(msg.chat.id, response);
})


