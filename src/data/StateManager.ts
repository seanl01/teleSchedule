import client from "./redis.js";
import { Message } from "telegram-typings/index.js";
import { StateSettingError } from "../common/errors.js";

export default class StateManager {
    // Manages storing of user's conversation state in redis

    chatId: string;
    userId: string;
    key: string;
    state: State | null;
    
    async init(msg: Message) {
        this.#bindConversation(msg);
        this.state = await this.#getRedisChatState();
    }

    #bindConversation(msg: Message) {
        const { chatId, userId } = StateManager.getUserIdAndChatId(msg);

        this.chatId = chatId;
        this.userId = userId;

        this.key = `${chatId}:${userId}`;
    }
    // returns user state if exists
    async #getRedisChatState(): Promise<State | null> {
        const state = await client.get(this.key);
        return JSON.parse(state);
    }

    async incrementChatIndex() {
        await this.setChatState((state) => { state.index += 1; return state });
    }

    // async setAction(action: Partial<Action>) {
    //     this.state.action = action;
    //     await this.setChatState(this.state);
    // }

    getChatState(): State | null {
        return this.state;
    }

    async setChatState(newState: State | Function) {
        // If reducer function
        let state = null;

        if (typeof newState === "function") {
            const current = await this.#getRedisChatState();
            state = newState(current);
        }
        else {
            state = newState;
        }

        try {
            await client.set(this.key, JSON.stringify(state));
            this.state = state;
        }

        catch (e) {
            throw new StateSettingError("Error while setting redis state");
        }
    }

    async deleteChatState() {
        await client.del(this.key);
    }

    static getUserIdAndChatId(msg): { chatId: string, userId: string } {
        const chatId = msg.chat.id.toString();
        const userId = msg.from?.id.toString() || "";
        return { chatId, userId };
    }

    hasState(): boolean {
        return this.state !== null;
    }

}
