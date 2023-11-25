import {
    createPodDataFromAdapter,
    PacketUpdate,
    PodDataAdapter,
    getPacketToBoard,
    getMeasurementToPacket,
    getPackets
} from "../adapters";
import { PodData, updatePacket, Board, Packet } from "../models";
import { create, StateCreator, StoreApi, UseBoundStore } from "zustand";

export interface PodDataStore {
    podData: PodData
    initPodData: (podDataAdapter: PodDataAdapter) => void
    updatePodData: (packetUpdates: Record<number, PacketUpdate>) => void
}

export const usePodDataStore = create<PodDataStore>((set, get) => ({
    podData: {
        boards: [] as Board[],
        packetToBoard: {} as Record<number, number>,
        lastUpdates: {} as Record<string, PacketUpdate>,
    },

    /**
     * Reducer that initializes the state based on podDataAdapter.
     * It uses a helper function createPodDataFromAdapter to do it.
     * @param {PodDataAdapter} podDataAdapter 
     */
    initPodData: (podDataAdapter: PodDataAdapter) => {

        const boards: Board[] = Object.values(podDataAdapter.boards).map(
            (boardAdapter) => {
                const packets = getPackets(boardAdapter.name, boardAdapter.packets);
                const measurementToPacket = getMeasurementToPacket(
                    boardAdapter.packets
                );
    
                return {
                    name: boardAdapter.name,
                    packets,
                    measurementToPacket,
                };
            }
        );
    
        const packetToBoard = getPacketToBoard(podDataAdapter.boards);
    
        const podDataResult = { boards, packetToBoard, lastUpdates: {} };

        set(state => ({
            ...state,
            podData: podDataResult
        }))
    },

    /**
     * Reducer that updates the state based on packetUpdates.
     * @param {Record<number, PacketUpdate>} packetUpdates 
     */
    updatePodData: (packetUpdates: Record<number, PacketUpdate>) => {
        const podData = get().podData;
        const updatedBoards = [...podData.boards];

        for (const update of Object.values(packetUpdates)) {
            const packet = getPacket(podData, update.id);
            if (packet) {
                const boardIndex = podData.packetToBoard[update.id];
    
                if (!boardIndex) {
                    console.warn(`packet with id ${update.id} not found in packetToBoard`);
                    continue;
                }
    
                const board = podData.boards[boardIndex];
    
                if (!board) {
                    console.warn(`board with index ${boardIndex} not found`);
                    continue;
                }

                const packetIndexInBoard = board.packets.findIndex(p => p.id == packet.id)

                const updatedBoard = {...board}
                updatedBoard.packets[packetIndexInBoard] = updatePacket(board.name, packet, update)

                updatedBoards[boardIndex] = updatedBoard;
                
            } else {
                console.warn(`packet with id ${update.id} not found`);
            }

        }

        set(state => ({
            ...state,
            podData: {
                ...state.podData,
                boards: updatedBoards,
                lastUpdates: packetUpdates
            }
        }))
    },
}))

export function getPacket(podData: PodData, id: number): Packet | undefined {
    const board = podData.boards[podData.packetToBoard[id]];

    if (board) {
        return board.packets.find((item) => item.id == id);
    }

    return undefined;
}