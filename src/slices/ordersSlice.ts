import { OrderDescription } from "@adapters/Order";
import { createSlice } from "@reduxjs/toolkit";
const ordersSlice = createSlice({
  name: "orders",
  initialState: [] as OrderDescription[],
  reducers: {
    setOrders: (orders, action) => {
      return action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
