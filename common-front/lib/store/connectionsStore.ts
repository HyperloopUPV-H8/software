import { Connection } from "..";
import { StateCreator, StoreApi, create } from "zustand";

export interface ConnectionsStore {
    connections: {
        backend: Connection;
        boards: Connection[];
    }
    setBackendConnection: (isConnected: boolean) => void;
    setConnections: (connections: Connection[]) => void;
}

export const useConnectionsStore = create<ConnectionsStore>((set) => ({
    connections: {
        backend: { name: "Backend WebSocket", isConnected: false },
        boards: [] as Connection[],
    },

    /**
     * Reducer that sets the state of the websocket connection to isConnected param.
     * @param {boolean} isConnected
     */
    setBackendConnection: (isConnected: boolean) => {
        set(state => ({
            ...state,
            connections: {
                ...state.connections,
                backend: {
                    ...state.connections.backend,
                    isConnected: isConnected
                },
                boards: state.connections.boards.map(board => ({
                    ...board,
                    isConnected: isConnected && board.isConnected
                }))
            }
        }))
    },

    /**
     * Update the board connections in the state.
     * When a board connection state changes, it updates all the connections.
     * @param {Connection[]} connections 
     */
    setConnections: (connections: Connection[]) => {
        set(state => ({
            ...state,
            connections: {
                ...state.connections,
                boards: connections
            }
        }))
    }
}))