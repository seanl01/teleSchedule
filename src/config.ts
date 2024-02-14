import { Stage } from "./controller/Stage.js";
import { ModelBase } from "./controller/ActionModel.js";
import { ActionModel } from "./controller/ActionModel.js";
import StateManager from "./data/StateManager.js";
import { Message } from "telegram-typings/index.js";

interface StageOptions {
  question: string;
  errorMessage: string;
  validator: ((answer: string) => boolean) | (() => boolean);
  parser?: (answer: string) => any;
  accessor?: (msg: Message) => string;
}

const stageOptions: StageOptions = {
  question: "",
  errorMessage: "Invalid format. Please try again: ",
  validator: () => true,
};

// TEMPLATE
const templateMessageConfig: StageWithMutator = {
  stage: new Stage({
    ...stageOptions,
    accessor: (msg: Message) => msg.message_id.toString(),
    question: "What is your template message?",
  }),
  mutator: (model: ActionModel, templateMessageId) => {
    model.setTemplateMessageId(templateMessageId);
  },
};

// DAYS
const daysValidator = (answer: string) => {
  if (!answer.match(/((\d,)?)+\d/))
    return false;

  const days = answer.split(",");

  for (const day of days) {
    if (isNaN(parseInt(day)))
      return false;

    if (parseInt(day) < 1 || parseInt(day) > 7)
      return false;
  }
  return true;
};

const daysParser = (answer: string) => {
  const days = answer.split(",").map((day) => parseInt(day));
  return days;
}

const daysConfig: StageWithMutator = {
  stage: new Stage({
    ...stageOptions,
    validator: daysValidator,
    parser: daysParser,
    question: "What days do you want to send your message? Send in list like 1,2,3 for Monday, Tuesday, Wednesday.",
  }),
  mutator: (model: ActionModel, days: Day[]) => {
    model.setDays(days);
  },
};


// TIME
const timeParser = (answer: string) => {
  const [hh, mm] = answer.split(":").map((num) => parseInt(num));
  return { hour: hh, min: mm };
}

const timeValidator = (answer: string) => {
  const matchArr = answer.match(/\d{2}:\d{2}/);
  const match = matchArr ? matchArr[0] : null;

  if (!match)
    return false;

  const { hour, min } = timeParser(match);

  if (hour < 0 || hour > 23)
    return false;
  if (min < 0 || min > 59)
    return false;

  return true;
}

const timeConfig: StageWithMutator = {
  stage: new Stage({
    ...stageOptions,
    question: "What time do you want to send your message (In HH:MM format)?",
    validator: timeValidator,
    parser: timeParser,
  }),

  mutator: (model: ActionModel, time: { hour: number; min: number }) => {
    model.setTime(time);
  },
};

// LAST DATE
const dateValidator = (answer: string) => {
  try {
    new Date(answer);
    return true;
  }
  catch {
    return false;
  }
};

const dateParser = (answer: string) => {
  return new Date(answer);
}

const lastDateConfig: StageWithMutator = {
  stage: new Stage({
    ...stageOptions,
    question: "What is the last date you want to send your message (In YYYY-MM-DD format e.g. 2024-11-11)?",
    validator: dateValidator,
    parser: dateParser,
  }),
  mutator: (model: ActionModel, date: Date) => {
    model.setEndDate(date);
  },
};

const stageWithMutators: StageWithMutator[] = [
  templateMessageConfig,
  daysConfig,
  timeConfig,
  lastDateConfig
];

const conversationConfig: ConversationConfig = {
  stateManager: StateManager,
  stageWithMutators
}

export default conversationConfig;