import { Message } from "telegram-typings/index.js";

export interface StageOptions {
  question: string;
  errorMessage: string;
  validator: ((answer: string) => boolean) | (() => boolean);
  parser?: (answer: string) => any;
  accessor?: (msg: Message) => string;
}

export class Stage {
  question: string;
  errorMessage: string;
  validator: ((answer: string) => boolean) | (() => boolean);
  parser: (answer: string) => any;
  accessor: (msg: Message) => string;

  constructor(options: StageOptions) {
    this.question = options.question;
    this.errorMessage = options.errorMessage;
    this.validator = options.validator;
    this.parser = options.parser ?? ((answer: string) => answer);
    this.accessor = options.accessor ?? ((msg: Message) => msg.text);
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
