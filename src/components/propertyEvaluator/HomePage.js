
import { Fragment, useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"

function PropertyEvaluatorHomePage() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-property-evaluator-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-evaluator/signIn')
        }
    }, [authToken, navigate])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    const [spinner, setSpinner] = useState(true)
    const [error, setError] = useState(false)


    const [propertiesSuccessfullyEvaluated, setPropertiesSuccessfullyEvaluated] = useState(0)
    const [propertiesSentToFieldAgentForReconsideration, setPropertiesSentToFieldAgentForReconsideration] = useState(0)
    const [pendingPropertyEvaluations, setPendingPropertyEvaluations] = useState(0)


    const fetchPropertyData = useCallback(async () => {
        try {
            setSpinner(true)
            setError(false)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/propertyEvaluationData`, {
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
                setPropertiesSuccessfullyEvaluated(data.propertiesSuccessfullyEvaluated)
                setPropertiesSentToFieldAgentForReconsideration(data.propertiesSentToFieldAgentForReconsideration)
                setPendingPropertyEvaluations(data.pendingPropertyEvaluations)
                return
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-evaluator-authToken")
                navigate('/property-evaluator/signIn', { replace: true })
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [authToken, navigate])

    useEffect(() => {
        if (authToken) {
            fetchPropertyData()
        }
    }, [fetchPropertyData, authToken])


    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}

            {error && !spinner && <div className="fixed top-36 w-full flex flex-col place-items-center">
                <p>Some error occured</p>
                <p className="text-red-500 cursor-pointer" onClick={fetchPropertyData}>Try again</p>
            </div>}

            {!spinner && !alert.isAlertModal && !error &&
                <div className={`pt-20 pb-4 pl-2 sm:pl-6 md:pl-8 lg:pl-28 pr-2 sm:pr-6 md:pr-8 lg:pr-28 gap-4 bg-slate-100 h-screen ${alert.isAlertModal ? 'blur' : ''}`}>

                    <div className={`flex flex-col gap-10 w-full bg-white rounded pt-6 pb-6 h-full`} >

                        <div className="flex justify-center">
                            <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit w-fit  hover:bg-sky-100" onClick={() => pendingPropertyEvaluations > 0 ? navigate('/property-evaluator/list-of-pending-evaluations') : null}>
                                <p className="text-5xl text-green-800">{pendingPropertyEvaluations}</p>
                                <p className="w-40">property evaluation requests are pending</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row  gap-10 w-full place-items-center sm:place-content-center">
                            <div className="flex flex-row border border-gray-400 gap-2 p-1 rounded h-fit " >
                                <p className="text-5xl text-green-800">{propertiesSuccessfullyEvaluated}</p>
                                <p className="w-36">properties have been successfully evaluated by you</p>
                            </div>

                            <div className="flex flex-row border border-gray-400 gap-2 p-1  rounded h-fit " >
                                <p className="text-5xl text-green-800">{propertiesSentToFieldAgentForReconsideration}</p>
                                <p className="w-40">properties have been sent to field agent for reconsideration</p>
                            </div>
                        </div>

                    </div>
                </div>}

        </Fragment>
    )
}
export default PropertyEvaluatorHomePage