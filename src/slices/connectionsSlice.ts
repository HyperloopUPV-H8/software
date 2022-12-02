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

    //CHECK this action
    updateConnectionsArray: (connections, action) => {
      let connectionArray = action.payload as Connection[];
      connectionArray.forEach((element) => {
        let conn = connections.find((conn) => conn.name == element.name)!;
        if (conn) {
          conn.isConnected = element.isConnected;
        } else {
          connections.push(element);
        }
      });
    },

    setDisconnectionState: (connections) => {
      connections.forEach((element) => {
        element.isConnected = false;
      });
    },

    initializeMockConnections: (connections, action) => {
      return action.payload;
    },
  },
});

export const {
  updateConnection,
  updateConnectionsArray,
  setDisconnectionState,
  initializeMockConnections,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
