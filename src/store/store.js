import { configureStore } from "@reduxjs/toolkit";
import NavbarSelectorSlice from "./slices/navbarSelector-slice";


//The store stores all the data we want manage using react-redux
const store = configureStore({
  reducer: {
    navbarSelector: NavbarSelectorSlice.reducer
  }
})

export default store