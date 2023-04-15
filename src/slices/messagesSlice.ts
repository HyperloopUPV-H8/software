import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProtectionMessageAdapter } from "adapters/ProtectionMessage";
import { ProtectionMessage } from "models/ProtectionMessage";
import { nanoid } from "nanoid";
import { isEqual } from "lodash";

function areMessagesEqual(
    message: ProtectionMessage,
    adapter: ProtectionMessageAdapter
): boolean {
    if (
        message.board == adapter.board &&
        message.kind == adapter.kind &&
        message.name == adapter.name
    ) {
        return isEqual(message.violation, adapter.violation);
    }

    return false;
}

const messagesSlice = createSlice({
    name: "messages",
    initialState: [] as Array<ProtectionMessage>,
    reducers: {
        addMessage: {
            reducer(messages, action: PayloadAction<ProtectionMessage>) {
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
            prepare(message: ProtectionMessageAdapter) {
                return {
                    payload: { ...message, id: nanoid(), count: 1 },
                };
            },
        },
    },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
