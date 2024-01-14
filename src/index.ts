import Bull from 'bull';
import  { CronTime } from 'cron-time-generator';

const queue = new Bull<Action>("job-queue")

let action1: Action = {
    chatId: "woww",
    name: "Action 1",
    sched: {
        days: [1],
        hour: 0,
        min: 22,
        start: new Date(),
        cycles: 4,
    },
};

let action2: Action = {
    chatId: "woww",
    name: "Action 2",
    sched: {
        days: [2],
        hour: 12,
        min: 30,
        start: new Date(),
        cycles: 4,
    },
};

let action3: Action = {
    chatId: "woww",
    name: "Action 3",
    sched: {
        days: [3],
        hour: 12,
        min: 30,
        start: new Date(),
        cycles: 4,
    },
};

async function main() {
    
    console.log("action 1");
    const { days, hour, min } = action1.sched;
    const cron = CronTime.onSpecificdayssAt([days], hour, min);
    console.log(cron);
    
    await queue.add(action1, {
        repeat: {
            cron: cron,
            endDate: new Date(action1.sched.start.getTime() + (action1.sched.cycles * 86400000)),
        }
    });

    await queue.add(action2);
    await queue.add(action3);
}

await main();

queue.process(async (job) => {
    console.log(job.data.name + " done");
})
