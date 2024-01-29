
import React, { Fragment, useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null
    routeTo: string | null
}

//This component is the home page for property evaluation
const PropertyEvaluatorHomePage: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-property-evaluator-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-evaluator/signIn', { replace: true })
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

    const [propertiesSuccessfullyEvaluated, setPropertiesSuccessfullyEvaluated] = useState<number>(0) //number of properties successfully evaluated by the proeprty evaluator
    const [propertiesSentToFieldAgentForReconsideration, setPropertiesSentToFieldAgentForReconsideration] = useState<number>(0) //Properties sent to the field agent for reconsideration of the field agent
    const [pendingPropertyEvaluations, setPendingPropertyEvaluations] = useState<number>(0)//Number of pending proeprty evaluations

    //The function is used to fetch data regarding properties evaluated by the property evaluator
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
                console.log(data)
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

            {alert.isAlertModal &&
                <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                    setAlert({
                        isAlertModal: false,
                        alertType: null,
                        alertMessage: null,
                        routeTo: null
                    })
                }} />}

            {error && !spinner &&
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <button className="text-red-500" onClick={fetchPropertyData}>Try again</button>
                </div>}

            {!spinner && !alert.isAlertModal && !error &&
                <div className={`pt-20 pb-4 pl-2 sm:pl-6 md:pl-8 lg:pl-28 pr-2 sm:pr-6 md:pr-8 lg:pr-28 gap-4 bg-slate-100 h-screen ${alert.isAlertModal ? 'blur' : ''}`}>

                    <div className={`flex flex-col gap-10 w-full bg-white rounded pt-6 pb-6 h-full`} >

                        <div className="flex justify-center">
                            <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit w-fit  hover:bg-sky-100" onClick={() => pendingPropertyEvaluations > 0 ? navigate('/property-evaluator/properties-pending-for-evaluation', { replace: true }) : null}>
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