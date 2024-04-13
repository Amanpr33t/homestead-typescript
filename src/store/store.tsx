import { configureStore } from "@reduxjs/toolkit";
import CustomerRequestsSlice from "./slices/customerRequests";
import OpenSignInSignUpModalSlice from "./slices/openSignInSignUpModal";

//The store stores all the data we want manage using react-redux
const store = configureStore({
  reducer: {
    CustomerRequests: CustomerRequestsSlice.reducer,
    SignInSignUpModal: OpenSignInSignUpModalSlice.reducer
  }
})

export default store