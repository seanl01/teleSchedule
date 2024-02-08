export class StateSettingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StateSettingError";
  }
}

export class InvalidAnswerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAnswerError";
  }
} 