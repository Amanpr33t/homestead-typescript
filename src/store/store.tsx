import { configureStore } from "@reduxjs/toolkit";
import UnreadCustomerMessagesSlice from "./slices/unreadCustomerMessagesSlice";


//The store stores all the data we want manage using react-redux
const store = configureStore({
  reducer: {
    UnreadCustomerMessages: UnreadCustomerMessagesSlice.reducer
  }
})

export default store