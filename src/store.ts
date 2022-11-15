import { configureStore } from "@reduxjs/toolkit";
import podDataReducer from "@slices/podDataSlice";

export default configureStore({
  reducer: {
    podData: podDataReducer,
  },
});
