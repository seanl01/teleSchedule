import { Message } from "telegram-typings/index.js";
import StateManager from "../data/StateManager.js";
import { Stage } from "./Stage.js";
import { ActionModel } from "./ActionModel.js";

// if (!stage.validate(answer)) {
//     return stage.askAgain()
// }


// Takes in session key (userId and chatId)
export default class Conversation {
  // receives msg: Message object
  // uses stateManager to find correct stage
  stages: Stage[];
  stateManager: StateManager;

  // Dependency injection
  constructor(stages: Stage[], stateManagerClass) {
    this.stages = stages
    this.stateManager = new stateManagerClass();
  }

  async start(msg: Message): Promise<string> {
    const actionModel = new ActionModel();
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

  async receiveMessage(msg: Message) {
    // 
    await this.stateManager.init(msg);
    const state = this.stateManager.getChatState();
    const curIndex = state?.index ?? 0;

    const stage = this.stages[curIndex];

    if (!stage.validate(msg.text))
      throw new Error("Invalid message");

    const answer = stage.getCleanAnswer(msg);

    try {
      const actionModel = new ActionModel(state.action);

      // TODO: call correct function on actionmodel

      this.stateManager.setChatState({
        index: curIndex + 1,
        action: actionModel.model
      });

      return this.stages[curIndex + 1].ask();
    }
    catch (error) {
      console.log(error);
      return "Something went wrong. Please try again later."
    }

  }


  // take in an answer to current question
  // We are going to find out what is our current question
  // we are going to validate that answer
  // valid: we are going to parse that answer
  // invalid: we are going to ask the current question again with an error message

  // We are going to parse the valid answer -> we are going to set the action accordingly

}


