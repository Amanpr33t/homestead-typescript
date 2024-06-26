import { Link } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null
    routeTo: string | null
}

//The component shows the home page of the field agent
const HomeFieldAgent: React.FC = () => {
    const navigate = useNavigate()

    const authToken: null | string = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        localStorage.removeItem('homestead-property-dealer-authToken')
        localStorage.removeItem('homestead-property-evaluator-authToken')
        localStorage.removeItem('homestead-city-manager-authToken')
        localStorage.removeItem(`homestead-user-authToken`)
        if (!authToken) {
            navigate('/user', { replace: true })
            return
        }
    }, [authToken, navigate])

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })
    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const [numberOfPropertiesApprovedByCityManager, setNumberOfPropertiesApprovedByCityManager] = useState<number>(0)//number of propertes that approved by city manager

    const [numberOfPropertiesAdded, setNumberOfPropertiesAdded] = useState<number>(0) //Number of properties added by the field agent

    const [numberOfPropertyDealersAdded, setNumberOfPropertyDealersAdded] = useState<number>(0) //number of property dealers added by the field agent

    const [requestsToAddNewProperty, setRequestsToAddNewProperty] = useState<number>(0)

    const [pendingRequestsForPropertyReevaluation, setPendingRequestForPropertyReevaluation] = useState<{
        agricultural: number,
        residential: number,
        commercial: number
    }>({
        agricultural: 0,
        residential: 0,
        commercial: 0
    }) //number of pending requests for property reevaluation

    const [requestsDropdown, setRequestsDropdown] = useState<boolean>(false) //If true, a request dropdown will be shown to the user

    //The function is used to fetch the number of properties and property dealers added by the field agent
    const fetchDataForHomePage = useCallback(async () => {
        try {
            setSpinner(true)
            setError(false)
            const response = await fetch(`http://localhost:3011/field-agent/dataForFieldAgentHomePage`, {
                method: 'GET',
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
                setSpinner(false)
                setNumberOfPropertiesApprovedByCityManager(data.numberOfPropertiesApprovedByCityManager)
                setNumberOfPropertyDealersAdded(data.numberOfPropertyDealersAdded)
                setNumberOfPropertiesAdded(data.numberOfPropertiesAdded)
                setPendingRequestForPropertyReevaluation({
                    agricultural: data.pendingPropertyReevaluations.agricultural,
                    residential: data.pendingPropertyReevaluations.residential,
                    commercial: data.pendingPropertyReevaluations.commercial
                })
                setRequestsToAddNewProperty(data.requestsToAddProperty)
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/user', { replace: true })
                return
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [authToken, navigate])

    useEffect(() => {
        if (authToken) {
            fetchDataForHomePage()
        }
    }, [authToken, fetchDataForHomePage])


    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {alert.isAlertModal && <AlertModal
                message={alert.alertMessage}
                type={alert.alertType}
                routeTo={alert.routeTo}
                alertModalRemover={() => {
                    setAlert({
                        isAlertModal: false,
                        alertType: null,
                        alertMessage: null,
                        routeTo: null
                    })
                }} />}

            {/*This message is shown when an error occurs while fetching data */}
            {error && !spinner &&
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <p className="text-red-500 cursor-pointer" onClick={fetchDataForHomePage}>Try again</p>
                </div>}

            {!spinner && !alert.isAlertModal && !error &&
                <div className='relative flex flex-col md:flex-row pt-32 md:pt-20 pb-4 pl-2 sm:pl-6 md:pl-8 lg:pl-28 pr-2 sm:pr-6 md:pr-8 lg:pr-28 gap-4 bg-slate-100 min-h-screen ' onClick={() => {
                    setRequestsDropdown(false)
                }}>

                    {/*This div  will only be shown for screeen with width larger than 768px */}
                    <div className="hidden md:flex flex-col w-96 h-fit bg-white gap-2 p-3 rounded">
                        <p className="text-2xl font-bold text-center mb-2">Pending Requests</p>
                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded  hover:bg-sky-100" onClick={() => {
                            if (requestsToAddNewProperty > 0) {
                                navigate(`/field-agent/requests-to-add-new-property`, { replace: true })
                                return
                            }
                        }}>
                            <p className="text-5xl">{requestsToAddNewProperty}</p>
                            <p className="w-40">Pending visits to add a new property</p>
                        </div>
                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded hover:bg-sky-100">
                            <p className="text-5xl">0</p>
                            <p className="w-40">Pending visits to add a property dealer</p>
                        </div>
                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded hover:bg-sky-100"
                            onClick={() => {
                                if (pendingRequestsForPropertyReevaluation.agricultural + pendingRequestsForPropertyReevaluation.commercial + pendingRequestsForPropertyReevaluation.residential > 0) {
                                    navigate(`/field-agent/reconsider-property-details?agricultural=${pendingRequestsForPropertyReevaluation.agricultural}&commercial=${pendingRequestsForPropertyReevaluation.commercial}&residential=${pendingRequestsForPropertyReevaluation.residential}`, { replace: true })
                                    return
                                }
                            }}>
                            <p className="text-5xl">{pendingRequestsForPropertyReevaluation.agricultural + pendingRequestsForPropertyReevaluation.commercial + pendingRequestsForPropertyReevaluation.residential}</p>
                            <p className="w-40">Pending requests to reconsider details of a property</p>
                        </div>
                    </div>

                    {/*This div is a dropdown which will only be shown for screeen with width smaller than 768px */}
                    <div className={`fixed md:hidden top-16 w-full z-10 ${requestsDropdown ? 'h-screen' : 'h-fit'}`}>
                        <div className="relative mt-3.5 border border-gray-400 w-fit p-1 cursor-pointer bg-white" onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                            event.stopPropagation()
                            setRequestsDropdown(requestsDropdown => !requestsDropdown)
                        }
                        }>Pending Requests {requestsDropdown ? "▲" : "▼"}
                            {requestsDropdown && <div className="absolute top-8 -left-0.5 bg-white" >
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer hover:bg-sky-100" onClick={() => {
                                    if (requestsToAddNewProperty > 0) {
                                        navigate(`/field-agent/requests-to-add-new-property`, { replace: true })
                                        return
                                    }
                                }}>
                                    <p className="text-5xl">{requestsToAddNewProperty}</p>
                                    <p className="w-40">Pending visits to add a new property</p>
                                </div>
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer hover:bg-sky-100" >
                                    <p className="text-5xl">0</p>
                                    <p className="w-40">Pending visits to add a new property dealer</p>
                                </div>
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer hover:bg-sky-100" onClick={() => {
                                    if (pendingRequestsForPropertyReevaluation.agricultural + pendingRequestsForPropertyReevaluation.commercial + pendingRequestsForPropertyReevaluation.residential > 0) {
                                        navigate(`/field-agent/reconsider-property-details?agricultural=${pendingRequestsForPropertyReevaluation.agricultural}&commercial=${pendingRequestsForPropertyReevaluation.commercial}&residential=${pendingRequestsForPropertyReevaluation.residential}`, { replace: true })
                                        return
                                    }
                                }}>
                                    <p className="text-5xl">{pendingRequestsForPropertyReevaluation.agricultural + pendingRequestsForPropertyReevaluation.commercial + pendingRequestsForPropertyReevaluation.residential}</p>
                                    <p className="w-40">Pending requests to reconsider details of a property</p>
                                </div>
                            </div>}
                        </div>
                    </div>

                    <div className={`w-full bg-white rounded pt-6 pb-6 ${requestsDropdown || alert.isAlertModal ? 'blur' : ''}`} >

                        <div className="flex flex-row gap-3 w-full place-content-center">
                            <Link
                                to='/field-agent/add-property'
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-1 h-8 w-fit" >
                                Add Property
                            </Link>
                            <Link
                                to='/field-agent/add-property-dealer'
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-1 h-8 w-fit" >
                                Add Property Dealer
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row  gap-5 w-full place-items-center sm:place-content-center mt-10">
                            <div className="flex flex-row border border-gray-400 gap-2 p-1  rounded h-fit">
                                <p className="text-5xl text-green-600">{numberOfPropertyDealersAdded}</p>
                                <p className="w-40">property dealers have been added by you</p>
                            </div>

                            <div className="flex flex-col border border-gray-400 gap-5 p-1  rounded h-fit">
                                <div className="flex flex-row gap-3">
                                    <p className="text-5xl text-gray-500">{numberOfPropertiesAdded}</p>
                                    <p className="w-40">properties have been added by you</p>
                                </div>
                                <div className="flex flex-row gap-3">
                                    <p className="text-5xl text-green-600">{numberOfPropertiesApprovedByCityManager}</p>
                                    <p className="w-40">properties added by you have been approved by city manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

        </Fragment>
    )
}
export default HomeFieldAgent