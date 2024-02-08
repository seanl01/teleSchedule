import { Message } from "telegram-typings/index.js";


export class Stage {
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
