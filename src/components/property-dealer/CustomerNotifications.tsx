import React, { Fragment, useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom";
import { IoArrowUndo } from "react-icons/io5";
import { TbMessage2Off } from "react-icons/tb";
import { formatDate, getDaysDifference } from "../../utils/dateFunctions";

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
    selectedCustomerSetter: (customer: CustomerQueryType) => void,
    selectedCustomer: CustomerQueryType | null,
    errorSetter: (input: boolean) => void,
    allCustomerQueries: CustomerQueryType[],
    customerQueriesSetter: (input: CustomerQueryType[]) => void
}

//This component is used to show customer messages to property dealer
const CustomerNotifications: React.FC<PropsType> = ({
    selectedCustomerSetter,
    selectedCustomer,
    errorSetter,
    allCustomerQueries,
    customerQueriesSetter
}) => {
    const navigate = useNavigate()

    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [showAllMessages, setShowAllMessages] = useState(true)//if true all messages will be shown and if false only unread messages will be shown

    const [unreadCustomerQueries, setUnreadCustomerQueries] = useState<CustomerQueryType[]>([]) //stores data about customers whose queries have not been read

    //When an unread query has been seen, its status will be updated to seen using this function
    const updateSeenStatusOfSelectedCustomer = useCallback(async (customerId: string, propertyId: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/updateSeenStatusOfCustomerRequest?customerId=${customerId}&propertyId=${propertyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                customerQueriesSetter(data.customerRequests)
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            errorSetter(true)
        }
    }, [authToken, navigate])

    useEffect(() => {
        //used to filter unread customer queries from all queries
        if (allCustomerQueries.length) {
            const unreadQueries = allCustomerQueries.filter(data => data.requestSeen === false)
            setUnreadCustomerQueries(unreadQueries)
        }
    }, [allCustomerQueries])

    const dayDiffernceColorSetter = (days: number): string => {
        if (days < 1) {
            return 'text-green-500'
        } else if (days < 2) {
            return 'text-orange-500'
        } else {
            return 'text-red-500'
        }
    }

    return (
        <Fragment>


            <div className={`md:border md:shadow w-full flex flex-col place-items-center bg-slate-100  ${selectedCustomer ? 'blur' : ''}`} >

                {/*<button type='button' className="bg-green-500 hover:bg-green-600 fixed top-20 left-2 mt-2 text-white font-semibold rounded px-2 py-1 md:hidden" onClick={() => {
                    navigate('/property-dealer', { replace: true })
                }}>Back</button> md:bg-transparent*/}

                {/*toggle buttons */}
                <div className="w-full sm:w-10/12 md:w-full pt-2 pb-2 flex justify-center border-b shadow-b ">
                    <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                        <button className={`-mr-2 md:-mr-1 lg:-mr-2 px-5 md:px-2 lg:px-5 ${showAllMessages ? 'bg-blue-500 text-white' : 'text-gray-600'}  text-lg font-medium rounded-3xl `} onClick={() => setShowAllMessages(true)}>All messages</button>
                        <button className={`-ml-2 md:-ml-1 lg:-ml-2 px-5 md:px-2 lg:px-5 py-1  ${!showAllMessages ? 'bg-blue-500 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => setShowAllMessages(false)}>Unread ({unreadCustomerQueries.length})</button>
                    </div>
                </div>

                <div className=" mx-2 md:mx-0 w-full sm:w-10/12 md:w-full flex flex-col rounded-md overflow-y-auto  h-96">

                    {/*All messages*/}
                    {showAllMessages && allCustomerQueries.length > 0 && allCustomerQueries.map(customer => {
                        return <div key={Math.random()} className="border-b-2 p-5 pt-3 pb-3 sm:border-l-4 hover:border-l-blue-500 cursor-pointer bg-slate-50" onClick={(e) => {
                            e.stopPropagation()
                            selectedCustomerSetter(customer)
                            if (!customer.requestSeen) {
                                updateSeenStatusOfSelectedCustomer(customer.customerId, customer.propertyId)
                            }
                        }}>
                            <div className="flex flex-row place-content-between gap-4">
                                <p className="text-lg font-semibold text-gray-800">{customer.customerName}</p>
                                <p className="text-gray-600 pt-0.5">{formatDate(customer.requestDate)}</p>
                            </div>
                            <div className="flex flex-row gap-1 mt-2">
                                <IoArrowUndo className="text-red-500" />
                                <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(customer.requestDate))}`}>
                                    Received {getDaysDifference(customer.requestDate) > 0 ? `${getDaysDifference(customer.requestDate)} days ago` : 'today'}. Reply?
                                </p>
                            </div>
                        </div>
                    })}

                    {/*Unread messages*/}
                    {!showAllMessages && unreadCustomerQueries.length > 0 && unreadCustomerQueries.map(customer => {
                        return <div key={Math.random()} className="border-b-2 p-5 pt-3 pb-3 sm:border-l-4 hover:border-l-blue-500 cursor-pointer bg-slate-50" onClick={(e) => {
                            e.stopPropagation()
                            selectedCustomerSetter(customer)
                            if (!customer.requestSeen) {
                                updateSeenStatusOfSelectedCustomer(customer.customerId, customer.propertyId)
                            }
                        }}>
                            <div className="flex flex-row place-content-between gap-4">
                                <p className="text-lg font-semibold text-gray-800">{customer.customerName}</p>
                                <p className="text-gray-600 pt-0.5">{formatDate(customer.requestDate)}</p>
                            </div>
                            <div className="flex flex-row gap-1 mt-2">
                                <IoArrowUndo className="text-red-500" />
                                <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(customer.requestDate))}`}>
                                    Received {getDaysDifference(customer.requestDate) > 0 ? `${getDaysDifference(customer.requestDate)} days ago` : 'today'}. Reply?
                                </p>
                            </div>
                        </div>
                    })}

                    {/*If no unread messages are available or no messages are available */}
                    {((!showAllMessages && !unreadCustomerQueries.length) || (showAllMessages && !allCustomerQueries.length)) &&
                        <div className="flex flex-col gap-5 place-items-center pt-5">
                            <div className="flex flex-row">
                                <TbMessage2Off className="text-6xl text-gray-500" />
                                <p className="-ml-2 -mt-3 text-3xl h-fit w-5 text-center rounded-full text-red-500 font-bold">0</p>
                            </div>
                            <p className="font-semibold text-xl text-center mx-2">
                                {!showAllMessages ? 'You have read all the messages' : 'No messages are available'}
                            </p>
                            <div className="w-80 bg-green-200 p-4 flex flex-col gap-2 rounded max-w-fit mx-2">
                                <p className="font-semibold text-lg">Pro tip:</p>
                                <p>Instantly responding to the customers' messages may increase your chances of striking a deal.</p>
                            </div>
                        </div>}

                </div>

            </div>

        </Fragment>
    )
}
export default CustomerNotifications