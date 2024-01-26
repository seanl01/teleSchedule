import TelegramBot from 'node-telegram-bot-api'
import { StateManager } from './data/StateManager.js';
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


