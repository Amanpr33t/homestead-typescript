import { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../../Spinner"
import PropertyReevaluationForm from "./PropertyReevaluationForm"
import ReevaluationDetailsModal from "./ReevaluationDetailsModal"

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
    shopPropertyType?: 'booth' | 'shop' | 'showroom' | 'retail-space' | 'other',
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
const ReviewCommercialProperty: React.FC<PropsType> = ({ propertyId }) => {
    const navigate = useNavigate()

    const [showReevaluationForm, setShowReevaluationForm] = useState<boolean>(false) //If set to true, PropertyReevaluationForm component will be shown to the user

    const [showReevaluationDetails, setShowReevaluationDetails] = useState<boolean>(true) //If set to true, PropertyReevaluationForm component will be shown to the user

    const [property, setProperty] = useState<PropertyType | null>(null)

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const authToken: string | null = localStorage.getItem("homestead-property-evaluator-authToken")

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

            <div className={`${showReevaluationForm || showReevaluationDetails ? 'blur' : ''} w-full fixed top-16 bg-white pb-2 z-30`}>
                <button type='button' className="bg-green-500 hover:bg-green-600  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/property-evaluator/commercial-properties-to-be-evaluated')}>Back</button>
                <button type='button' className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/property-evaluator', { replace: true })}>Home</button>
            </div>

            {showReevaluationDetails && property && property.sentToEvaluatorByCityManagerForReevaluation.details &&
                <ReevaluationDetailsModal
                    reevaluationDetails={property?.sentToEvaluatorByCityManagerForReevaluation.details}
                    detailsModalRemover={() => setShowReevaluationDetails(false)}
                />}

            {property && showReevaluationForm &&
                <PropertyReevaluationForm
                    showReevaluationForm={showReevaluationForm}
                    hideReevaluationForm={() => setShowReevaluationForm(false)}
                    propertyType='commercial'
                    propertyId={property._id}
                    isBuiltUpProperty={property?.stateOfProperty.builtUp}
                    oldEvaluationData={property.evaluationData}
                />}

            {property && !spinner && !error &&
                <div className={`${showReevaluationForm || showReevaluationDetails ? 'blur' : ''}`}>

                    <div className="w-full mt-28 sm:mt-20 bg-white z-20 mb-3">
                        <p className="text-2xl font-semibold text-center">Commercial property details</p>
                    </div>

                    <div className="px-2 w-full flex flex-row place-content-center gap-2 mb-3">
                        <button
                            type='button'
                            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded pl-2 pr-2 h-8"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowReevaluationDetails(true)
                                setShowReevaluationForm(false)
                            }}>
                            Show reevaluation details
                        </button>
                        <button
                            type='button'
                            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded pl-2 pr-2 h-8"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowReevaluationDetails(false)
                                setShowReevaluationForm(true)
                            }}>
                            Edit reevaluation details
                        </button>
                    </div>

                    <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                        <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                            <thead >
                                <tr className="bg-gray-200 border-2 border-gray-300">
                                    <th className="w-28 text-xl pt-4 pb-4 sm:w-fit">Field</th>
                                    <th className="text-xl ">Data</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property ID</td>
                                    <td className=" pt-4 pb-4 text-center">{property.uniqueId}</td>
                                </tr>

                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                                    <td className=" pt-4 pb-4 text-center">{property.commercialPropertyType === 'industrial' ? 'Industrial/Institutional' : 'Shop/Showroom/Booth'}</td>
                                </tr>

                                {property.commercialPropertyType === 'shop' && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Shop type</td>
                                    <td className=" pt-4 pb-4 text-center">{property.shopPropertyType}</td>
                                </tr>}

                                {property.commercialPropertyType === 'industrial' ? <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                                    <td className=" pt-4 pb-4 text-center">{property.stateOfProperty.empty ? 'Empty' : `${property.stateOfProperty.builtUpPropertyType === 'other' ? 'Built-up' : `Built-up (${property.stateOfProperty.builtUpPropertyType})`}`}</td>
                                </tr> : <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                                    <td className=" pt-4 pb-4 text-center">{property.stateOfProperty.empty ? 'Empty' : 'Built-up'}</td>
                                </tr>}

                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Land Size</td>
                                    <td className="pt-4 pb-4 text-center pr-0.5 pl-0.5">
                                        <div className="flex flex-row place-content-center gap-1 sm:gap-5 mb-4">
                                            <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                                <p className="w-full text-center font-semibold">Total area</p>
                                                <p>{property.landSize.totalArea.metreSquare} metre square</p>
                                                <p>{property.landSize.totalArea.squareFeet} square feet</p>
                                            </div>
                                            <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                                <p className="w-full text-center font-semibold">Covered area</p>
                                                <p>{property.landSize.coveredArea.metreSquare} metre square</p>
                                                <p>{property.landSize.coveredArea.squareFeet} square feet</p>
                                            </div>
                                        </div>

                                        {property.landSize.details && < p > {property.landSize.details}</p>}
                                    </td>
                                </tr>

                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Floors (excluding basement)</td>
                                    <td className=" pt-4 pb-4 text-center">{property.floors.floorsWithoutBasement}</td>
                                </tr>

                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Basement floors</td>
                                    <td className=" pt-4 pb-4 text-center">{property.floors.basementFloors}</td>
                                </tr>

                                {property.commercialPropertyType === 'shop' && property.leasePeriod && (property.leasePeriod.years !== 0 || property.leasePeriod.months !== 0) && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lease period</td>
                                    <td className=" pt-4 pb-4 text-center">
                                        <div className="flex flex-col">
                                            {property.leasePeriod.years !== 0 && <p>{property.leasePeriod.years} years</p>}
                                            {property.leasePeriod.months !== 0 && <p>{property.leasePeriod.months} months</p>}
                                        </div>
                                    </td>
                                </tr>}

                                {property.commercialPropertyType === 'shop' && property.lockInPeriod && (property.lockInPeriod.years !== 0 || property.lockInPeriod.months !== 0) && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lock-in period</td>
                                    <td className=" pt-4 pb-4 text-center">
                                        <div className="flex flex-col">
                                            {property.lockInPeriod.years !== 0 && <p>{property.lockInPeriod.years} years</p>}
                                            {property.lockInPeriod.months !== 0 && <p>{property.lockInPeriod.months} months</p>}
                                        </div>
                                    </td>
                                </tr>}

                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                                    <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                                        {property.location.name.plotNumber && <div className="flex flex-row gap-2">
                                            <p className="font-semibold">Plot number:</p>
                                            <p>{property.location.name.plotNumber}</p>
                                        </div>}
                                        {property.location.name.village && <div className="flex flex-row gap-2">
                                            <p className="font-semibold">Village:</p>
                                            <p>{property.location.name.village}</p>
                                        </div>}
                                        {property.location.name.city && <div className="flex flex-row gap-2">
                                            <p className="font-semibold">City:</p>
                                            <p>{property.location.name.city}</p>
                                        </div>}
                                        {property.location.name.tehsil && <div className="flex flex-row gap-2">
                                            <h2 className="font-semibold">Tehsil:</h2>
                                            <p>{property.location.name.tehsil}</p>
                                        </div>}
                                        <div className=" flex flex-row gap-2">
                                            <p className="font-semibold">District:</p>
                                            <p>{property.location.name.district}</p>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <p className="font-semibold">State:</p>
                                            <p>{property.location.name.state}</p>
                                        </div>
                                    </td>
                                </tr>

                                {property.widthOfRoadFacing.metre && property.widthOfRoadFacing.feet && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Road width</td>
                                    <td className=" pt-4 pb-4 text-center">
                                        <div className="flex flex-col place-items-center">
                                            <p>{property.widthOfRoadFacing.feet}   feet</p>
                                            <p>{property.widthOfRoadFacing.metre}  metre</p>
                                        </div>
                                    </td>
                                </tr>}

                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                                    <td className="pt-4 pb-4 text-center" >{property.numberOfOwners}</td>
                                </tr>

                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <div className="flex flex-row place-content-center gap-1">
                                            <p className="font-semibold">Rs.</p>
                                            <p>{property.priceDemanded.number}</p>
                                        </div>
                                        <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.priceDemanded.words}</p>
                                    </td>
                                </tr>

                                <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        {!property.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                        {property.legalRestrictions.isLegalRestrictions && <>
                                            <p>Yes</p>
                                            <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.legalRestrictions.details}</p>
                                        </>}
                                    </td>
                                </tr>

                                {property.remarks && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Remarks</td>
                                    <td className=" pt-4 pb-4 text-center">{property.remarks}</td>
                                </tr>}
                                <tr className="border-2 border-gray-200">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Land Images</td>
                                    <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                        {property.propertyImagesUrl.map(image => {
                                            return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={() => window.open(image, '_blank')} />;
                                        })}
                                    </td>
                                </tr>
                                {property.contractImagesUrl && property.contractImagesUrl.length > 0 && <tr className="border-2 border-gray-200">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract Images</td>
                                    <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                        {property.contractImagesUrl.map(image => {
                                            return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={() => window.open(image, '_blank')} />
                                        })}
                                    </td>
                                </tr>}
                            </tbody>
                        </table>
                    </div>
                </div>}

        </Fragment >
    )
}
export default ReviewCommercialProperty