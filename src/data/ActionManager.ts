
import queue from "./bull.js"
import { RepeatOptions } from "bullmq";
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
        if (!this.action?.sched) {
            throw new Error("Action must have a schedule to be scheduled");
        }

        const repeatOpts = this.#getOptionsFromSchedule()
        const res = await queue.add(this.key, this.action, {
            repeat: repeatOpts,
        });
        console.log(res);
    }

    #getOptionsFromSchedule(): RepeatOptions {
        return {
            tz: "Asia/Singapore",
            pattern: this.#parseSchedToCron(),
            endDate: this.action.sched.endDate,
        }
    }

    #parseSchedToCron(): string {
        const { hour, min, days } = this.action.sched;
        return CronTime.onSpecificDaysAt(days, hour, min);
    }

    // async #getExistingActionJob() {
    //     const existingActionJob = await queue.getRepeatableJobs();
    //     return existingActionJob.find(job => job.key === this.key);
    // }

    async remove(): Promise<string> {
        const repeatableJobs = await queue.getRepeatableJobs();
        const repeatableKey = repeatableJobs.find(job => job.name === this.key.split(":")[0]).key;

        const repeatable = await queue.removeRepeatableByKey(repeatableKey);
        // parse from cron expression
        if (!repeatable) {
            throw new Error("No job found to remove");
        }

        return "Job removed!"
    }
}