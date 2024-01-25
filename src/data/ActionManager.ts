
import queue from "./bull.js"
import { CronRepeatOptions } from "bull";
import { CronTime } from "cron-time-generator";

export default class ActionScheduler {
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