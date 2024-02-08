
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
const CityManagerHomePage: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-city-manager-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/city-manager/signIn', { replace: true })
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

    const [numberOfPropertiesPendingForApproval, setPropertiesPendingForApproval] = useState<{
        agricultural: number,
        residential: number,
        commercial: number
    }>({
        agricultural: 0,
        residential: 0,
        commercial: 0
    })

    const fetchPropertiesToBeAppropved = useCallback(async () => {
        try {
            setSpinner(true)
            setError(false)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/city-manager/numberOfPropertiesPendingForApproval`, {
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
                setPropertiesPendingForApproval(data.numberOfPropertiesPendingForApproval)
                return
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-city-manager-authToken")
                navigate('/city-manager/signIn', { replace: true })
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [authToken, navigate])

    useEffect(() => {
        if (authToken) {
            fetchPropertiesToBeAppropved()
        }
    }, [fetchPropertiesToBeAppropved, authToken])


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

            {error && !spinner && <div className="fixed top-36 w-full flex flex-col place-items-center">
                <p>Some error occured</p>
                <p className="text-red-500 cursor-pointer" onClick={fetchPropertiesToBeAppropved}>Try again</p>
            </div>}

            {!error && !spinner &&
                <div className=" w-full flex flex-col gap-10 place-items-center pt-16">
                    <div className="pt-16 flex justify-center w-full">
                        <p className="text-xl font-semibold">Properties pending for approval</p>
                    </div>

                    <div className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 justify-center flex flex-wrap gap-10 ">

                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfPropertiesPendingForApproval.agricultural && navigate('/city-manager/agricultural-properties-pending-for-approval')}>
                            <p className="text-5xl text-green-800">{numberOfPropertiesPendingForApproval.agricultural}</p>
                            <p className="w-36 text-center" >Agricultural properties</p>
                        </div>

                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfPropertiesPendingForApproval.commercial && navigate('/city-manager/commercial-properties-pending-for-approval')}>
                            <p className="text-5xl text-green-800">{numberOfPropertiesPendingForApproval.commercial}</p>
                            <p className="w-36 text-center" >Commercial properties</p>
                        </div>

                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded h-fit hover:bg-sky-100" onClick={() => numberOfPropertiesPendingForApproval.residential && navigate('/city-manager/residential-properties-pending-for-approval')}>
                            <p className="text-5xl text-green-800">{numberOfPropertiesPendingForApproval.residential}</p>
                            <p className="w-36 text-center" >Residential properties</p>
                        </div>

                    </div>
                </div>}

        </Fragment>
    )
}
export default CityManagerHomePage