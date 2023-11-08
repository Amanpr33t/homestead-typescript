import { Link } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"


//This component is the navigation bar
function HomeFieldAgent() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-field-agent-authToken")
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: ''
    })
    const [routeTo, setRouteTo] = useState('')
    const [numberOfPropertiesAdded, setNumberOfPropertiesAdded] = useState(0)
    const [numberOfPropertyDealersAdded, setNumberOfPropertyDealersAdded] = useState(0)
    const [requestsDropdown, setRequestsDropdown] = useState(false)

    const fetchPropertiesAndPropertyDealersAddedByFieldAgent = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertiesAndPropertyDealersAddedByFieldAgent`, {
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
                setRouteTo('')
                setNumberOfPropertyDealersAdded(data.propertyDealersAddedByFieldAgent.length)
                setNumberOfPropertiesAdded(data.propertiesAddedByfieldAgent.length)
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-field-agent-authToken")
                setRouteTo('/field-agent/signIn')
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'Session expired. Please login again'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }, [authToken])

    useEffect(() => {
        fetchPropertiesAndPropertyDealersAddedByFieldAgent()
    }, [fetchPropertiesAndPropertyDealersAddedByFieldAgent])

    return (
        <Fragment>
            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: ''
                })
            }} />}


            <div className="relative flex flex-row pt-20 pb-4 pl-2 sm:pl-6 md:pl-8 lg:pl-28 pr-2 sm:pr-6 md:pr-8 lg:pr-28 gap-4 bg-slate-100 min-h-screen">
                <div className="hidden md:flex flex-col w-96 h-fit bg-white gap-2 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-center mb-2">Pending Requests</p>
                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg  hover:bg-sky-100">
                        <p className="text-5xl">0</p>
                        <p className="w-40">Pending visits to add a new property</p>
                    </div>
                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg hover:bg-sky-100">
                        <p className="text-5xl">0</p>
                        <p className="w-40">Pending visits to add a property dealer</p>
                    </div>
                    <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg hover:bg-sky-100">
                        <p className="text-5xl">0</p>
                        <p className="w-40">Pending requests to reconsider to details of a property</p>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg" onClick={() => setRequestsDropdown(false)}>

                    <div className="md:hidden w-full z-10 p-2">
                        <div className="relative border border-gray-400 w-fit p-1 cursor-pointer" onClick={e => {
                            e.stopPropagation()
                            setRequestsDropdown(requestsDropdown => !requestsDropdown)
                        }
                        }>Pending Requests {requestsDropdown ? "▲" : "▼"}
                            {requestsDropdown && <div className="absolute top-8 -left-0.5 bg-white" onClick={e => e.stopPropagation()}>
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer" onClick={e => e.stopPropagation()}>
                                    <p className="text-5xl">0</p>
                                    <p className="w-40">Pending visits to add a new property</p>
                                </div>
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer " onClick={e => e.stopPropagation()}>
                                    <p className="text-5xl">0</p>
                                    <p className="w-40">Pending visits to add a new property dealer</p>
                                </div>
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer " onClick={e => e.stopPropagation()}>
                                    <p className="text-5xl">0</p>
                                    <p className="w-40">Pending requests to reconsider details of a property</p>
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="flex flex-row mt-6 gap-3 w-full place-content-center">
                        <Link to='' className="bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 pt-1 h-8 w-fit " >Add Property</Link>
                        <Link to='/field-agent/add-property-dealer' className="bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 pt-1 h-8 w-fit" >Add Property Dealer</Link>
                    </div>
                    <div className="flex flex-col sm:flex-row  gap-3 w-full place-items-center sm:place-content-center mt-10">
                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg h-fit hover:bg-sky-100">
                            <p className="text-5xl text-green-800">{numberOfPropertiesAdded}</p>
                            <p className="w-36">properties have been added by you</p>
                        </div>
                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg h-fit hover:bg-sky-100">
                            <p className="text-5xl text-green-800">{numberOfPropertyDealersAdded}</p>
                            <p className="w-40">property dealers have been added by you</p>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    )
}
export default HomeFieldAgent