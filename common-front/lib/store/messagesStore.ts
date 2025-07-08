import { nanoid } from "nanoid";
import { isEqual } from "lodash";
import { MessageAdapter } from "../adapters";
import { Message } from "../models";
import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";

export interface MessagesStore {
    messages: Message[]
    messagesMap: Map<string, Message>
    realtimeMode: boolean
    addMessage: (message: MessageAdapter) => void
    clearMessages: () => void
    toggleRealtimeMode: () => void
}

export const useMessagesStore = create<MessagesStore>((set, get) => ({
    messages: [] as Message[],
    messagesMap: new Map<string, Message>(),
    realtimeMode: true,

    /**
     * Reducer that adds to messages the message resulted of processing the MessageAdapter
     * @param {MessageAdapter} message 
     * @returns {Message[]}
     */
    addMessage: (message: MessageAdapter) => {
        const state = get();
        const messageKey = `${message.board}-${message.kind}-${message.name}`;
        
        const preparedMessage = {
            id: nanoid(),
            count: 1,
            ...message
        } as Message

        if (state.realtimeMode) {
            // Realtime mode: update existing messages in place
            const existingMessage = state.messagesMap.get(messageKey);
            
            if (existingMessage && areMessagesEqual(existingMessage, message)) {
                // Update existing message
                const updatedMessage = {
                    ...existingMessage,
                    count: existingMessage.count + 1,
                    timestamp: message.timestamp,
                    id: preparedMessage.id // Update ID to maintain render order
                };
                
                const newMap = new Map(state.messagesMap);
                newMap.set(messageKey, updatedMessage);
                
                set({
                    messagesMap: newMap,
                    messages: Array.from(newMap.values())
                });
            } else {
                // Add new message or replace if payload changed
                const newMap = new Map(state.messagesMap);
                newMap.set(messageKey, preparedMessage);
                
                set({
                    messagesMap: newMap,
                    messages: Array.from(newMap.values())
                });
            }
        } else {
            // Historical mode: always append (original behavior)
            const stateMessages = state.messages;
            const lastMessage = stateMessages[stateMessages.length - 1];
            const resultMessagesState = updateMessagesArray(stateMessages, preparedMessage, lastMessage);

            set({
                messages: resultMessagesState,
                messagesMap: state.messagesMap // Keep map unchanged in historical mode
            });
        }
    },

    clearMessages: () => {
        set({
            messages: [],
            messagesMap: new Map()
        });
    },

    toggleRealtimeMode: () => {
        set(state => ({
            realtimeMode: !state.realtimeMode,
            // Clear messages when switching modes for a clean slate
            messages: [],
            messagesMap: new Map()
        }));
    }
}))

function areMessagesEqual(message: Message, adapter: MessageAdapter): boolean {
    if (
        message.board === adapter.board &&
        message.kind === adapter.kind &&
        message.name === adapter.name
    ) {
        return message.payload === adapter.payload;
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
