import React, { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropertyEvaluationForm from "./PropertyEvaluationForm"
import Spinner from "../../Spinner"
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
}

//This component is used to show property data. It also passes property data as props to PropertyEvaluationForm component 
const ReviewAgriculturalProperty: React.FC<PropsType> = ({ propertyId }) => {
    const navigate = useNavigate()

    const [showEvaluationForm, setShowEvaluationForm] = useState(false) //If set to true, PropertyEvaluationForm component will be shown to the user

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

            <div className={`${showEvaluationForm ? 'inset-0 bg-gray-500 opacity-50 blur' : ''} w-full fixed top-16 pb-2 z-30`}>
                <button type='button' className="bg-green-500 hover:bg-green-600  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/property-evaluator/agricultural-properties-to-be-evaluated')
                    return
                }}>Back</button>
                <button type='button' className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/property-evaluator', { replace: true })
                    return
                }}>Home</button>
            </div>

            {property && !spinner && !error &&
                <div className={`${showEvaluationForm ? 'blur' : ''}`}>

                    <div className="w-full pt-28 sm:pt-20 bg-white z-20 pb-4">
                        <p className="text-2xl font-semibold text-center">Agricultural property details</p>
                    </div>

                    <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                        <AgriculturalPropertyTable propertyData={property} />
                    </div>

                    <div className="w-full -mt-4 mb-6 flex justify-center ">
                        <button type="button" className="w-fit bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 h-8" onClick={() => setShowEvaluationForm(true)}>Fill evaluation form</button>
                    </div>
                </div>}

            {property &&
                <PropertyEvaluationForm
                    showEvaluationForm={showEvaluationForm}
                    hideEvaluationForm={() => setShowEvaluationForm(false)}
                    propertyType='agricultural'
                    propertyId={property._id} />
            }
        </Fragment >
    )
}
export default ReviewAgriculturalProperty