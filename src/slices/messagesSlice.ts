import { Message as MessageAdapter } from "@adapters/Message";
import { Message } from "@models/Message";
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
          messages.warning.push(action.payload);
        } else if ("fault") {
          messages.fault.push(action.payload);
        }
      },
      prepare(message: MessageAdapter) {
        return { payload: { ...message, listId: nanoid() } };
      },
    },
  },
});

export const { updateMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
