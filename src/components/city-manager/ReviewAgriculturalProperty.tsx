import React, { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../Spinner"
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import ApprovalForm from "./ApprovalForm";

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
    evaluationData: {
        areDetailsComplete: boolean,
        incompletePropertyDetails: string | null,
        typeOfLocation: string | null,
        locationStatus: string | null,
        fairValueOfProperty: number | null,
        fiveYearProjectionOfPrices: {
            increase: boolean | null,
            decrease: boolean | null,
            percentageIncreaseOrDecrease: number | null,
        },
        conditionOfConstruction: string | null
        qualityOfConstructionRating: number | null,
        evaluatedAt: Date | null,
    },
}

//This component is used to show property data. It also passes property data as props to PropertyEvaluationForm component 
const ReviewAgriculturalProperty: React.FC<PropsType> = ({ propertyId }) => {
    const navigate = useNavigate()

    const [showPropertyData, setShowPropertyData] = useState<boolean>(true)

    const [showApprovalForm, setShowApprovalForm] = useState(false) //If set to true, PropertyEvaluationForm component will be shown to the user

    const [property, setProperty] = useState<PropertyType | null>(null)

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const authToken: string | null = localStorage.getItem("homestead-city-manager-authToken")

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, [])

    //The function is used to fetch the selected property
    const fetchSelectedProperty = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/city-manager/fetch-selected-property?propertyType=agricultural&propertyId=${propertyId}`, {
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
                localStorage.removeItem("homestead-city-manager-authToken")
                navigate('/city-manager/signIn', { replace: true })
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

            <div className={`${showApprovalForm ? 'blur' : ''} w-full fixed top-16 bg-white sm:bg-transparent pb-2 z-30`}>
                <button type='button' className="bg-green-500 hover:bg-green-600  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/city-manager/agricultural-properties-pending-for-approval')}>Back</button>
                <button type='button' className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/city-manager', { replace: true })}>Home</button>
            </div>

            {property && !spinner && !error &&
                <div className={`pt-28 sm:pt-20 ${showApprovalForm ? 'blur' : ''}`}>

                    {/*heading */}
                    <div className="w-full  bg-white z-20 mb-3">
                        <p className="text-2xl font-semibold text-center">Agricultural property details</p>
                    </div>

                    {/*toggle buttons */}
                    <div className="w-full flex justify-center mb-3">
                        <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                            <button className={`-mr-2 pl-5 pr-5 pt-1 pb-1 ${showPropertyData ? 'bg-blue-400 text-white' : 'text-gray-600'}   text-lg font-medium rounded-3xl`} onClick={() => setShowPropertyData(true)}>Property data</button>
                            <button className={`-ml-2 pl-5 pr-5  pt-1 pb-1  ${!showPropertyData ? 'bg-blue-400 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => setShowPropertyData(false)}>Evaluation data</button>
                        </div>
                    </div>

                    {showPropertyData &&
                        //table shows propert data
                        <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                            <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto">
                                <thead >
                                    <tr className="bg-gray-200 border-2 border-gray-200">
                                        <th className="w-40 text-xl pt-2 pb-2">Field</th>
                                        <th className="text-xl ">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-2 border-gray-300">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Property ID</td>
                                        <td className=" pt-4 pb-4 text-center">{property.uniqueId}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Land Size</td>
                                        <td className="pt-2 pb-2 text-center">
                                            <p>{property.landSize.size} {property.landSize.unit}</p>
                                            {property.landSize.details && < p > {property.landSize.details}</p>}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Location</td>
                                        <td className="flex flex-col place-content-center gap-1 flex-wrap pt-2 pb-2 text-center">
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
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Number of owners</td>
                                        <td className="pt-2 pb-2 text-center">{property.numberOfOwners}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Water source</td>
                                        <td className="pt-2 pb-2 flex flex-col place-items-center gap-2" >
                                            {property.waterSource.canal && property.waterSource.canal.length > 0 &&
                                                <div className="flex flex-row gap-2">
                                                    <p className="font-semibold">Canal:</p>
                                                    <div className="flex flex-col">
                                                        {property.waterSource.canal.map(canal => {
                                                            return <p key={Math.random()}>{canal}</p>
                                                        })}
                                                    </div>
                                                </div>}
                                            {property.waterSource.river && property.waterSource.river.length > 0 &&
                                                <div className="flex flex-row gap-2">
                                                    <p className="font-semibold">River:</p>
                                                    <div className="flex flex-col">
                                                        {property.waterSource.river.map(river => {
                                                            return <p key={Math.random()}>{river}</p>
                                                        })}
                                                    </div>
                                                </div>}
                                            {property.waterSource.tubewells.numberOfTubewells > 0 && <div className="flex flex-row gap-2">
                                                <p className="font-semibold">Tubewell Depth:</p>
                                                <div className="flex flex-col">
                                                    {property.waterSource.tubewells.depth && property.waterSource.tubewells.depth.map(depth => {
                                                        return <p key={Math.random()}>{depth} feet</p>
                                                    })}
                                                </div>
                                            </div>}
                                        </td>
                                    </tr>

                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Reservoir</td>
                                        <td className="pt-2 pb-2 flex flex-col place-items-center">
                                            {!property.reservoir.isReservoir &&
                                                <p>No</p>
                                            }
                                            {property.reservoir.isReservoir &&
                                                <div className="flex flex-col gap-1">
                                                    {property.reservoir.type && <div className="flex flex-row gap-2">
                                                        <p className="font-semibold">Type:</p>
                                                        <p>{property.reservoir.type[0]}, {property.reservoir.type[1]}</p>
                                                    </div>}
                                                    {property.reservoir.type && property.reservoir.type.includes('private') &&
                                                        <div className="flex flex-row gap-2">
                                                            <p className="font-semibold w-fit">Capacity of private reservoir:</p>
                                                            <p>{property.reservoir.capacityOfPrivateReservoir} {property.reservoir.unitOfCapacityForPrivateReservoir}</p>
                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                    {property.irrigationSystem && property.irrigationSystem.length > 0 && <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Irrigation System</td>
                                        <td className="pt-2 pb-2 text-center">
                                            {property.irrigationSystem.map(system => {
                                                return <p key={Math.random()}>{system}</p>
                                            })}
                                        </td>
                                    </tr>}
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Price</td>
                                        <td className="pt-2 pb-2 text-center">
                                            <div className="flex flex-row place-content-center gap-1">
                                                <p className="font-semibold">Rs.</p>
                                                <p>{property.priceDemanded.number}</p>
                                            </div>
                                            <p className="p-1 mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center">{property.priceDemanded.words}</p>
                                        </td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Road Type</td>
                                        <td className="pt-2 pb-2 flex flex-col place-items-center gap-1">
                                            <p>{property.road.type}</p>
                                            {property.road.details && <p className="p-1 mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center" >{property.road.details}</p>}
                                        </td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Legal Restrictions</td>
                                        <td className="pt-2 pb-2 flex flex flex-col place-items-center">
                                            {!property.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                            {property.legalRestrictions.isLegalRestrictions && <>
                                                <p>Yes</p>
                                                <p className="p-1 mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center">{property.legalRestrictions.details}</p>
                                            </>}
                                        </td>
                                    </tr>
                                    {property.nearbyTown && <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Nearby town</td>
                                        <td className="pt-2 pb-2 flex justify-center">
                                            <p>{property.nearbyTown}</p>
                                        </td>
                                    </tr>}
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Land Images</td>
                                        <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                            {property.propertyImagesUrl.map(image => {
                                                return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={() => window.open(image, '_blank')} />;
                                            })}
                                        </td>
                                    </tr>
                                    {property.contractImagesUrl && property.contractImagesUrl.length > 0 && <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Contract Images</td>
                                        <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                            {property.contractImagesUrl.map(image => {
                                                return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={() => window.open(image, '_blank')} />
                                            })}
                                        </td>
                                    </tr>}
                                </tbody>
                            </table>
                        </div>}

                    {!showPropertyData &&
                        //table shows evaluation data
                        <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                            <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto">
                                <thead >
                                    <tr className="bg-gray-200 border-2 border-gray-200">
                                        <th className="w-40 text-xl pt-2 pb-2">Field</th>
                                        <th className="text-xl ">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-2 border-gray-300">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Type of location</td>
                                        <td className=" pt-4 pb-4 text-center">{property.evaluationData.typeOfLocation}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Location status</td>
                                        <td className="pt-2 pb-2 text-center">{property.evaluationData.locationStatus}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Fair value of property</td>
                                        <td className="pt-2 pb-2 text-center">{property.evaluationData.fairValueOfProperty}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Five year projection of prices</td>
                                        <td className="pt-7 text-center flex flex-row gap-2 items-center justify-center">
                                            <p>{property.evaluationData.fiveYearProjectionOfPrices.percentageIncreaseOrDecrease}%</p>
                                            {property.evaluationData.fiveYearProjectionOfPrices.decrease ? <FaArrowDown className="text-red-500 text-lg" /> : <FaArrowUp className="text-green-500 text-lg" />}
                                        </td>
                                    </tr>
                                    {property.evaluationData.qualityOfConstructionRating &&
                                        <tr className="border-2 border-gray-200">
                                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Quality of construction rating</td>
                                            <td className="pt-2 pb-2 text-center">{property.evaluationData.qualityOfConstructionRating}</td>
                                        </tr>}
                                </tbody>
                            </table>
                        </div>}

                    <div className="w-full -mt-4 mb-6 flex justify-center ">
                        <button type="button" className="w-fit bg-blue-500 text-white font-medium rounded pl-2 pr-2 h-8" onClick={() => setShowApprovalForm(true)}>Fill approval form</button>
                    </div>
                </div>}

            {property &&
                <ApprovalForm
                    showApprovalForm={showApprovalForm}
                    hideApprovalForm={() => setShowApprovalForm(false)}
                    propertyType='agricultural'
                    propertyId={property._id} />}
        </Fragment >
    )
}
export default ReviewAgriculturalProperty