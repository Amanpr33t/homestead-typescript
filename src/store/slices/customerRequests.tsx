import { createSlice } from "@reduxjs/toolkit";

interface CustomerQueryType {
    propertyId: string,
    customerId: string,
    customerName: string,
    date: string,
    requestSeen: boolean
}

export const initialState: {
    customerRequests: CustomerQueryType[]
} = {
    customerRequests: []
}

export const CustomerRequestsSlice = createSlice({
    name: 'CustomerRequests',
    initialState: initialState,
    reducers: {
        setCustomerRequests(state: { customerRequests: CustomerQueryType[] }, action: { payload: CustomerQueryType[] }) {
            state.customerRequests = action.payload
        }
    }
})

export default CustomerRequestsSlice
export const CustomerRequestsActions = CustomerRequestsSlice.actions