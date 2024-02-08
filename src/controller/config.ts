import { Stage } from "./Stage.js";
import { ModelBase } from "./ActionModel.js";
import { ActionModel } from "./ActionModel.js";

type Mutator = (model: ModelBase, cleanAnswer: any) => void;

type StageWithMutator = {
  stage: Stage;
  mutator: Mutator;
};

const templateMessageConfig: StageWithMutator = {
  stage: new Stage("What is your template message?", "", (answer: string) => true),
  mutator: (model: ActionModel, templateMessageId) => { model.setTemplateMessageId(templateMessageId) }
};

const daysConfig: StageWithMutator = {
  stage: new Stage("What days do you want to send your message?", "", (answer: string) => true),
  mutator: (model: ActionModel, days: Day[]) => { model.setDays(days) }
};

const timeConfig: StageWithMutator = {
  stage: new Stage("What time do you want to send your message (In HH:MM format)?", "", (answer: string) => true),
  mutator: (model: ActionModel, time: { hour: number, min: number }) => { model.setTime(time) }
};

const lastDateConfig: StageWithMutator = {
  stage: new Stage("What is the last date you want to send your message (In DD/MM/YYYY format)?", "", (answer: string) => true),
  mutator: (model: ActionModel, date: Date) => { model.setEndDate(date) }
};

const conversationConfig: StageWithMutator[] = [
  templateMessageConfig,
  daysConfig,
  timeConfig,
  lastDateConfig
];

export default conversationConfig;