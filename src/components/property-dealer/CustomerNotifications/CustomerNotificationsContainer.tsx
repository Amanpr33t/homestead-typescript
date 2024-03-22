import React, { Fragment } from "react"
import { TbMessage2Off } from "react-icons/tb";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useLocation } from "react-router-dom";
import SingleCustomerNotification from "./SingleCustomerNotification";

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
    const location = useLocation()

    const customerRequests = useSelector((state: { CustomerRequests: { customerRequests: CustomerQueryType[] } }) => state.CustomerRequests.customerRequests)

    const unseenCustomerRequests = useSelector((state: { CustomerRequests: { unseenCustomerRequests: CustomerQueryType[] } }) => state.CustomerRequests.unseenCustomerRequests)

    return (
        <Fragment>

            <div className={`${location.pathname.includes('customer-notifications') ? ' w-11/12 sm:w-10/12 md:w-8/12 pb-10' : 'w-full border shadow h-fit'}  flex flex-col place-items-center rounded-2xl  bg-white`} >
                {/*toggle buttons */}
                <div className={` py-3 flex justify-center  ${location.pathname.includes('customer-notifications') ? '' : 'w-full border-b shadow-b'}`}>
                    <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                        <button className={`-mr-2 px-5  ${showAllMessages ? 'bg-green-400 text-white' : 'text-gray-600'}  text-lg font-medium rounded-3xl `} onClick={() => showMessagesSetter(true)}>All messages</button>
                        <button className={`-ml-2 md:-ml-1 lg:-ml-2 px-5 md:px-2 lg:px-5 py-1  ${!showAllMessages ? 'bg-green-400 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => showMessagesSetter(false)}>Unseen ({unseenCustomerRequests.length})</button>
                    </div>
                </div>

                <div className={`w-full rounded-md ${location.pathname.includes('customer-notifications') ? '' : 'h-96'}`}>

                    <div className={`flex flex-col  ${location.pathname.includes('customer-notifications') ? '' : 'overflow-y-auto max-h-full'}`}>
                        {showAllMessages && customerRequests && customerRequests.length > 0 && customerRequests.map(customer => {
                            //all messages
                            return <div key={Math.random()}> <SingleCustomerNotification
                                propertyId={customer.propertyId}
                                customerId={customer.customerId}
                                customerName={customer.customerName}
                                date={customer.date}
                                requestSeen={customer.requestSeen}
                                updateSeenStatusOfSelectedCustomer={updateSeenStatusOfSelectedCustomer}
                            /></div>
                        })}

                        {!showAllMessages && unseenCustomerRequests.length > 0 && unseenCustomerRequests.map(customer => {
                            //unseen messages
                            return <div key={Math.random()}><SingleCustomerNotification
                                propertyId={customer.propertyId}
                                customerId={customer.customerId}
                                customerName={customer.customerName}
                                date={customer.date}
                                requestSeen={customer.requestSeen}
                                updateSeenStatusOfSelectedCustomer={updateSeenStatusOfSelectedCustomer}
                            /></div>
                        })}
                    </div>

                    {/*If no unseen messages are available or no messages are available */}
                    {((!showAllMessages && !unseenCustomerRequests.length) || (showAllMessages && customerRequests && !customerRequests.length)) &&
                        <div className="flex flex-col gap-3 place-items-center pt-10 overflow-y-auto">
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