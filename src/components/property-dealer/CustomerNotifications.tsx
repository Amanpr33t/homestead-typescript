import React, { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { IoArrowUndo } from "react-icons/io5";
import { TbMessage2Off } from "react-icons/tb";
import { formatDate, getDaysDifference } from "../../utils/dateFunctions";
import { useDispatch } from "react-redux";
import { UnreadCustomerMessagesActions } from "../../store/slices/unreadCustomerMessagesSlice";

interface CustomerQueryType {
    propertyId: string,
    customerId: string,
    customerName: string,
    date: string,
    requestSeen: boolean
}

interface PropsType {
    requestsFromCustomer?: CustomerQueryType[]
}

//This component is used to show customer messages to property dealer
const CustomerNotifications: React.FC<PropsType> = ({
    requestsFromCustomer
}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [showAllMessages, setShowAllMessages] = useState(true)//if true all messages will be shown and if false only unread messages will be shown

    const [unreadCustomerQueries, setUnreadCustomerQueries] = useState<CustomerQueryType[]>([]) //stores data about customers whose queries have not been read

    //When an unread query has been seen, its status will be updated to seen using this function
    /*const updateSeenStatusOfSelectedCustomer = useCallback(async (customerId: string, propertyId: string) => {
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
                if(customerQueriesSetter){
                    customerQueriesSetter(data.customerRequests)
                }
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            if(errorSetter){
                errorSetter(true)
            }
        }
    }, [authToken, navigate])*/

    useEffect(() => {
        //used to filter unread customer queries from all queries
        if (requestsFromCustomer && requestsFromCustomer.length) {
            console.log(requestsFromCustomer)
            const unreadQueries = requestsFromCustomer.filter(data => data.requestSeen === false)
            setUnreadCustomerQueries(unreadQueries)
            dispatch(UnreadCustomerMessagesActions.setUnreadCustomerMessages(unreadQueries.length))
        }
    }, [requestsFromCustomer])

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


            <div className={`md:border md:shadow bg-white w-full flex flex-col place-items-center rounded-2xl `} >

                {/*toggle buttons */}
                <div className="w-full sm:w-10/12 md:w-full pt-5 pb-5 flex justify-center border-b shadow-b ">
                    <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                        <button className={`-mr-2 md:-mr-1 lg:-mr-2 px-5 md:px-2 lg:px-5 ${showAllMessages ? 'bg-green-400 text-white' : 'text-gray-600'}  text-lg font-medium rounded-3xl `} onClick={() => setShowAllMessages(true)}>All messages</button>
                        <button className={`-ml-2 md:-ml-1 lg:-ml-2 px-5 md:px-2 lg:px-5 py-1  ${!showAllMessages ? 'bg-green-400 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => setShowAllMessages(false)}>Unread ({unreadCustomerQueries.length})</button>
                    </div>
                </div>

                <div className=" mx-2 md:mx-0 w-full sm:w-10/12 md:w-full h-64 rounded-md">

                    {/*All messages*/}
                    <div className="flex flex-col overflow-y-auto ">
                        {showAllMessages && requestsFromCustomer && requestsFromCustomer.length > 0 && requestsFromCustomer.map(customer => {
                            return <div key={Math.random()} className="border-b-2 px-5 py-3 sm:border-l-4 hover:border-l-blue-500 cursor-pointer rounded-md" onClick={(e) => {
                                e.stopPropagation()
                                if (!customer.requestSeen) {
                                    //updateSeenStatusOfSelectedCustomer(customer.customerId, customer.propertyId)
                                }
                            }}>
                                <div className="flex flex-row place-content-between gap-4">
                                    <p className="text-lg font-semibold text-gray-800">{customer.customerName.split(" ")}</p>
                                    <p className="text-gray-600 pt-0.5">{formatDate(customer.date)}</p>
                                </div>
                                <div className="flex flex-row gap-1 mt-2">
                                    <IoArrowUndo className="text-red-500" />
                                    <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(customer.date))}`}>
                                        Received {getDaysDifference(customer.date) > 0 ? `${getDaysDifference(customer.date)} days ago` : 'today'}. Reply?
                                    </p>
                                </div>
                            </div>
                        })}
                    </div>

                    {/*Unread messages*/}
                    <div className="flex flex-col overflow-y-auto">
                        {!showAllMessages && unreadCustomerQueries.length > 0 && unreadCustomerQueries.map(customer => {
                            return <div key={Math.random()} className="border-b-2 px-5 py-3  sm:border-l-4 hover:border-l-blue-500 cursor-pointer rounded-md" onClick={(e) => {
                                e.stopPropagation()
                                if (!customer.requestSeen) {
                                    //updateSeenStatusOfSelectedCustomer(customer.customerId, customer.propertyId)
                                }
                            }}>
                                <div className="flex flex-row place-content-between gap-4">
                                    <p className="text-lg font-semibold text-gray-800">{customer.customerName.split(" ")}</p>
                                    <p className="text-gray-600 pt-0.5">{formatDate(customer.date)}</p>
                                </div>
                                <div className="flex flex-row gap-1 mt-2">
                                    <IoArrowUndo className="text-red-500" />
                                    <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(customer.date))}`}>
                                        Received {getDaysDifference(customer.date) > 0 ? `${getDaysDifference(customer.date)} days ago` : 'today'}. Reply?
                                    </p>
                                </div>
                            </div>
                        })}
                    </div>

                    {/*If no unread messages are available or no messages are available */}
                    {((!showAllMessages && !unreadCustomerQueries.length) || (showAllMessages && requestsFromCustomer && !requestsFromCustomer.length)) &&
                        <div className="flex flex-col gap-3 place-items-center pt-3 overflow-y-auto">
                            <div className="flex flex-row">
                                <TbMessage2Off className="text-5xl text-gray-500" />
                                <p className="-ml-2 -mt-3 text-3xl h-fit w-5 text-center rounded-full text-red-500 font-bold">0</p>
                            </div>
                            <p className="text-gray-500 font-semibold text-xl text-center mx-2">
                                {!showAllMessages ? 'You have read all the messages' : 'No messages are available'}
                            </p>
                            <div className="w-80 bg-green-200 py-2 px-4 flex flex-col gap-2 rounded-xl max-w-fit mx-2">
                                <p className="text-gray-600 font-semibold text-lg">Pro tip:</p>
                                <p>Instantly responding to the customers' messages may increase your chances of striking a deal.</p>
                            </div>
                        </div>}

                </div>

            </div>

        </Fragment>
    )
}
export default CustomerNotifications