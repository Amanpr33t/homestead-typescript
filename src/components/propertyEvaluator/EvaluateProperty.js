import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import Spinner from "../Spinner"
import AlertModal from "../AlertModal"
import { useParams } from 'react-router-dom';
import { capitaliseFirstAlphabetsOfAllWordsOfASentence, capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions"
import ReviewCommercialProperty from "../propertyEvaluator/ReviewCommercialProperty"
import ReviewAgriculturalProperty from "../propertyEvaluator/ReviewAgriculturalProperty"
import ReviewResidentialProperty from "../propertyEvaluator/ReviewResidentialProperty"
import PropertyEvaluationForm from "./PropertyEvaluationForm";
//This component is the navigation bar

//This component shows a list of property dealers added by the field agent
function EvaluateProperty() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-property-evaluator-authToken") //This variable stores the authToken present in local storage

    // Get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);

    // Get individual query parameters
    const propertyId = queryParams.get('propertyId');
    const propertyType = queryParams.get('propertyType');

    const [selectedProperty, setSelectedProperty] = useState()

    useEffect(() => {
        if (!authToken) {
            navigate('/property-evaluator/signIn')
        }
    }, [authToken, navigate])

    const [spinner, setSpinner] = useState(true)

    const [error, setError] = useState(false)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    const [residentialPropertyType, setResidentialPropertyType] = useState(null)
    const residentialPropertyTypeSetter = (type) => {
        setResidentialPropertyType(type)
    }

    const fetchSelectedProperty = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/fetch-selected-property?propertyType=${propertyType}&propertyId=${propertyId}`, {
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
                setSelectedProperty(data.property)
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate])

    useEffect(() => {
        fetchSelectedProperty()
    }, [fetchSelectedProperty])

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
                <p className="text-red-500 cursor-pointer" onClick={fetchSelectedProperty}>Try again</p>
            </div>}

            {selectedProperty && propertyType === 'residential' && !spinner && !error && <ReviewResidentialProperty
                property={selectedProperty}
                hideReviewPage={() => navigate('/property-evaluator/list-of-pending-evaluations', { replace: true })}
                residentialPropertyTypeSetter={residentialPropertyTypeSetter} />}

            {selectedProperty && propertyType === 'commercial' && !spinner && !error && <ReviewCommercialProperty
                property={selectedProperty}
                hideReviewPage={() => navigate('/property-evaluator/list-of-pending-evaluations', { replace: true })}
            />}

            {selectedProperty && propertyType === 'agricultural' && !spinner && !error && <ReviewAgriculturalProperty
                property={selectedProperty}
                hideReviewPage={() => navigate('/property-evaluator/list-of-pending-evaluations', { replace: true })} />}

        </Fragment>
    )
}
export default EvaluateProperty