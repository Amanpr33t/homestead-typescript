import React, { Fragment, useEffect, useState } from "react"
import { IoArrowUndo } from "react-icons/io5";
import { TbMessage2Off } from "react-icons/tb";
import { formatDate, getDaysDifference } from "../../utils/dateFunctions";
import { useDispatch } from "react-redux";
import { UnreadCustomerMessagesActions } from "../../store/slices/unreadCustomerMessagesSlice";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useLocation} from "react-router-dom";

interface CustomerQueryType {
    propertyId: string,
    customerId: string,
    customerName: string,
    date: string,
    requestSeen: boolean
}

interface PropsType {
    showAllMessages: boolean,
    showMessagesSetter: (input: boolean) => void,
    updateSeenStatusOfSelectedCustomer: (customerId: string, propertyId: string, requestSeen: boolean) => void
}

//This component is used to show customer messages to property dealer
const CustomerNotificationsContainer: React.FC<PropsType> = ({
    showAllMessages,
    showMessagesSetter,
    updateSeenStatusOfSelectedCustomer
}) => {
    const dispatch = useDispatch()
    const location = useLocation()
    
    const customerRequests = useSelector((state: { CustomerRequests: { customerRequests: CustomerQueryType[] } }) => state.CustomerRequests.customerRequests)

    const [unreadCustomerQueries, setUnreadCustomerQueries] = useState<CustomerQueryType[]>([]) //stores data about customers whose queries have not been read

    useEffect(() => {
        //used to filter unread customer queries from all queries
        if (customerRequests && customerRequests.length) {
            const unreadQueries = customerRequests.filter(data => data.requestSeen === false)
            setUnreadCustomerQueries(unreadQueries)
            dispatch(UnreadCustomerMessagesActions.setUnreadCustomerMessages(unreadQueries.length))
        }
    }, [customerRequests, dispatch])

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

            <div className={`${location.pathname.includes('customer-notifications') ? ' w-11/12 sm:w-10/12 md:w-8/12 pb-10' : 'w-full border shadow h-fit'}  flex flex-col place-items-center rounded-2xl  bg-white`} >
                {/*toggle buttons */}
                <div className={` pt-5 pb-5 flex justify-center  ${location.pathname.includes('customer-notifications') ? '' : 'w-full border-b shadow-b'} `}>
                    <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                        <button className={`-mr-2 px-5  ${showAllMessages ? 'bg-green-400 text-white' : 'text-gray-600'}  text-lg font-medium rounded-3xl `} onClick={() => showMessagesSetter(true)}>All messages</button>
                        <button className={`-ml-2 md:-ml-1 lg:-ml-2 px-5 md:px-2 lg:px-5 py-1  ${!showAllMessages ? 'bg-green-400 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => showMessagesSetter(false)}>Unread ({unreadCustomerQueries.length})</button>
                    </div>
                </div>

                <div className={`w-full rounded-md ${location.pathname.includes('customer-notifications') ? '' : 'h-80'}`}>

                    <div className={`flex flex-col  ${location.pathname.includes('customer-notifications') ? '' : 'overflow-y-auto max-h-full'}`}>
                        {showAllMessages && customerRequests && customerRequests.length > 0 && customerRequests.map(customer => {
                            //all messages
                            return <div key={Math.random()} className={` px-5 py-3  cursor-pointer  ${location.pathname.includes('customer-notifications') ? 'border-b shadow' : 'rounded-md border-b-2 border-l-4 hover:border-l-blue-500 hover:bg-gray-50'}`} onClick={(e) => {
                                e.stopPropagation()
                                updateSeenStatusOfSelectedCustomer(customer.customerId, customer.propertyId, customer.requestSeen)
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

                        {!showAllMessages && unreadCustomerQueries.length > 0 && unreadCustomerQueries.map(customer => {
                            //unread messages
                            return <div key={Math.random()} className={` px-5 py-3  cursor-pointer  ${location.pathname.includes('customer-notifications') ? 'border-b shadow' : 'rounded-md border-b-2 border-l-4 hover:border-l-blue-500 hover:bg-gray-50'}`} onClick={(e) => {
                                e.stopPropagation()
                                updateSeenStatusOfSelectedCustomer(customer.customerId, customer.propertyId, customer.requestSeen)
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
                    {((!showAllMessages && !unreadCustomerQueries.length) || (showAllMessages && customerRequests && !customerRequests.length)) &&
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
export default CustomerNotificationsContainer