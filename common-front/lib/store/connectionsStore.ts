import { Connection, ConnectionsUpdate } from "..";
import { StateCreator, StoreApi, create } from "zustand";

export interface ConnectionsStore {
    connections: {
        backend: Connection;
        boards: Connection[];
    }
    setBackendConnection: (isConnected: boolean) => void;
    setConnections: (connections: ConnectionsUpdate) => void;
}

export const useConnectionsStore = create<ConnectionsStore>((set, get) => ({
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
    setConnections: (connections: ConnectionsUpdate) => {
        const boardsDraft = get().connections.boards;

        for (const board of boardsDraft) {
            if (board.name in connections) {
                board.isConnected = connections[board.name].isConnected
                delete(connections[board.name])
            }
        }

        for (const connection of Object.values(connections)) {
            boardsDraft.push(connection)
        }

        set(state => ({
            ...state,
            connections: {
                ...state.connections,
                boards: boardsDraft
            }
        }))
    }
}))