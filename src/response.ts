import TelegramBot from "node-telegram-bot-api";

export enum BotQuestions {
    TEMPLATE_MESSAGE = 0,
    DAYS = 1,
    TIME = 2,
    LAST_DATE = 3,
    DONE = 4
};

type QuestionData = {
    [key in BotQuestions]: questionHandler;
};

class ResponderBase {
    botQuestionIndex: BotQuestions;

    constructor(index: BotQuestions, botCallback: Function, actionCallback: Function) {
        this.botQuestionIndex = index;
        this.botCallback = botCallback;
        this.actionCallback = actionCallback;
    }
    // sends questions to user, validates responses and performs requested callbacks for a single questionIndex
    async respond(inputText: string) {
        const validator = validators[this.botQuestionIndex];
        if (!validator(inputText)) {
            await this.botCallback()
        }
        await this.actionCallback();
    }
}

// I need a responder for each question Index

function constructResponder(bot, index) {
    const responder = new ResponderBase(index)
}



