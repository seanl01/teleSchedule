import TelegramBot from 'node-telegram-bot-api'
import { getChatState, setChatState, getMessageForState } from './utils/state.js';
import { getUserIdAndChatId } from './utils/utils.js';
import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore
const token = process.env.TELE_KEY;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, "Send your template message");
    const { chatId, userId } = getUserIdAndChatId(msg);

    await setChatState(chatId, userId, 0);
});

// when user sends a message and state exists
bot.on("message", async (msg) => {
    const { chatId, userId } = getUserIdAndChatId(msg);
    const state = await getChatState(chatId, userId);

    if (state !== null && state < 2) {
        console.log("state: ", state);
        await bot.sendMessage(chatId, getMessageForState(state));
        await setChatState(chatId, userId, state + 1);
    }
})
