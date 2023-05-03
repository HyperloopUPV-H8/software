import { createOrderSlice } from "common";
const ordersSlice = createOrderSlice();

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
