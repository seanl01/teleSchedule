import client from "./redis.js";
import queue from "./bull.js"
import { CronRepeatOptions, RepeatOptions } from "bull";
import { CronTime } from "cron-time-generator";
export class ConversationManager {
    chatId: string;
    userId: string;
    key: string;
    state: number | null = null;

    static MAX: number = 2;
    static MIN: number = 0;

    messages = [
        "Input",
        "Hello",
        "2",
    ]

    constructor(msg) {
        const { chatId, userId } = ConversationManager.getUserIdAndChatId(msg);

        this.chatId = chatId;
        this.userId = userId;

        this.key = `${chatId}:${userId}`;
    }

    async init() {
        this.state = await this.syncChatState();
    }

    // returns user state if exists
    async syncChatState(): Promise<null | number> {
        const state = await client.get(this.key);
        this.state = state ? parseInt(state) : null;
        return state;
    }

    async incrementChatState() {
        const state = await this.syncChatState();
        await this.setChatState(state + 1);
    }

    async deleteChatState() {
        await client.del(this.key);
    }

    async setChatState(newState: number | Function) {
        // If reducer function
        let state = null;
        if (typeof newState === "function") {
            const current = await this.syncChatState();
            state = newState(current);
        }
        else {
            state = newState;
        }
        await client.set(this.key, state.toString());
        this.state = state;
    }

    static getUserIdAndChatId(msg): { chatId: string, userId: string } {
        const chatId = msg.chat.id.toString();
        const userId = msg.from?.id.toString() || "";
        return { chatId, userId };
    }

    getMessageAtState(): string {
        return this.messages[this.state];
    }

    stateExists(): boolean {
        return this.state !== null;
    }

    stateWithinBounds(): boolean {
        return this.state < ConversationManager.MAX;
    }

}

export class ActionScheduler {
    action: Action;
    key: string;

    constructor(action: Action) {
        this.action = action;
        this.key = `${action.chatId}:${action.userId}`;
    }

    async scheduleAction() {
        const repeatOpts = this.#getOptionsFromSchedule()
        await queue.add(this.key, this.action, {
            repeat: repeatOpts,
        });
    }

    async removeAction() {
        await queue.removeRepeatableByKey(this.key);
    }

    #getOptionsFromSchedule(): CronRepeatOptions {
        return {
            cron: this.#parseSchedToCron(),
            endDate: this.#getEndDateFromSchedule(),
        }
    }

    #parseSchedToCron(): string {
        const { hour, min, days } = this.action.sched;
        return CronTime.onSpecificDaysAt(days, hour, min);
    }

    #getEndDateFromSchedule(): Date | undefined {
        const sched = this.action.sched;
        return new Date(sched.start.getTime() + (sched.cycles * 86400000));
    }

}