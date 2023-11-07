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

            <div className="fixed top-16 w-full flex flex-row gap-2 pt-2 pl-1">
                <div className="flex flex-row border-2 border-gray-300 gap-2 p-1 cursor-pointer bg-gray-200 rounded-lg">
                    <p className="text-5xl">{numberOfPropertiesAdded}</p>
                    <p className="w-36">properties have been added by you</p>
                </div>
                <div className="flex flex-row border-2 border-gray-300 gap-2 p-1 cursor-pointer bg-gray-200 rounded-lg">
                    <p className="text-5xl">{numberOfPropertyDealersAdded}</p>
                    <p className="w-40">property dealers have been added by you</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row pt-40 gap-3 w-full place-items-center md:place-content-center">

                {/*<Link to='/' className="bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 pt-1 h-8 w-fit " onClick={() => navigate('/add-property-dealer')}>Add Property</Link>*/}
                <Link to='/field-agent/add-property-dealer' className="bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 pt-1 h-8 w-fit" >Add Property Dealer</Link>
            </div>
        </Fragment>
    )
}
export default HomeFieldAgent