import { createMessageSlice } from "common";

const messagesSlice = createMessageSlice();

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
