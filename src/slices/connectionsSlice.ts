import { createSlice } from "@reduxjs/toolkit";
import type { Connection } from "@models/Connection";
const connectionsSlice = createSlice({
  name: "connections",
  initialState: [] as Connection[],
  reducers: {
    updateConnection: (connections, action) => {
      let conn = connections.find((conn) => conn.name == action.payload.name)!;
      if (conn) {
        conn.isConnected = action.payload.isConnected;
      } else {
        connections.push(action.payload);
      }
    },
  },
});

export const { updateConnection } = connectionsSlice.actions;

export default connectionsSlice.reducer;
