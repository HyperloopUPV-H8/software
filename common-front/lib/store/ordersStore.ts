import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";
import { BoardOrders, StateOrdersUpdate, VehicleOrders } from "..";

export interface OrdersStore {
    vehicleOrders: VehicleOrders
    setOrders: (vehicleOrders: VehicleOrders) => void
    updateStateOrders: (stateOrdersUpdate: StateOrdersUpdate) => void
}

export const useOrdersStore= create<OrdersStore>((set, get) => ({
    vehicleOrders: { boards: [] as BoardOrders[] },

    /**
     * Reducer that sets the vehicleOrders to the vehicleOrders param
     * @param {VehicleOrders} vehicleOrders
     */
    setOrders: (vehicleOrders: VehicleOrders) => {
        set(state => ({
            ...state,
            vehicleOrders: vehicleOrders
        }))
    },

    /**
     * Reducer that updates orders to stateOrdersUpdate param.
     * It checks if the board vinculated with each order of stateOrdersUpdate exists.
     * If so, it is updated. If not exists, it ignores that order.
     * @param {StateOrdersUpdate} stateOrdersUpdate 
     */
    updateStateOrders: (stateOrdersUpdate: StateOrdersUpdate) => {
        Object.entries(stateOrdersUpdate).forEach(([name, ids]) => {
            const index = get().vehicleOrders.boards.findIndex( (board) => board.name == name );
            if (index == -1) return

            set(state => ({
                ...state,
                vehicleOrders: {
                    ...state.vehicleOrders,
                    boards: {
                        ...state.vehicleOrders.boards,
                        [index]: {
                            ...state.vehicleOrders.boards[index],
                            stateOrders: state.vehicleOrders.boards[index].stateOrders.map(item => {
                                return {
                                    ...item,
                                    enabled: ids.includes(item.id),
                                };
                            }),
                        }
                    }
                }
            } as OrdersStore))
        })
    },
}))
