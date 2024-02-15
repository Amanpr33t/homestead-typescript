import { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ApprovalForm from "./ApprovalForm";
import Spinner from "../Spinner"
import CommercialPropertyTable from "../table/CommercialPropertyTable";
import EvaluationDataTable from "./EvaluationDataTable";
import { PropertyDataType } from "../../dataTypes/commercialPropertyTypes";
import useFetchPropertyData from "../../custom-hooks/useFetchPropertyData";

interface PropsType {
    propertyId: string
}

//This component is used to show property data. It also passes property data as props to PropertyEvaluationForm component 
const ReviewCommercialProperty: React.FC<PropsType> = ({ propertyId }) => {
    const navigate = useNavigate()
    const { fetchPropertyData } = useFetchPropertyData()

    const [showPropertyData, setShowPropertyData] = useState<boolean>(true)

    const [showApprovalForm, setShowApprovalForm] = useState(false) //If set to true, PropertyEvaluationForm component will be shown to the user

    const [property, setProperty] = useState<PropertyDataType | null>(null)

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, [])

    //The function is used to fetch the selected property
    const fetchSelectedProperty = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const responseData = await fetchPropertyData('commercial', propertyId)
            if (responseData.status === 'ok') {
                setSpinner(false)
                setProperty(responseData.property as PropertyDataType)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [ propertyId, fetchPropertyData])

    useEffect(() => {
        fetchSelectedProperty()
    }, [fetchSelectedProperty])

    return (
        <Fragment>

            {spinner && !error && <Spinner />}

            {error && !spinner &&
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <button className="text-red-500" onClick={fetchSelectedProperty}>Try again</button>
                </div>}

            <div className={`${showApprovalForm ? 'bg-gray-300 backdrop-filter blur' : ''} w-fit fixed top-16 bg-white sm:bg-transparent pb-2 z-30`}>
                <button type='button' className="bg-green-500 hover:bg-green-600  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/city-manager/commercial-properties-pending-for-approval')
                    return
                }}>Back</button>
                <button type='button' className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/city-manager', { replace: true })
                    return
                }}>Home</button>
            </div>

            {property && !spinner && !error &&
                <div className={`pt-28 sm:pt-20 ${showApprovalForm ? 'bg-gray-300 backdrop-filter blur' : ''}`}>

                    {/*heading */}
                    <div className="w-full z-20 mb-3">
                        <p className="text-2xl font-semibold text-center">Commercial property details</p>
                    </div>

                    {/*toggle buttons */}
                    <div className="w-full flex justify-center mb-3">
                        <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                            <button className={`-mr-2 pl-5 pr-5 pt-1 pb-1 ${showPropertyData ? 'bg-blue-400 text-white' : 'text-gray-600'}   text-lg font-medium rounded-3xl`} onClick={() => setShowPropertyData(true)}>Property data</button>
                            <button className={`-ml-2 pl-5 pr-5  pt-1 pb-1  ${!showPropertyData ? 'bg-blue-400 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => setShowPropertyData(false)}>Evaluation data</button>
                        </div>
                    </div>

                    {showPropertyData &&
                        <div className='pl-1 pr-1 mb-7 w-full flex flex-col place-items-center' >
                            <CommercialPropertyTable propertyData={property} />
                        </div>}

                    {!showPropertyData && property.evaluationData &&
                        //table shows evaluation data
                        <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                            <EvaluationDataTable
                                areDetailsComplete={property.evaluationData?.areDetailsComplete}
                                incompletePropertyDetails={property.evaluationData?.incompletePropertyDetails}
                                typeOfLocation={property.evaluationData?.typeOfLocation}
                                locationStatus={property.evaluationData?.locationStatus}
                                fairValueOfProperty={property.evaluationData?.fairValueOfProperty}
                                fiveYearProjectionOfPrices={property.evaluationData?.fiveYearProjectionOfPrices}
                                conditionOfConstruction={property.evaluationData?.conditionOfConstruction}
                                qualityOfConstructionRating={property.evaluationData?.qualityOfConstructionRating}
                                evaluatedAt={property.evaluationData?.evaluatedAt}
                            />
                        </div>}

                    <div className="w-full  pb-6 flex justify-center ">
                        <button type="button" className="w-fit bg-blue-500 text-white font-medium rounded pl-2 pr-2 h-8" onClick={() => setShowApprovalForm(true)}>Fill approval form</button>
                    </div>
                </div>}

            {showApprovalForm && property && !error && !spinner &&
                <ApprovalForm
                    showApprovalForm={showApprovalForm}
                    hideApprovalForm={() => setShowApprovalForm(false)}
                    propertyType='commercial'
                    propertyId={propertyId} />
            }

        </Fragment >
    )
}
export default ReviewCommercialProperty