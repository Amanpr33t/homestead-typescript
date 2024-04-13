import { createSlice } from "@reduxjs/toolkit";

type OpenSignInSignUpModalType = 'sign-in' | 'sign-up' | null

export const initialState: {
    openSignInSignUpModal: OpenSignInSignUpModalType
} = {
    openSignInSignUpModal: null
}

export const OpenSignInSignUpModalSlice = createSlice({
    name: 'OpenSignInSignUpModal',
    initialState: initialState,
    reducers: {
        setOpenSignInSignUpModal(state: { openSignInSignUpModal: OpenSignInSignUpModalType }, action: { payload: OpenSignInSignUpModalType }) {
            state.openSignInSignUpModal = action.payload
        }
    }
})

export default OpenSignInSignUpModalSlice
export const OpenSignInSignUpModalActions = OpenSignInSignUpModalSlice.actions