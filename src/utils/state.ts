import { createClient } from "redis";

const client = createClient();
await client.connect();

// @ts-ignore
client.on("error", (error) => {
    console.error(error);
});

// returns user state if exists
export async function getChatState(chatId: string, userId: string): Promise<null | number> {
    const state = await client.get(`${chatId}:${userId}`);
    return parseInt(state);
}

export async function setChatState(chatId: string, userId: string, newState: number | Function) {
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

export async function deleteChatState(chatId: string, userId: string) {
    await client.del(`${chatId}:${userId}`);
}

export function getMessageForState(state: number) {
    const messages = [
        "Input",
        "Hello",
        "2",
    ]
    return messages[state];
}

export default client;
