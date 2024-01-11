
import { Fragment, useEffect, useState } from "react"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import { MdFrontHand } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoArrowUndo } from "react-icons/io5";
import { TbMessage2Off } from "react-icons/tb";

//This component is the home page for property dealer
function CustomerNotifications() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-property-dealer-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })
    const [spinner, setSpinner] = useState(false)

    const [showAllMessages, setShowAllMessages] = useState(true)

    const [allCustomerQueries, setAllCustomerQueries] = useState([])
    const [unreadCustomerQueries, setUnreadCustomerQueries] = useState([])

    return (
        <Fragment>
            {spinner && <Spinner />}

            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    routeTo={alert.routeTo}
                    alertModalRemover={() => {
                        setAlert({
                            isAlertModal: false,
                            alertType: '',
                            alertMessage: '',
                            routeTo: null
                        })
                    }} />}

            {/*A modal that shows customer information */}
            <div className="fixed z-50 top-24 pt-12 bg-transparent h-screen w-full flex justify-center " >
                <div className="relative w-11/12 sm:w-96 h-fit rounded shadow bg-white" onClick={e => e.stopPropagation()}>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <p className="text-center text-xl font-bold mt-2 pb-2 border-b">Customer Information</p>
                    <div className="p-3 sm:p-6 sm:pt-2 text-center">
                        <div className="flex flex-col gap-2 pb-2 mb-2 border-b">
                            <div className="flex flex-row gap-3 text-lg ">
                                <p className="font-semibold text-gray-600">Name:</p>
                                <p>Amanpreet Singh</p>
                            </div>
                            <div className="flex flex-row gap-3 text-lg ">
                                <p className="font-semibold mr-1 text-gray-600">Email:</p>
                                <p>aman11865@gmail.com</p>
                            </div>
                            <div className="flex flex-row gap-3 text-lg">
                                <p className="font-semibold  text-gray-600">Contact No.:</p>
                                <p>978611865</p>
                            </div>
                        </div>
                        <p className="mb-4"><a href="https://www.freecodecamp.org/" target="_blank" className="text-red-500">Click here</a> to see the property in which the customer is interested.</p>
                        <button data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" >Ok</button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center min-h-screen bg-gray-100 pt-32 pb-10 ">
                <div className="ml-2 mr-2 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 flex flex-col bg-white rounded-md">

                    {/*toggle buttons */}
                    <div className="w-full pt-5 pb-5 flex justify-center border-b shadow">
                        <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                            <button className={`-mr-2 pl-5 pr-5 pt-1 pb-1 ${showAllMessages ? 'bg-blue-500 text-white' : 'text-gray-600'}   text-lg font-medium rounded-3xl`} onClick={() => setShowAllMessages(true)}>All messages</button>
                            <button className={`-ml-2 pl-5 pr-5  pt-1 pb-1  ${!showAllMessages ? 'bg-blue-500 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => setShowAllMessages(false)}>Unread (1)</button>
                        </div>
                    </div>

                    {/*All messages*/}
                    {showAllMessages && allCustomerQueries.length > 0 && allCustomerQueries.map(customer => {
                        return <div className="border-b-2 p-5 pt-7 pb-7 sm:border-l-4 hover:border-l-blue-500 cursor-pointer">
                            <div className="flex flex-row place-content-between">
                                <p className="text-lg font-semibold text-gray-800">Amanpreet Singh</p>
                                <p className="text-gray-600">10/01/2024</p>
                            </div>
                            <div className="flex flex-row gap-1 mt-2">
                                <IoArrowUndo className="text-red-500" />
                                <p className="text-red-500">Received 5 days ago. Reply?</p>
                            </div>
                        </div>
                    })}

                    {/*Unread messages*/}
                    {!showAllMessages && unreadCustomerQueries.length > 0 && unreadCustomerQueries.map(customer => {
                        return <div className="border-b-2 p-5 pt-7 pb-7 sm:border-l-4 hover:border-l-blue-500 cursor-pointer">
                            <div className="flex flex-row place-content-between">
                                <p className="text-lg font-semibold text-gray-800">Amanpreet Singh unread</p>
                                <p className="text-gray-600">10/01/2024</p>
                            </div>
                            <div className="flex flex-row gap-1 mt-2">
                                <IoArrowUndo className="text-red-500" />
                                <p className="text-red-500">Received 5 days ago. Reply?</p>
                            </div>
                        </div>
                    })}

                    {/*If no unread messages are available or no messages are available */}
                    {((!showAllMessages && !unreadCustomerQueries.length) || (showAllMessages && !allCustomerQueries.length)) &&
                        <div className="flex flex-col gap-5 place-items-center pt-12">
                            <div className="flex flex-row">
                                <TbMessage2Off className="text-6xl text-gray-500" />
                                <p className="-ml-2 -mt-3 text-3xl h-fit w-5 text-center rounded-full text-red-500 font-bold">0</p>
                            </div>
                            <div className="font-semibold text-xl">
                                {!showAllMessages ? 'You have read all the messages' : 'No messages are available'}
                            </div>
                            <div className="w-80 bg-green-200 p-4 flex flex-col gap-2 rounded">
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