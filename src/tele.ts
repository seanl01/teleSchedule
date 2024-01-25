import TelegramBot from 'node-telegram-bot-api'
import { StateManager } from './utils/utils.js';
import dotenv from 'dotenv';
import { Message } from 'telegram-typings/index.js';
import { BotQuestions } from './response.js';
dotenv.config();

// @ts-ignore
const token = process.env.TELE_KEY;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg: Message) => {
    await bot.sendMessage(msg.chat.id, "Send your template message");

    const conversation = new StateManager(msg);
    await conversation.init();

    const initialState: State = {index: 0, action: { chatId:conversation.chatId }};
    await conversation.setChatState(initialState);

});

// when user sends a message and state exists
bot.on("text", async (msg: Message) => {
    if (msg.text === "/start") return;

    const stateMgr = new StateManager(msg);
    await stateMgr.init();

    const chatId = stateMgr.chatId;
    const state = stateMgr.state;
    
    console.log("state: ", state);
    
    // No ongoing conversation with user
    if (!stateMgr.stateExists() || state.index > BotQuestions.DONE)
        return;

    const { index } = state;
    const { text } = msg;
    // Ongoing conversation with user
    
    if (index === BotQuestions.TEMPLATE_MESSAGE) {
        await stateMgr.setAction({
            ...state.action,
            templateMessageId: msg.message_id.toString()
        });
        await bot.sendMessage(chatId, "Send your days");
    }

    else if (index === BotQuestions.DAYS) {
        if (text !== "1,2,4") {
            await bot.sendMessage(chatId, "Invalid days" + "\n" + "Send your days");
            return;
        }
        await stateMgr.setAction({
            ...state.action,
            sched: {
                days: [1,2,4]
            }
        }); 
        await bot.sendMessage(chatId, "well done");
    }
    
    else if (index === BotQuestions.DONE) {
        console.log("Done");
        await bot.sendMessage(chatId, "Done");
        stateMgr.deleteChatState();
        return;
    }

    await stateMgr.incrementChatIndex();
    
})


