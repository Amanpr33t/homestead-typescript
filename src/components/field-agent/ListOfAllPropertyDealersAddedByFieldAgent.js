import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import ReviewPropertyDealer from "./ReviewPropertyDealer"
import Spinner from "../Spinner"
import AlertModal from "../AlertModal"
//This component is the navigation bar

//This component shows a list of property dealers added by the field agent
function ListOfAllPropertyDealersAddedByFieldAgent() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-field-agent-authToken") //This variable stores the authToken present in local storage

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn')
        }
    }, [authToken, navigate])

    const [propertyDealers, setPropertyDealers] = useState([]) //array contains all the proeprty dealers added by the field agent

    const [selectedPropertyDealer, setSelectedPropertyDealer] = useState(null) //it stores the selected property dealer
    let index = 0

    const [spinner, setSpinner] = useState(true)

    const [error, setError] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    //The function is used to fetch property dealers
    const fetchPropertyDealers = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealersAddedByFieldAgent`, {
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
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                if (!data.propertyDealers.length) {
                    return navigate('/field-agent', { replace: true })
                }
                setPropertyDealers(data.propertyDealers)
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate])

    useEffect(() => {
        fetchPropertyDealers()
    }, [fetchPropertyDealers])

    const dateCreater = (date) => {
        const dateFormat = new Date(date)
        return `${dateFormat.getDate()}-${dateFormat.getMonth() + 1}-${dateFormat.getFullYear()}`;
    }

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {alert.isAlertModal && !error && !spinner && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}

            {error && !spinner && <div className="fixed top-36 w-full flex flex-col place-items-center">
                <p>Some error occured</p>
                <p className="text-red-500 cursor-pointer" onClick={fetchPropertyDealers}>Try again</p>
            </div>}

            {/*The component ReviewPropertyDealer is used to show the selected property dealer in a table*/}
            {selectedPropertyDealer && !spinner && !error && <ReviewPropertyDealer dealer={selectedPropertyDealer} hideReviewPage={() => setSelectedPropertyDealer(null)} />}

            {!selectedPropertyDealer && !spinner && <>
                <div className={`w-full z-20 fixed top-16 pt-3 pb-3 pl-3 ${error ? 'bg-white' : 'bg-gray-100'} ${alert.isAlertModal ? 'blur' : ''}`}>
                    <Link to='/field-agent' className="bg-green-500 text-white font-semibold p-1 rounded" >Home</Link>
                    {!error && <div className="w-full flex justify-center mt-3">
                        <p className="text-xl font-bold">{propertyDealers.length} dealers have been added by you</p>
                    </div>}
                </div>

                {!error && <div className='pt-40 pb-10 w-full min-h-screen flex flex-col gap-10 place-items-center bg-gray-100 pl-2 pr-2 '>

                    {propertyDealers.length > 0 && propertyDealers.map(dealer => {
                        index++
                        return <div key={dealer._id} className="h-fit flex flex-col gap-4  place-items-center  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white rounded shadow-2xl p-3 sm:p-6">
                            <div className="w-full flex flex-row  place-content-between">
                                <div className="flex flex-row gap-2">
                                    <p className="text-gray-500 text-lg font-semibold">{index})</p>
                                    <p className="flex justify-center text-lg font-semibold">{dealer.firmName}</p>
                                </div>
                                {dealer.firmLogoUrl && <img className='h-16 w-auto' src={dealer.firmLogoUrl
                                } alt="logo" />}
                            </div>
                            <div className="flex flex-row gap-4">
                                <p className="font-medium text-gray-500">Added on:</p>
                                <p>{dateCreater(dealer.createdAt)}</p>
                            </div>
                            <div className="w-full flex justify-center ">
                                <button type="button" className="bg-blue-500 text-white font-medium rounded pb-1 pr-1 pl-1" onClick={() => setSelectedPropertyDealer(dealer)}>Open details</button>
                            </div>
                        </div>
                    })}
                </div>}
            </>}

        </Fragment>
    )
}
export default ListOfAllPropertyDealersAddedByFieldAgent