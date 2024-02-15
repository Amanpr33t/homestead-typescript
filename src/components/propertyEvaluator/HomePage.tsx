
import React, { Fragment, useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import { AlertType } from "../../dataTypes/alertType"

//This component is the home page for property evaluation
const PropertyEvaluatorHomePage: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-property-evaluator-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-evaluator/signIn', { replace: true })
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

    const [propertiesApprovedByCityManager, setPropertiesApprovedByCityManager] = useState<number>(0)
    const [propertiesSentToCityManagerForApproval, setPropertiesSentToCityManagerForApproval] = useState<number>(0) //number of properties successfully evaluated by the proeprty evaluator
    const [pendingPropertyEvaluations, setPendingPropertyEvaluations] = useState<number>(0)//Number of pending proeprty evaluations
    const [pendingPropertiesReceivedForReevaluation, setPendingPropertiesReceivedForReevaluation] = useState<number>(0)

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
                setSpinner(false)
                setPropertiesApprovedByCityManager(propertiesApprovedByCityManager)
                setPropertiesSentToCityManagerForApproval(data.propertiesSentToCityManagerForApproval)
                setPendingPropertyEvaluations(data.pendingPropertyEvaluations)
                setPendingPropertiesReceivedForReevaluation(data.pendingPropertiesReceivedForReevaluation)
                return
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-evaluator-authToken")
                navigate('/property-evaluator/signIn', { replace: true })
                return
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [authToken, navigate, propertiesApprovedByCityManager])

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

                        <div className="flex flex-col md:flex-row md:place-content-center place-items-center gap-3 md:gap-5 ">
                            <div className="flex justify-center px-2">
                                <div className="flex flex-row bg-slate-200 border border-gray-400 gap-2 px-2 py-1 cursor-pointer rounded h-fit w-fit  hover:bg-slate-100" onClick={() => {
                                    if (pendingPropertyEvaluations) {
                                        navigate('/property-evaluator/properties-pending-for-evaluation', { replace: true })
                                        return
                                    }
                                }}>
                                    <p className="text-5xl text-orange-600">{pendingPropertyEvaluations}</p>
                                    <p className="sm:w-60">property evaluation requests are pending</p>
                                </div>
                            </div>

                            <div className="flex justify-center px-2">
                                <div className="flex flex-row bg-slate-200 border border-gray-400 gap-2 px-2 py-1 cursor-pointer rounded h-fit w-fit  hover:bg-slate-100" onClick={() => {
                                    if (pendingPropertiesReceivedForReevaluation) {
                                        navigate('/property-evaluator/properties-pending-for-reevaluation', { replace: true })
                                        return
                                    }
                                }}>
                                    <p className="text-5xl text-orange-600">{pendingPropertiesReceivedForReevaluation}</p>
                                    <p className="sm:w-60">properties have been received for reevaluation</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row  gap-10 w-full place-items-center sm:place-content-center px-2">
                            <div className="flex flex-col border border-gray-400 gap-5 p-2 rounded">
                                <div className="flex flex-row gap-2" >
                                    <p className="text-5xl text-gray-600">{propertiesSentToCityManagerForApproval}</p>
                                    <p className="sm:w-60">properties have been sent to city manager for approval</p>
                                </div>

                                <div className="flex flex-row gap-2" >
                                    <p className="text-5xl text-green-600">{propertiesApprovedByCityManager}</p>
                                    <p className="sm:w-60">properties have been approved by city manager</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>}

        </Fragment>
    )
}
export default PropertyEvaluatorHomePage