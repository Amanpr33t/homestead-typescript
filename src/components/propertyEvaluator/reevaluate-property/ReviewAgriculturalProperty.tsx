import React, { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../../Spinner"
import PropertyReevaluationForm from "./PropertyReevaluationForm"
import ReevaluationDetailsModal from "./ReevaluationDetailsModal"
import AgriculturalPropertyTable from "../../table/AgriculturalPropertyTable"
import { PropertyDataType } from "../../../dataTypes/agriculturalPropertyTypes"
import useFetchPropertyData from "../../../custom-hooks/useFetchPropertyData"
import { EvaluationDataType } from "../../../dataTypes/evaluationDataType"

interface PropsType {
    propertyId: string
}

//This component is used to show property data. It also passes property data as props to PropertyReevaluationForm component 
const ReviewAgriculturalProperty: React.FC<PropsType> = ({ propertyId }) => {
    const navigate = useNavigate()
    const { fetchPropertyData } = useFetchPropertyData()

    const [showReevaluationForm, setShowReevaluationForm] = useState<boolean>(false) //If set to true, PropertyReevaluationForm component will be shown to the user

    const [showReevaluationDetails, setShowReevaluationDetails] = useState<boolean>(true) //If set to true, PropertyReevaluationForm component will be shown to the user

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
            const responseData = await fetchPropertyData('agricultural', propertyId)
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

            <div className={`${showReevaluationForm && 'inset-0 bg-gray-300 opacity-50 blur'} ${showReevaluationDetails && 'blur'} w-fit h-fit fixed top-16 pb-2 z-30`}>
                <button type='button' className="bg-green-500 hover:bg-green-600  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/property-evaluator/agricultural-properties-to-be-reevaluated')
                    return
                }}>Back</button>
                <button type='button' className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/property-evaluator', { replace: true })
                    return
                }}>Home</button>
            </div>

            {property && showReevaluationForm &&
                <PropertyReevaluationForm
                    showReevaluationForm={showReevaluationForm}
                    hideReevaluationForm={() => setShowReevaluationForm(false)}
                    propertyType='agricultural'
                    propertyId={propertyId}
                    oldEvaluationData={property.evaluationData as EvaluationDataType} />
            }

            {showReevaluationDetails && property && property.sentToEvaluatorByCityManagerForReevaluation && property.sentToEvaluatorByCityManagerForReevaluation.details &&
                <ReevaluationDetailsModal
                    reevaluationDetails={property?.sentToEvaluatorByCityManagerForReevaluation.details}
                    detailsModalRemover={() => setShowReevaluationDetails(false)}
                />}

            {property && !spinner && !error &&
                <div className={`${showReevaluationForm && 'inset-0 bg-gray-300 opacity-50 blur'} ${showReevaluationDetails && 'blur'}`}>

                    <div className="w-full pt-28 sm:pt-20 z-20 mb-3">
                        <p className="text-2xl font-semibold text-center">Agricultural property details</p>
                    </div>

                    <div className="px-2 w-full flex flex-row place-content-center gap-2 mb-3">
                        <button
                            type='button'
                            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded pl-2 pr-2 "
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowReevaluationDetails(true)
                                setShowReevaluationForm(false)
                            }}>
                            Show reevaluation details
                        </button>
                        <button
                            type='button'
                            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded px-2 py-1 "
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowReevaluationDetails(false)
                                setShowReevaluationForm(true)
                            }}>
                            Edit evaluation details
                        </button>
                    </div>

                    <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                        <AgriculturalPropertyTable propertyData={property} />
                    </div>
                </div>}

        </Fragment >
    )
}
export default ReviewAgriculturalProperty