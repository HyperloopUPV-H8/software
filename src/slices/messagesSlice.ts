import { Message } from "@adapters/Message";
import { createSlice } from "@reduxjs/toolkit";
const messagesSlice = createSlice({
  name: "messages",
  initialState: {fault: [], warning: []} as  {fault:Message[], warning:Message[]} ,
  reducers: {
    updateFaultMessages: (messages, action) => {
      messages.fault.push(action.payload)
    },

    updateWarningMessages: (messages, action) => {
      messages.warning.push(action.payload)
    }
  },
});

export const { updateFaultMessages, updateWarningMessages } = messagesSlice.actions;

export default messagesSlice.reducer;