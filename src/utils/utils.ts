import client from "./redis.js";
import queue from "./bull.js"
import { CronRepeatOptions } from "bull";
import { CronTime } from "cron-time-generator";

export class StateManager {
    // Manages storing of user's conversation state in redis

    chatId: string;
    userId: string;
    key: string;
    state: State | null;

    constructor(msg) {
        const { chatId, userId } = StateManager.getUserIdAndChatId(msg);

        this.chatId = chatId;
        this.userId = userId;

        this.key = `${chatId}:${userId}`;
    }

    async init() {
        this.state = await this.#getRedisChatState();
    }

    // returns user state if exists
    async #getRedisChatState(): Promise<State | null> {
        const state = await client.get(this.key);
        return JSON.parse(state);
    }

    async incrementChatIndex() {
        await this.setChatState((state) => { state.index += 1; return state });
    }

    async setAction(action: Partial<Action>) {
        this.state.action = action;
        await this.setChatState(this.state);
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
            throw e;
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

    stateExists(): boolean {
        return this.state !== null;
    }

}

export class ActionScheduler {
    // schedules a given action into the redis queue

    action: Action;
    key: string;

    constructor(action: Action) {
        this.action = action;
        this.key = `${action.chatId}:${action.userId}`;
    }

    async schedule() {
        const repeatOpts = this.#getOptionsFromSchedule()
        await queue.add(this.key, this.action, {
            repeat: repeatOpts,
        });
    }

    async remove() {
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