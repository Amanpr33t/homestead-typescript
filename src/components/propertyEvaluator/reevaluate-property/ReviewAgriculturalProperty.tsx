import React, { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../../Spinner"
import PropertyReevaluationForm from "./PropertyReevaluationForm"
import ReevaluationDetailsModal from "./ReevaluationDetailsModal"
import AgriculturalPropertyTable from "../../table/AgriculturalPropertyTable"

type RoadType = 'unpaved road' | 'village road' | 'district road' | 'state highway' | 'national highway'
type IrrigationSystemType = 'sprinkler' | 'drip' | 'underground pipeline'
type ReservoirType = 'public' | 'private'
type CropTypeArray = 'rice' | 'wheat' | 'maize' | 'cotton'

interface PropsType {
    propertyId: string
}

interface PropertyType {
    _id: string,
    addedByFieldAgent: string,
    propertyEvaluator: string,
    uniqueId: string,
    propertyImagesUrl: string[],
    contractImagesUrl: string[] | null,
    addedByPropertyDealer: string,
    landSize: {
        size: number,
        unit: 'metre-square' | 'acre',
        details: string | null,
    },
    location: {
        name: {
            village: string | null,
            city: string | null,
            tehsil: string | null,
            district: string,
            state: string
        }
    },
    numberOfOwners: number,
    waterSource: {
        canal: string[] | null,
        river: string[] | null,
        tubewells: {
            numberOfTubewells: number,
            depth: number[] | null
        }
    },
    reservoir: {
        isReservoir: boolean,
        type: ReservoirType[] | null,
        capacityOfPrivateReservoir: number | null,
        unitOfCapacityForPrivateReservoir: 'cusec' | 'litre' | null
    },
    irrigationSystem: IrrigationSystemType[] | null,
    priceDemanded: {
        number: number,
        words: string
    },
    crops: CropTypeArray[],
    road: {
        type: RoadType,
        details: string | null,
    },
    legalRestrictions: {
        isLegalRestrictions: boolean,
        details: string | null,
    },
    nearbyTown: string | null,
    sentToEvaluatorByCityManagerForReevaluation: {
        details: string[]
    },
    evaluationData: {
        typeOfLocation: string | null,
        locationStatus: string | null,
        fairValueOfProperty: number | null,
        fiveYearProjectionOfPrices: {
            increase: boolean | null,
            decrease: boolean | null,
            percentageIncreaseOrDecrease: number | null,
        },
        conditionOfConstruction: string | null,
        qualityOfConstructionRating: number | null,
        evaluatedAt?: Date,
    }
}

//This component is used to show property data. It also passes property data as props to PropertyReevaluationForm component 
const ReviewAgriculturalProperty: React.FC<PropsType> = ({ propertyId }) => {
    const navigate = useNavigate()

    const [showReevaluationForm, setShowReevaluationForm] = useState<boolean>(false) //If set to true, PropertyReevaluationForm component will be shown to the user

    const [showReevaluationDetails, setShowReevaluationDetails] = useState<boolean>(true) //If set to true, PropertyReevaluationForm component will be shown to the user

    const [property, setProperty] = useState<PropertyType | null>(null)

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const authToken: string | null = localStorage.getItem("homestead-property-evaluator-authToken")

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, [])

    //The function is used to fetch the selected property
    const fetchSelectedProperty = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/fetch-selected-property?propertyType=agricultural&propertyId=${propertyId}`, {
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
                return
            } else if (data.status === 'ok') {
                setSpinner(false)
                setProperty(data.property)
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [authToken, navigate, propertyId])

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
                    propertyId={property._id}
                    oldEvaluationData={property.evaluationData} />
            }

            {showReevaluationDetails && property && property.sentToEvaluatorByCityManagerForReevaluation.details &&
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