import { StateCreator, StoreApi, UseBoundStore, create } from 'zustand';
import { BoardOrders, StateOrdersUpdate, VehicleOrders } from '..';

export interface OrdersStore {
    vehicleOrders: VehicleOrders;
    setOrders: (vehicleOrders: VehicleOrders) => void;
    updateStateOrders: (stateOrdersUpdate: StateOrdersUpdate) => void;
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
    vehicleOrders: { boards: [] as BoardOrders[] },

    /**
     * Reducer that sets the vehicleOrders to the vehicleOrders param
     * @param {VehicleOrders} vehicleOrders
     */
    setOrders: (vehicleOrders: VehicleOrders) => {
        set((state) => ({
            ...state,
            vehicleOrders: vehicleOrders,
        }));
    },

    /**
     * Reducer that updates orders to stateOrdersUpdate param.
     * It checks if the board vinculated with each order of stateOrdersUpdate exists.
     * If so, it is updated. If not exists, it ignores that order.
     * @param {StateOrdersUpdate} stateOrdersUpdate
     */
    updateStateOrders: (stateOrdersUpdate: StateOrdersUpdate) => {
        set((state) => ({
            ...state,
            vehicleOrders: {
                ...state.vehicleOrders,
                boards: state.vehicleOrders.boards.map((board) => {
                    if (!(board.name in stateOrdersUpdate)) {
                        return board;
                    }

                    return {
                        ...board,
                        stateOrders: board.stateOrders.map((desc) => {
                            return {
                                ...desc,
                                enabled: stateOrdersUpdate[board.name].includes(
                                    desc.id
                                ),
                            };
                        }),
                    };
                }),
            },
        }));
    },
}));
