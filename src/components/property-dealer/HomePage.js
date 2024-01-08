
import { Fragment, useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"

//This component is the home page for property dealer
function PropertyDealerHomePage() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-property-dealer-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })
    const [spinner, setSpinner] = useState(false)
    const [error, setError] = useState(false)



    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    routeTo={alert.routeTo}
                    alertModalRemover={() => {
                        setAlert({
                            isAlertModal: false,
                            alertType: '',
                            alertMessage: '',
                            routeTo: null
                        })
                    }} />}

               <div className="mt-28">hello</div>     

        </Fragment>
    )
}
export default PropertyDealerHomePage