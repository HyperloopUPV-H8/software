import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const columnSlice = createSlice({
    name: "columns",
    initialState: ["30%", "10%", "20%", "20%", "20%"] as Array<string>,
    reducers: {
        setColumnSizes: (_, action: PayloadAction<Array<string>>) => {
            return action.payload;
        },
    },
});

export const { setColumnSizes } = columnSlice.actions;

export default columnSlice.reducer;
