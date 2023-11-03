import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    isAddPropertyOrDealer: false
}

export const AddPropertyOrDealerSlice = createSlice({
    name: 'AddPropertyOrDealer',
    initialState: initialState,
    reducers: {
        setAddPropertyOrDealer(state, action) {
            state.isAddPropertyOrDealer = action.payload
        }
    }
})

export default AddPropertyOrDealerSlice
export const AddPropertyOrDealerActions = AddPropertyOrDealerSlice.actions