import { configureStore } from "@reduxjs/toolkit";
import UnreadCustomerMessagesSlice from "./slices/unreadCustomerMessagesSlice";
import CustomerRequestsSlice from "./slices/customerRequests";
import CustomerRequestDataSlice from "./slices/customerRequestData";


//The store stores all the data we want manage using react-redux
const store = configureStore({
  reducer: {
    UnreadCustomerMessages: UnreadCustomerMessagesSlice.reducer,
    CustomerRequests: CustomerRequestsSlice.reducer,
    CustomerRequestData: CustomerRequestDataSlice.reducer
  }
})

export default store