import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControlSections } from "components/PodSections/ControlSections";

export const controlSectionsSlice = createSlice({
    name: "controlSections",
    initialState: {},
    reducers: {
        setControlSections: (_, action: PayloadAction<ControlSections>) => {
            return action.payload;
        },
    },
});

export const { setControlSections } = controlSectionsSlice.actions;

export const controlSectionsReducer = controlSectionsSlice.reducer;
