
type Action = {
    chatId: string,
    userId: string,
    name: string,
    sched: Partial<Sched>,
    templateMessageId: string,
    // [key: string]: any,
}

type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Sched = {
    start: Date,
    days: Day[],
    cycles: number,
    hour: number,
    min: number,
}

type State = {
    index: number,
    retry?: boolean,
    action: Partial<Action>,
}

