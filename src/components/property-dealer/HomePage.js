
import { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"
import { MdFrontHand } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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

            <div className="pt-20">
                <div className="mt-8 flex flex-col gap-2 place-items-center ">
                    <div className="flex flex-row place-content-center gap-3">
                        <p className="text-3xl text-gray-700 font-bold">Hi!</p>
                        <MdFrontHand className="text-3xl text-yellow-300 font-bold" />
                    </div>
                    <div className="text-2xl text-gray-500 text-center">Let's help you expand your business</div>
                </div>
                <div className="flex flex-col gap-4 place-items-center mt-12">
                    <button className="bg-green-400 text-white text-xl font-semibold p-5 rounded">Add Property</button>
                    <button className="bg-blue-400 text-white p-5 text-xl font-semibold rounded" onClick={() => navigate('/property-dealer/properties-added')}>Properties previously added</button>
                </div>


            </div>

        </Fragment>
    )
}
export default PropertyDealerHomePage