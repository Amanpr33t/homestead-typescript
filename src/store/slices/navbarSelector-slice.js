import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    fieldAgent: false,
    propertyEvaluator: false
}

export const NavbarSelectorSlice = createSlice({
    name: 'NavbarSelector',
    initialState: initialState,
    reducers: {
        setNavbar(state, action) {
            state.fieldAgent = action.payload.fieldAgent
            state.propertyEvaluator = action.payload.propertyEvaluator
        }
    }
})

export default NavbarSelectorSlice
export const NavbarSelectorActions = NavbarSelectorSlice.actions