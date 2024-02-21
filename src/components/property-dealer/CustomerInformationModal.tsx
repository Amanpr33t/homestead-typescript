
import React, { Fragment } from "react"
import { useNavigate } from "react-router-dom"

interface CustomerQueryType {
    propertyType: 'agricultural' | 'commercial' | 'residential',
    propertyId: string,
    customerId: string,
    customerName: string,
    customerEmail: string,
    customerContactNumber: string,
    requestDate: string,
    requestSeen: boolean
}
interface PropsType {
    selectedCustomerSetter: () => void,
    selectedCustomer:CustomerQueryType
}

//This component is used to show customer messages to property dealer
const CustomerInformationModal: React.FC<PropsType> = ({
    selectedCustomerSetter,
   selectedCustomer
}) => {
    const navigate = useNavigate()

    return (
        <Fragment>
            {/*A modal that shows customer information */}
            <div className="fixed z-50 top-20 pt-8 bg-transparent h-screen w-full  flex justify-center " onClick={() => {
                selectedCustomerSetter()
            }}>
                <div className="relative w-11/12 sm:w-96 h-fit rounded shadow bg-white" onClick={e => e.stopPropagation()}>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => {
                        selectedCustomerSetter()
                    }}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <p className="text-center text-xl font-semibold mt-2 pb-2 border-b">Customer Information</p>
                    <div className="p-3 sm:p-6 sm:pt-2 text-center">
                        <div className="flex flex-col gap-2 pb-2 mb-2 border-b">
                            <div className="flex flex-row gap-3 text-lg ">
                                <p className="font-semibold text-gray-600">Name:</p>
                                <p>{selectedCustomer.customerName}</p>
                            </div>
                            <div className="flex flex-row gap-3 text-lg ">
                                <p className="font-semibold mr-1 text-gray-600">Email:</p>
                                <p>{selectedCustomer.customerEmail}</p>
                            </div>
                            <div className="flex flex-row gap-3 text-lg">
                                <p className="font-semibold  text-gray-600">Contact No.:</p>
                                <p>{selectedCustomer.customerContactNumber}</p>
                            </div>
                        </div>
                        <p>
                            <span className="text-red-500 cursor-pointer" onClick={() => {
                                navigate(`/property-dealer/review-property?type=${selectedCustomer.propertyType}&id=${selectedCustomer.propertyId}`)
                                return
                            }}>Click here</span> to see the property in which the customer is interested.
                        </p>
                        <button data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded border border-gray-200 text-sm font-medium px-5 py-2.5 mt-3 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => {
                            selectedCustomerSetter()
                        }}>Ok</button>
                    </div>
                </div>
            </div>

        </Fragment>
    )
}
export default CustomerInformationModal