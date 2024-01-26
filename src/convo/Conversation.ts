import { Message } from "telegram-typings/index.js";
import { StateManager } from "../data/StateManager.js";

class Stage {
  question: string;
  errorMessage: string;
  validator: ((answer: string) => boolean) | (() => boolean);
  parser: (answer: string) => any;

  // accesses specific property on message object
  accessor: (msg: Message) => string;

  constructor(question: string, errorMessage: string, validator: (answer: string) => boolean, parser?: (answer: string) => any, accessor?: (msg: Message) => string) {
    this.question = question;
    this.errorMessage = errorMessage;
    this.validator = validator;
    this.parser = parser ?? ((answer: string) => answer);
    this.accessor = accessor ?? ((msg: Message) => msg.text);
  }

  validate(answer: string): boolean {
    return this.validator(answer);
  }

  parse(answer: string): any {
    return this.parser(answer);
  }

  getCleanAnswer(msg: Message): any {
    return this.parse(this.accessor(msg));
  }

  ask(): string {
    return this.question;
  }

  askAgain(): string {
    return this.errorMessage + this.question;
  }
}


// if (!stage.validate(answer)) {
//     return stage.askAgain()
// }

const stages = [
  new Stage("What is your template message?", "Invalid template message\n", () => true),
  new Stage("What days do you want to send your message?", "Invalid days\n", () => true),
  new Stage("What time do you want to send your message (In HH:MM format)?", "Invalid time\n", () => true),
  new Stage("What is the last date you want to send your message (In DD/MM/YYYY format)?", "Invalid date\n", () => true),
]


// Takes in session key (userId and chatId)
class Conversation {
  // receives msg: Message object
  // uses stateManager to find correct stage
  stages: Stage[] = stages;
  stateManager: StateManager;
  actionModel: ActionModel;

  constructor() {
    this.stateManager = new StateManager();
  }

  async start(msg: Message): Promise<string> {
    this.actionModel = new ActionModel();
    const action = this.actionModel.action;
    
    try {
      await this.stateManager.init(msg);
      await this.stateManager.setChatState({ index: 0, action });
      return this.stages[0].ask();
    } 

    catch (err) {
      console.log(err);
      return "Something went wrong. Please try again later.";
    }
  }

}

// 
class ActionModel {
  action: Action = {
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
  };

  constructor(action?: Action | undefined) {
    if (action)
      this.action = action;
  }
  
  setTemplateMessageId(templateMessageId: string): void {
    this.action.templateMessageId = templateMessageId;
  }

  setDays(days: Day[]): void {
    this.action.sched.days = days;
  }

  setTime(hour: number, min: number): void {
    this.action.sched.hour = hour;
    this.action.sched.min = min;
  }
}
