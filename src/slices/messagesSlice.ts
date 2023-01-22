import { Message as MessageAdapter } from "adapters/Message";
import { Message } from "models/Message";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
const messagesSlice = createSlice({
    name: "messages",
    initialState: { fault: [], warning: [] } as {
        fault: Message[];
        warning: Message[];
    },
    reducers: {
        updateMessages: {
            reducer(messages, action: PayloadAction<Message>) {
                if (action.payload.type == "warning") {
                    if (
                        messages.warning.length > 0 &&
                        messages.warning[messages.warning.length - 1].id ==
                            action.payload.id
                    ) {
                        messages.warning[messages.warning.length - 1].listId =
                            action.payload.listId;
                        messages.warning[messages.warning.length - 1].count++;
                    } else {
                        messages.warning.push(action.payload);
                    }
                } else if ("fault") {
                    if (
                        messages.fault.length > 0 &&
                        messages.fault[messages.fault.length - 1].id ==
                            action.payload.id
                    ) {
                        messages.fault[messages.fault.length - 1].listId =
                            action.payload.listId;
                        messages.fault[messages.fault.length - 1].count++;
                    } else {
                        messages.fault.push(action.payload);
                    }
                }
            },
            prepare(message: MessageAdapter) {
                return {
                    payload: { ...message, listId: nanoid(), count: 1 },
                };
            },
        },
    },
});

export const { updateMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
