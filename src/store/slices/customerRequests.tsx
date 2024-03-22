import { createSlice } from "@reduxjs/toolkit";

interface CustomerQueryType {
    propertyId: string,
    customerId: string,
    customerName: string,
    date: string,
    requestSeen: boolean
}

export const initialState: {
    customerRequests: CustomerQueryType[],
    unseenCustomerRequests: CustomerQueryType[]
} = {
    customerRequests: [],
    unseenCustomerRequests: []
}

export const CustomerRequestsSlice = createSlice({
    name: 'CustomerRequests',
    initialState: initialState,
    reducers: {
        setCustomerRequests(state: { customerRequests: CustomerQueryType[], unseenCustomerRequests: CustomerQueryType[] }, action: { payload: CustomerQueryType[] }) {
            let unSeenCustomerRequests: CustomerQueryType[] = []
            action.payload.forEach(request => {
                if (!request.requestSeen) {
                    unSeenCustomerRequests.push(request)
                }
            })
            state.unseenCustomerRequests = unSeenCustomerRequests
            state.customerRequests = action.payload
        }
    }
})

export default CustomerRequestsSlice
export const CustomerRequestsActions = CustomerRequestsSlice.actions