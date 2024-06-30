
export class ModelBase<T> {
  model: T;

  constructor(obj: T) {
    this.model = obj;
  }
}

export class ActionModel extends ModelBase<Action> {

  constructor(action?: Action | undefined) {
    if (action)
      super(action);
    else {
      super({
        name: "",
        templateMessageId: "",
        sched: {
          days: [],
          hour: 0,
          min: 0,
          endDate: null,
        },
        chatId: "",
        userId: ""
      });
    }
    console.log("Chat started: ", this.model);
  }

  setTemplateMessageId(templateMessageId: string): void {
    this.model.templateMessageId = templateMessageId;
  }

  setDays(days: Day[]): void {
    this.model.sched.days = days;
  }

  setTime(time: { hour: number; min: number; }): void {
    const { hour, min } = time;
    this.model.sched.hour = hour;
    this.model.sched.min = min;
  }

  setEndDate(date: Date): void {
    this.model.sched.endDate = date;
  }
}
