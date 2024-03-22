import { configureStore } from "@reduxjs/toolkit";
import CustomerRequestsSlice from "./slices/customerRequests";


//The store stores all the data we want manage using react-redux
const store = configureStore({
  reducer: {
    CustomerRequests: CustomerRequestsSlice.reducer
  }
})

export default store