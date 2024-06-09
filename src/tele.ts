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

const COMMANDS = new Set(["/start", "/remove", "/stop"]);
const isCommand = (msg: Message) => {
  return COMMANDS.has(msg.text);
};

bot.onText(/\/start/, async (msg: Message) => {
  const response = await conversation.start(msg);
  await bot.sendMessage(msg.chat.id, response);
});

// when user sends a message and state exists
bot.on("text", async (msg: Message) => {
  console.log(msg.from.id, msg.chat.id);

  if (isCommand(msg)) return;
  if (!conversation.isOngoing(msg)) return;

  // Ongoing conversation with user
  const response = await conversation.receiveMessage(msg);
  console.log(response);
  await bot.sendMessage(msg.chat.id, response);
});

bot.onText(/\/stop/, async (msg: Message) => {
  const response = await conversation.abort();
  await bot.sendMessage(msg.chat.id, response);
});

bot.onText(/\/remove/, async (msg: Message) => {
  const response = await conversation.removeJob(msg);
  console.log(response);
  await bot.sendMessage(msg.chat.id, response);
});
