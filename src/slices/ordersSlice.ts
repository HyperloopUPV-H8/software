import { createSlice } from "@reduxjs/toolkit";
const ordersSlice = createSlice({
  name: "orders",
  initialState: [],
  reducers: {
    setOrders: (orders, action) => {
      orders = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
