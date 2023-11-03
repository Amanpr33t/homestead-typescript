import { configureStore } from "@reduxjs/toolkit";
import AddPropertyOrDealerSlice from "./slices/addPropertyOrDealer-slice";


//The store stores all the data we want manage using react-redux
const store = configureStore({
  reducer: {
    addPropertyOrDealer: AddPropertyOrDealerSlice.reducer
  }
})

export default store