import { nanoid } from "nanoid";
import { isEqual } from "lodash";
import { MessageAdapter } from "../adapters";
import { Message } from "../models";
import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";

export interface MessagesStore {
    messages: Message[]
    addMessage: (message: MessageAdapter) => void
    clearMessages: () => void
}

export const useMessagesStore = create<MessagesStore>((set, get) => ({
    messages: [] as Message[],

    /**
     * Reducer that adds to messages the message resulted of processing the MessageAdapter
     * @param {MessageAdapter} message 
     * @returns {Message[]}
     */
    addMessage: (message: MessageAdapter) => {
        
        const preparedMessage = {
            id: nanoid(),
            count: 1,
            ...message
        } as Message

        const stateMessages = get().messages;
        const lastMessage = stateMessages[stateMessages.length - 1];

        const resultMessagesState = updateMessagesArray(stateMessages, preparedMessage, lastMessage);

        set(state => ({
            ...state,
            messages: resultMessagesState
        }))

    },

    clearMessages: () => {
        set(state => ({
            ...state,
            messages: []
        }))
    }
}))

function areMessagesEqual(message: Message, adapter: MessageAdapter): boolean {
    if (
        message.board == adapter.board &&
        message.kind == adapter.kind &&
        message.name == adapter.name
    ) {
        return message.payload == adapter.payload;
    }

    return false;
}

function updateMessagesArray(stateMessages: Message[], preparedMessage: Message, lastMessage: Message): Message[] {
    if(stateMessages.length > 0 && areMessagesEqual(lastMessage, preparedMessage)) {
        return [
            ...stateMessages.slice(0, stateMessages.length - 1),
            {
                ...lastMessage,
                id: preparedMessage.id,
                count: lastMessage.count + 1
            }
        ] as Message[]
    } else {
        return [...stateMessages, preparedMessage] as Message[]
    }
}
