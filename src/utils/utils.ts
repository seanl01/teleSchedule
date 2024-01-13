export function getUserIdAndChatId(msg) {
    const chatId = msg.chat.id.toString();
    const userId = msg.from?.id.toString() || "";
    return { chatId, userId };
}

export class ConversationManager {
    state: number;
    chatId: string;
    userId: string;

    constructor(state, chatId, userId) {
        this.state = state;
        this.chatId = chatId;
        this.userId = userId;
    }
}