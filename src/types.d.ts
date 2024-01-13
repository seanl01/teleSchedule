type Action = {
    chatId: string,
    name: string,
    sched: Sched,
    [key: string]: any,
}

type Sched = {
    start: Date,
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
    cycles: number,
    hh: number,
    mm: number,
}

