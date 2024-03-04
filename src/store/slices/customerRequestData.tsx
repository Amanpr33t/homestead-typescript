import { createSlice } from "@reduxjs/toolkit";

interface CustomerQueryType {
    propertyId: string ,
    customerId: string,
    requestSeen: boolean
}

export const initialState: {
    customerRequestData: CustomerQueryType | null
} = {
    customerRequestData: null
}

export const CustomerRequestDataSlice = createSlice({
    name: 'CustomerRequestData',
    initialState: initialState,
    reducers: {
        setCustomerRequestData(state: { customerRequestData: CustomerQueryType | null }, action: { payload: CustomerQueryType | null }) {
            state.customerRequestData = action.payload
        }
    }
})

export default CustomerRequestDataSlice
export const CustomerRequestDataActions = CustomerRequestDataSlice.actions