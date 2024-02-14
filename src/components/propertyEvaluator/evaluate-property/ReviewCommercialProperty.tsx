import { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropertyEvaluationForm from "./PropertyEvaluationForm"
import Spinner from "../../Spinner"
import CommercialPropertyTable from "../../table/CommercialPropertyTable"

interface PropsType {
    propertyId: string
}

type BuiltUpType = 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic' | 'other'

interface PropertyType {
    _id: string,
    addedByFieldAgent: string,
    propertyEvaluator: string,
    uniqueId: string,
    propertyImagesUrl: string[],
    contractImagesUrl: string[] | null,
    addedByPropertyDealer: string,
    commercialPropertyType: string,
    landSize: {
        totalArea: {
            metreSquare: number,
            squareFeet: number
        },
        coveredArea: {
            metreSquare: number,
            squareFeet: number
        },
        details: string | null,
    },
    stateOfProperty: {
        empty: boolean,
        builtUp: boolean,
        builtUpPropertyType: BuiltUpType | null
    },
    location: {
        name: {
            plotNumber: number | null,
            village: string | null,
            city: string | null,
            tehsil: string | null,
            district: string,
            state: string
        }
    },
    numberOfOwners: number,
    floors: {
        floorsWithoutBasement: number,
        basementFloors: number
    },
    widthOfRoadFacing: {
        feet: number,
        metre: number
    },
    priceDemanded: {
        number: number,
        words: string
    },
    legalRestrictions: {
        isLegalRestrictions: boolean,
        details: string | null,
    },
    remarks: string | null,
    lockInPeriod?: {
        years: number | null,
        months: number | null
    },
    leasePeriod?: {
        years: number | null,
        months: number | null
    },
    shopPropertyType?: 'booth' | 'shop' | 'showroom' | 'retail-space' | 'other'
}

//This component is used to show property data. It also passes property data as props to PropertyEvaluationForm component 
const ReviewCommercialProperty: React.FC<PropsType> = ({ propertyId }) => {
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/fetch-selected-property?propertyType=commercial&propertyId=${propertyId}`, {
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
                    navigate('/property-evaluator/commercial-properties-to-be-evaluated')
                    return
                }}>Back</button>
                <button type='button' className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => {
                    navigate('/property-evaluator', { replace: true })
                    return
                }}>Home</button>
            </div>

            {property && !spinner && !error &&
                <div className={`${showEvaluationForm ? 'blur' : ''}`}>

                    <div className="w-full sm:pt-20 pt-28 bg-white z-20 mb-4">
                        <p className="text-2xl font-semibold text-center">Commercial property details</p>
                    </div>

                    <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                        <CommercialPropertyTable propertyData={property} />
                    </div>

                    <div className="w-full -mt-4 mb-6 flex justify-center ">
                        <button type="button" className="w-fit bg-blue-500 text-white font-medium rounded pl-2 pr-2 h-8" onClick={() => setShowEvaluationForm(true)}>Fill evaluation form</button>
                    </div>
                </div>}

            {property &&
                <PropertyEvaluationForm
                    showEvaluationForm={showEvaluationForm}
                    hideEvaluationForm={() => setShowEvaluationForm(false)}
                    propertyType='commercial'
                    propertyId={property._id}
                    isBuiltUpProperty={property.stateOfProperty.builtUp}
                />
            }

        </Fragment >
    )
}
export default ReviewCommercialProperty