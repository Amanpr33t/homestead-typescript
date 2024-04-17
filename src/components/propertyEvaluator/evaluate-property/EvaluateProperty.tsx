import { useNavigate } from "react-router-dom"
import { Fragment, useEffect } from "react"
import ReviewCommercialProperty from "./ReviewCommercialProperty"
import ReviewAgriculturalProperty from "./ReviewAgriculturalProperty"
import ReviewResidentialProperty from "./ReviewResidentialProperty"

//This component is used to fetch the property to be evaluated and property details are passed as props to other components
const EvaluateProperty: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-property-evaluator-authToken") //This variable stores the authToken present in local storage

    // Get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);

    // Get individual query parameters
    const propertyId: string | null = queryParams.get('propertyId');
    const propertyType: string | null = queryParams.get('propertyType');

    useEffect(() => {
        if (!authToken) {
            navigate('/user', { replace: true })
            return
        }
    }, [authToken, navigate])

    useEffect(() => {
        if (!propertyId || !propertyType) {
            navigate('/property-evaluator', { replace: true })
            return
        }
    }, [propertyId, propertyType, navigate])

    return (
        <Fragment>

            {propertyId && propertyType === 'residential' &&
                <ReviewResidentialProperty propertyId={propertyId} />}

            {propertyId && propertyType === 'commercial' &&
                <ReviewCommercialProperty propertyId={propertyId} />}

            {propertyId && propertyType === 'agricultural' &&
                <ReviewAgriculturalProperty propertyId={propertyId} />}

        </Fragment>
    )
}
export default EvaluateProperty