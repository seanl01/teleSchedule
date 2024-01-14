type Action = {
    chatId: string,
    name: string,
    sched: Sched,
    templateMessageId: string,
    [key: string]: any,
}

type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Sched = {
    start: Date,
    days: Day[],
    cycles: number,
    hour: number,
    min: number,
}

