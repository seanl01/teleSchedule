import { createClient } from "redis";
const client = createClient();
await client.connect();

// @ts-ignore
client.on("error", (error) => {
    console.error(error);
});

// returns user state if exists
export async function getChatState(chatId, userId) {
    const state = await client.get(`${chatId}:${userId}`);
    return state;
}
export async function setChatState(chatId, userId, newState) {
    // If reducer function
    let state = null;
    if (typeof newState === "function") {
        const current = getChatState(chatId, userId);
        state = newState(current);
    }
    else {
        state = newState;
    }
    await client.set(`${chatId}:${userId}`, state.toString());
}
export default client;
