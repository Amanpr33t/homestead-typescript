import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import Spinner from "../../Spinner"
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../../utils/stringUtilityFunctions"
import { formatDate, getDaysDifference } from "../../../utils/dateFunctions"

interface RequestType {
    dealerId: string,
    propertyType: 'agricultural' | 'residential' | 'commercial'
    location: {
        plotNumber: string,
        village: string,
        city: string,
        tehsil: string,
        district: string,
        state: string
    },
    requestDate: string,
    _id: string
}

const ListOfRequestsToAddProperty: React.FC = () => {
    const navigate = useNavigate()

    const authToken: null | string = localStorage.getItem("homestead-field-agent-authToken") //This variable stores the authToken present in local storage

    const [spinner, setSpinner] = useState(true)//This state is true when the page is initially loaded. It is set to false when data is fetched initially

    const [dealerInfoLoading, setDealerInfoLoading] = useState<boolean>(false)

    const [dealerInfo, setDealerInfo] = useState<{
        firmName: string,
        propertyDealerName: string,
        email: string,
        contactNumber: string
    } | null>(null)

    let index: number = 0 //Used to give serial numbers to propertiess

    const [requestsToAddProperty, setRequestsToAddProperty] = useState<[RequestType] | null>(null) //Information regarding pending property evaluations
    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
            return
        }
    }, [authToken, navigate])

    const [error, setError] = useState<boolean>(false)

    //The function is used to fetch properties pending for evaluation by evaluator
    const requestsToAddNewProperty = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/requestsToAddNewProperty`, {
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
            if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                if (!data.requests.length) {
                    return navigate('/field-agent', { replace: true })
                }
                setError(false)
                setRequestsToAddProperty(data.requests)
                setSpinner(false)
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [authToken, navigate])

    useEffect(() => {
        requestsToAddNewProperty()
    }, [requestsToAddNewProperty])

    const fetchDealerDetails = async (dealerId: string) => {
        try {
            setDealerInfoLoading(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/dealerDetailsForAddProperty?dealerId=${dealerId}`, {
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
            if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setDealerInfoLoading(false)
                setDealerInfo(data.dealerInfo)
            }
        } catch (error) {
            setError(true)
            setDealerInfoLoading(false)
        }
    }

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

            {spinner && !error && <Spinner />}

            {error &&
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <p className="text-red-500 cursor-pointer" onClick={requestsToAddNewProperty}>Try again</p>
                </div>}

            <div className={`w-full z-20 fixed top-16 pt-3 pb-3 pl-3`}>
                <Link to='/field-agent' className="bg-green-500 hover:bg-green-600 text-white font-semibold p-1 rounded" >Home</Link>
            </div>

            {!error && !spinner && requestsToAddProperty &&
                <div className={`${dealerInfo && 'blur'} min-h-screen bg-gray-100 `}>
                    <div className="bg-gray-100 pt-20 pb-5 w-full flex justify-center mt-8 sm:mt-0">
                        <p className="text-xl font-semibold">{requestsToAddProperty.length} requests to add new property</p>
                    </div>
                    <div className='w-full  flex flex-col gap-10 place-items-center pl-2 pr-2 '>
                        {requestsToAddProperty.length > 0 && requestsToAddProperty.map(request => {
                            index++
                            return <div key={Math.random()} className="h-fit flex flex-col gap-4 place-items-center  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white rounded shadow-2xl p-3 sm:p-6">
                                <div className="w-full flex flex-row gap-3 ">
                                    <p className="text-gray-500 ">{index})</p>
                                    <div className="flex flex-col">
                                        <p className="flex flex-col gap-1 font-semibold">{capitaliseFirstAlphabetsOfAllWordsOfASentence(request.propertyType)} property</p>
                                        <div className="flex flex-row gap-3 mt-2">
                                            <p className="font-semibold text-gray-500">Location:</p>
                                            <p>{request.location.plotNumber && `${request.location.plotNumber}, `}{request.location.village && `${request.location.village}, `}{request.location.tehsil && `${request.location.tehsil}, `}{request.location.city && `${request.location.city}, `}{request.location.district}, {request.location.state}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-row gap-2">
                                        <p className="font-medium text-gray-500">Request date:</p>
                                        <p>{formatDate(request.requestDate)}</p>
                                    </div>
                                    <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(request.requestDate))}`}>
                                        Received {getDaysDifference(request.requestDate) > 0 ? `${getDaysDifference(request.requestDate)} days ago` : 'today'}
                                    </p>
                                </div>
                                <div className="w-full flex flex-row place-content-center gap-5">
                                    <Link to={`/field-agent/add-property?requestId=${request._id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pb-1 pr-1 pl-1" >Add property</Link>
                                    <button type='button' className={`text-white font-medium rounded pb-1 pr-1 pl-1 ${dealerInfoLoading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'}`} disabled={dealerInfoLoading} onClick={() => fetchDealerDetails(request.dealerId)}>Dealer info</button>
                                </div>
                            </div>
                        })}
                    </div>
                </div>}

            {!error && !spinner && dealerInfo && <div className="fixed z-50 top-16 pt-12 bg-transparent h-screen w-full flex justify-center " onClick={() => setDealerInfo(null)}>
                <div className="relative w-11/12 sm:w-96 h-fit rounded shadow bg-white" onClick={e => e.stopPropagation()}>
                    <button type="button" className="absolute top-0.5 right-0.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={() => setDealerInfo(null)}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6">
                        {dealerInfo.firmName && <div className="flex flex-row gap-2 mb-1">
                            <p className="font-semibold">Firm name:</p>
                            <p>{dealerInfo.firmName}</p>
                        </div>}
                        {dealerInfo.firmName && <div className="flex flex-row gap-2 mb-1">
                            <p className="font-semibold">Dealer name:</p>
                            <p>{dealerInfo.propertyDealerName}</p>
                        </div>}
                        <div className="flex flex-row gap-2 mb-1">
                            <p className="font-semibold">Email:</p>
                            <p>{dealerInfo.email}</p>
                        </div>
                        <div className="flex flex-row gap-2 mb-1">
                            <p className="font-semibold">Contact number:</p>
                            <p>{dealerInfo.contactNumber}</p>
                        </div>
                        <div className="flex justify-center">
                            <button data-modal-hide="popup-modal" type="button" className="mt-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => setDealerInfo(null)}>Ok</button>
                        </div>
                    </div>
                </div>
            </div>}

        </Fragment >
    )
}
export default ListOfRequestsToAddProperty