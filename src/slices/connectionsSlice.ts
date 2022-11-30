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
    initializeMockConnections: (connections, action) => {
        return action.payload;
    }, 
  },
});

export const { updateConnection, initializeMockConnections } = connectionsSlice.actions;

export default connectionsSlice.reducer;
