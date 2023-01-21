import { configureStore } from "@reduxjs/toolkit";
import { podDataReducer } from "slices/podDataSlice";
import { controlSectionsReducer } from "slices/controlSectionsSlice";
export const store = configureStore({
    reducer: {
        podData: podDataReducer,
        controlSections: controlSectionsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
