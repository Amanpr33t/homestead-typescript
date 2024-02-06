
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

        </Fragment>
    )
}
export default CityManagerHomePage