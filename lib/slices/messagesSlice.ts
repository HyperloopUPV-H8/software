import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { isEqual } from "lodash";
import { MessageAdapter } from "adapters/Message";
import { Message } from "models/Message";

export function createMessageSlice() {
    return createSlice({
        name: "messages",
        initialState: [] as Message[],
        reducers: {
            addMessage: {
                reducer(messages: Message[], action: PayloadAction<Message>) {
                    const newMessages = [...messages];

                    if (
                        messages.length > 0 &&
                        areMessagesEqual(
                            messages[messages.length - 1],
                            action.payload
                        )
                    ) {
                        newMessages[newMessages.length - 1] = {
                            ...messages[messages.length - 1],
                            id: action.payload.id,
                            count: messages[messages.length - 1].count + 1,
                        };
                    } else {
                        newMessages.push(action.payload);
                    }

                    return newMessages;
                },
                prepare(message: MessageAdapter) {
                    return {
                        payload: {
                            id: nanoid(),
                            count: 1,
                            ...message,
                        } as Message,
                    };
                },
            },
        },
    });
}

function areMessagesEqual(message: Message, adapter: MessageAdapter): boolean {
    if (
        message.board == adapter.board &&
        message.kind == adapter.kind &&
        message.name == adapter.name
    ) {
        return isEqual(message.protection, adapter.protection);
    }

    return false;
}
