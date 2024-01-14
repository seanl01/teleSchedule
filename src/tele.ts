import TelegramBot from 'node-telegram-bot-api'
import { ConversationManager } from './utils/utils.js';
import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore
const token = process.env.TELE_KEY;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, "Send your template message");

    const conversation = new ConversationManager(msg);
    await conversation.init();
    await conversation.setChatState(0);

});

// when user sends a message and state exists
bot.on("message", async (msg: object) => {
    const conversation = new ConversationManager(msg);
    await conversation.init();

    const chatId = conversation.chatId;
    const state = conversation.state;

    console.log("state: ", state);

    // Ongoing conversation
    if (conversation.stateExists() && conversation.stateWithinBounds()) {
        await bot.sendMessage(chatId, conversation.getMessageAtState());
        conversation.incrementChatState();
        return;
    }

    if (state === ConversationManager.MAX) {
        await bot.sendMessage(chatId, "Done");
        conversation.deleteChatState();
        return;
    }

})
