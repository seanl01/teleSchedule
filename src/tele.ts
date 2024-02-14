import dotenv from "dotenv";
import { Message } from "telegram-typings/index.js";
import Conversation from "./controller/Conversation.js";
import conversationConfig from "./config.js";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

// @ts-ignore
const token = process.env.TELE_KEY;
const bot = new TelegramBot(token, { polling: true });

const conversation = new Conversation(conversationConfig);

const COMMANDS = new Set(["/start", "/remove"]);

const isCommand = (msg: Message) => {
  return COMMANDS.has(msg.text);
};

bot.onText(/\/start/, async (msg: Message) => {
  const response = await conversation.start(msg);
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
  if (isCommand(msg)) return;
  // Ongoing conversation with user
  const response = await conversation.receiveMessage(msg);
  console.log(response);
  await bot.sendMessage(msg.chat.id, response);
});

bot.onText(/\/remove/, async (msg: Message) => {
  const response = await conversation.remove(msg);
  console.log(response);
  await bot.sendMessage(msg.chat.id, response);
});
