import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    numberOfUnreadMessages: 0
}

export const UnreadCustomerMessagesSlice = createSlice({
    name: 'UnreadCustomerMessages',
    initialState: initialState,
    reducers: {
        setUnreadCustomerMessages(state: { numberOfUnreadMessages: number }, action: { payload: number }) {
            state.numberOfUnreadMessages = action.payload
        }
    }
})

export default UnreadCustomerMessagesSlice
export const UnreadCustomerMessagesActions = UnreadCustomerMessagesSlice.actions