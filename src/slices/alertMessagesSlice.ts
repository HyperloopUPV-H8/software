import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertMessage } from "models/AlertMessage";
export const alertMessagesSlice = createSlice({
    name: "alertMessages",
    initialState: [] as AlertMessage[],
    reducers: {
        addMessage: (state, action: PayloadAction<AlertMessage>) => {
            state.push(action.payload);
        },
    },
});

export const { addMessage } = alertMessagesSlice.actions;

export const alertMessagesReducer = alertMessagesSlice.reducer;
