import { Message } from "telegram-typings/index.js";
import StateManager from "../data/StateManager.js";
import { Stage } from "./Stage.js";
import { ActionModel } from "./ActionModel.js";
import ActionScheduler from "../data/ActionManager.js";

// if (!stage.validate(answer)) {
//     return stage.askAgain()
// }


// Takes in session key (userId and chatId)
export default class Conversation {
  // receives msg: Message object
  // uses stateManager to find correct stage
  stages: Stage[];
  stateManager: StateManager;
  mutators: ((model: ActionModel, answer: any) => void)[];

  // Dependency injection
  constructor(config: ConversationConfig) {
    this.stages = config.stageWithMutators.map((stageWithMutator) => stageWithMutator.stage);
    this.stateManager = new config.stateManager();
    this.mutators = config.stageWithMutators.map((stageWithMutator) => stageWithMutator.mutator);
  }

  async start(msg: Message): Promise<string> {
    const actionModel = new ActionModel();
    actionModel.model.chatId = msg.chat.id.toString();
    actionModel.model.userId = msg.from.id.toString();

    const action = actionModel.model;

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

  async receiveMessage(msg: Message): Promise<string> {
    // 
    await this.stateManager.init(msg);
    const state = this.stateManager.getChatState();
    const curIndex = state?.index ?? 0;

    const stage = this.stages[curIndex];

    if (!stage.validate(msg.text))
      return stage.askAgain();

    try {
      const answer = stage.getCleanAnswer(msg);
  
      const actionModel = new ActionModel(state.action);
      
      // Change the action model
      const mutator = this.mutators[curIndex];
      mutator(actionModel, answer);
      
      console.log("Model: ", actionModel.model);
      this.stateManager.setChatState({
        index: curIndex + 1,
        action: actionModel.model
      });

      return await this.#askNextQuestionOrEnd(curIndex);
    }
    catch (error) {
      console.log(error);
      return "Something went wrong. Please try again later."
    }

  }

  async #askNextQuestionOrEnd(curIndex: number): Promise<string> {
    if (curIndex + 1 < this.stages.length)
      return this.stages[curIndex + 1].ask();
    else
      return await this.#endConversation();
  }

  async #endConversation(): Promise<string> {
    await this.#processAction();
    await this.stateManager.deleteChatState();
    return "Done!";
  }

  async #processAction(): Promise<void> {
    const action = await this.stateManager.getChatState().action;
    const scheduler = new ActionScheduler(action);
    await scheduler.schedule();
  }

  async remove(msg: Message): Promise<string> {
    const action = {
      chatId: msg.chat.id.toString(),
      userId: msg.from.id.toString()
    };
    
    // @ts-ignore
    const scheduler = new ActionScheduler(action);
    try {
      return await scheduler.remove();
    }
    catch (error) {
      console.log(error);
      return "Job not found to remove";
    }

  }
  // take in an answer to current question
  // We are going to find out what is our current question
  // we are going to validate that answer
  // valid: we are going to parse that answer
  // invalid: we are going to ask the current question again with an error message

  // We are going to parse the valid answer -> we are going to set the action accordingly

}


