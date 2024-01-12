import Bull from 'bull';

// type Action = {
//     name: string,
//     date: Date,
//     [key: string]: any,
// }

// const queue = new Bull<Action>("job-queue");

const queue = new Bull("job-queue")

const arr:Number[] = [1, 2, 3, 4]

async function main() {
    for (const item of arr) {
        await queue.add({
            "name": item
        })
    }
}

await main();

queue.process(async (job) => {
    console.log(job.data.name + " done");
})
