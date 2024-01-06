import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import Spinner from "../Spinner"
import AlertModal from "../AlertModal"
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../utils/stringUtilityFunctions"

//This component shows list of proerties pending for evaluation by field agent
function ListOfPropertiesToBeEvaluated() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-property-evaluator-authToken") //This variable stores the authToken present in local storage

    const [pendingPropertyEvaluations, setPendingPropertyEvaluations] = useState() //Information regarding pending property evaluations

    useEffect(() => {
        if (!authToken) {
            navigate('/property-evaluator/signIn', { replace: true } )
        }
    }, [authToken, navigate])

    let index = 0

    const [spinner, setSpinner] = useState(true)
    const [error, setError] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    //The function is used to fetch properties pending for evaluation by evaluator
    const fetchPendingPropertyEvaluations = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/propertiesPendingToBeEvaluated`, {
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
                localStorage.removeItem("homestead-property-evaluator-authToken")
                navigate('/property-evaluator/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                if (!data.pendingPropertyEvaluations.length) {
                    return navigate('/property-evaluator', { replace: true })
                }
                setPendingPropertyEvaluations(data.pendingPropertyEvaluations)
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate])

    useEffect(() => {
        fetchPendingPropertyEvaluations()
    }, [fetchPendingPropertyEvaluations])

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
                <p className="text-red-500 cursor-pointer" onClick={fetchPendingPropertyEvaluations}>Try again</p>
            </div>}

            {pendingPropertyEvaluations && !spinner && <>
                <div className={`w-full z-20 fixed top-16 pt-3 pb-3 pl-3 ${error ? 'bg-white' : 'bg-gray-100'} ${alert.isAlertModal ? 'blur' : ''}`}>
                    <Link to='/property-evaluator' className="bg-green-500 text-white font-semibold p-1 rounded" >Home</Link>
                    {!error && <div className="w-full flex justify-center mt-3">
                        <p className="text-xl font-bold">{pendingPropertyEvaluations.length} property evaluations are pending</p>
                    </div>}
                </div>

                {!error && <div className='pt-40 pb-10 w-full min-h-screen flex flex-col gap-10 place-items-center bg-gray-100 pl-2 pr-2 '>

                    {pendingPropertyEvaluations.length > 0 && pendingPropertyEvaluations.map(property => {
                        index++
                        return <div key={property._id
                        } className="h-fit flex flex-col gap-4  place-items-center  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white rounded shadow-2xl p-3 sm:p-6">
                            <div className="w-full flex flex-row gap-3 ">
                                <p className="text-gray-500 text-lg font-semibold">{index})</p>
                                <div className="flex flex-col gap-1">
                                    <p className=" text-lg font-semibold">{capitaliseFirstAlphabetsOfAllWordsOfASentence(property.propertyType)} property</p>
                                    <div className="flex flex-row gap-2">
                                        <p className="text-lg font-semibold">Location:</p>
                                        <p className="text-lg">{capitaliseFirstAlphabetsOfAllWordsOfASentence(property.location.name.district)}, {capitaliseFirstAlphabetsOfAllWordsOfASentence(property.location.name.state)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-4">
                                <p className="font-medium text-gray-500">Request date:</p>
                                <p>{dateCreater(property.evaluationRequestDate
                                )}</p>
                            </div>
                            <div className="w-full flex justify-center ">
                                <Link to={`/property-evaluator/evaluate-property?propertyType=${property.propertyType}&propertyId=${property._id}`} className="bg-blue-500 text-white font-medium rounded pb-1 pr-1 pl-1" >Open details</Link>
                            </div>
                        </div>
                    })}
                </div>}
            </>}
        </Fragment>
    )
}
export default ListOfPropertiesToBeEvaluated