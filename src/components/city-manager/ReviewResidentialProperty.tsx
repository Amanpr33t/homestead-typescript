import { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import ApprovalForm from "./ApprovalForm";
import Spinner from "../Spinner"
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions"

type FlooringType = 'cemented' | 'marble' | 'luxurious marble' | 'standard tiles' | 'premium tiles' | 'luxurious tiles'
type WallType = 'plaster' | 'paint' | 'premium paint' | 'wall paper' | 'pvc panelling' | 'art work'
type RoofType = 'standard' | 'pop work' | 'down ceiling'
type WindowType = 'standard' | 'wood' | 'premium material'
type SafetySystemType = 'cctv' | 'glass break siren' | 'entry sensor' | 'motion sensor' | 'panic button' | 'keypad' | 'keyfob' | 'smoke detector' | 'co detector' | 'water sprinkler' | 'doorbell camera'
type ConditionOfPropertyType = 'exceptionally new' | 'near to new' | 'some signs of agying' | 'need some renovations' | 'needs complete renovation'

interface SaleType {
    floorForSale: boolean,
    houseForSale: boolean
}

interface PropertyType {
    //data common to flat, house and plot property type
    _id: string,
    addedByFieldAgent: string,
    propertyEvaluator: string,
    uniqueId: string,
    propertyImagesUrl: string[],
    contractImagesUrl: string[] | null,
    addedByPropertyDealer: string,
    residentialPropertyType: string,
    title: string,
    details: string | null,
    price: {
        fixed: number | null,
        range: {
            from: number | null,
            to: number | null
        }
    },
    waterSupply: {
        available: boolean,
        twentyFourHours: boolean | null
    },
    electricityConnection: boolean,
    sewageSystem: boolean,
    cableTV: boolean,
    highSpeedInternet: boolean,
    distance: {
        distanceFromGroceryStore: number,
        distanceFromRestaurantCafe: number,
        distanceFromExerciseArea: number,
        distanceFromSchool: number,
        distanceFromHospital: number
    },
    areaType: 'rural' | 'urban' | 'sub-urban',
    area: {
        totalArea: {
            metreSquare: number,
            gajj: number
        },
        coveredArea: {
            metreSquare: number,
            gajj: number
        }
    },
    numberOfOwners: number,
    legalRestrictions: {
        isLegalRestrictions: boolean,
        details: string | null,
    },
    propertyTaxes: number | null,
    homeOwnersAssociationFees: number | null,
    location: {
        name: {
            village: string | null,
            city: string | null,
            tehsil: string | null,
            district: string,
            state: string
        }
    },
    typeOfSale?: SaleType,
    numberOfFloors?: number,
    numberOfLivingRooms?: number,
    numberOfBedrooms?: number,
    numberOfOfficeRooms?: number,
    numberOfWashrooms?: number,
    numberOfKitchen?: number,
    numberOfCarParkingSpaces?: number,
    numberOfBalconies?: number,
    storeRoom?: boolean,
    servantRoom?: boolean,
    furnishing?: {
        type: 'fully-furnished' | 'semi-furnished' | 'unfurnished',
        details: string | null
    },
    kitchenFurnishing?: {
        type: 'modular' | 'semi-furnished' | 'unfurnished',
        details: string | null
    },
    kitchenAppliances?: {
        available: boolean,
        details: string | null
    },
    washroomFitting?: 'standard' | 'premium' | 'luxurious',
    electricalFitting?: 'standard' | 'premium' | 'luxurious',
    flooringTypeArray?: FlooringType[],
    roofTypeArray?: RoofType[],
    wallTypeArray?: WallType[],
    windowTypeArray?: WindowType[],
    safetySystemArray?: SafetySystemType[] | null,
    garden?: {
        available: boolean,
        details: string | null
    },
    ageOfConstruction?: number,
    conditionOfProperty?: ConditionOfPropertyType,
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

interface PropsType {
    propertyId: string
}

//This component is used to show property data. It also passes property data as props to PropertyEvaluationForm component 
const ReviewResidentialProperty: React.FC<PropsType> = ({ propertyId }) => {
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/city-manager/fetch-selected-property?propertyType=residential&propertyId=${propertyId}`, {
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
                <button type='button' className="bg-green-500 hover:bg-green-600  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/city-manager/residential-properties-pending-for-approval')}>Back</button>
                <button type='button' className="bg-green-500 hover:bg-green-600 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/city-manager', { replace: true })}>Home</button>
            </div>

            {property && !spinner && !error &&
                <div className={`${showApprovalForm ? 'blur' : ''}`}>

                    {/*heading */}
                    <div className="w-full  bg-white z-20 mb-3">
                        <p className="text-2xl font-semibold text-center">Residential property details</p>
                    </div>

                    {/*toggle buttons */}
                    <div className="w-full flex justify-center mb-3">
                        <div className="w-fit border-2 gap-2 flex flex-row place-content-center rounded-l-3xl rounded-r-3xl">
                            <button className={`-mr-2 pl-5 pr-5 pt-1 pb-1 ${showPropertyData ? 'bg-blue-400 text-white' : 'text-gray-600'}   text-lg font-medium rounded-3xl`} onClick={() => setShowPropertyData(true)}>Property data</button>
                            <button className={`-ml-2 pl-5 pr-5  pt-1 pb-1  ${!showPropertyData ? 'bg-blue-400 text-white' : 'text-gray-600'} text-lg font-medium rounded-3xl`} onClick={() => setShowPropertyData(false)}>Evaluation data</button>
                        </div>
                    </div>

                    {showPropertyData && <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                        <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                            <thead >
                                <tr className="bg-gray-200 border-2 border-gray-300">
                                    <th className="w-28 text-xl pt-4 pb-4 sm:w-fit">Field</th>
                                    <th className="text-xl ">Data</th>
                                </tr>
                            </thead>
                            <tbody>

                                {/*unique id */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property ID</td>
                                    <td className=" pt-4 pb-4 text-center">{property.uniqueId}</td>
                                </tr>

                                {/*proeprty type */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                                    <td className=" pt-4 pb-4 text-center">{property.residentialPropertyType.toLowerCase()}</td>
                                </tr>

                                {/*title */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Title</td>
                                    <td className=" pt-4 pb-4 pr-2 pl-2 text-center">{property.title}</td>
                                </tr>

                                {/*details */}
                                {property.details && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Details</td>
                                    <td className=" pt-4 pb-4 pr-2 pl-2 text-center">{property.details}</td>
                                </tr>}

                                {/*type of sale */}
                                {property.residentialPropertyType.toLowerCase() === 'house' && property.typeOfSale && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Type of sale</td>
                                    <td className=" pt-4 pb-4 text-center">{property.typeOfSale.floorForSale ? 'Floor for sale' : 'House for sale'}</td>
                                </tr>}

                                {/*price fixed*/}
                                {!property.price.range.from && !property.price.range.to && property.price.fixed && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                                    <td className=" pt-4 pb-4 text-center">Rs. {property.price.fixed}</td>
                                </tr>}

                                {/*price range */}
                                {property.price.range.from && property.price.range.to && !property.price.fixed && <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                                    <td className=" pt-4 pb-4 text-center">Rs. {property.price.range.from} - Rs. {property.price.range.to}</td>
                                </tr>}

                                {/*water supply */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Water supply</td>
                                    <td className=" pt-4 pb-4 flex flex-col place-items-center">
                                        <p>{property.waterSupply.available ? 'Yes' : 'No'}</p>
                                        {property.waterSupply.available && property.waterSupply.twentyFourHours ?
                                            <p className="w-fit bg-gray-200 mr-1 ml-1 text-center">24 hours water supply is available</p> :
                                            <p className="w-fit bg-gray-200 mr-1 ml-1 text-center">24 hours water supply is not available</p>}
                                    </td>
                                </tr>

                                {/*electricity connection */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Electricity connection</td>
                                    <td className=" pt-4 pb-4 text-center">{property.electricityConnection ? 'Yes' : 'No'}</td>
                                </tr>

                                {/*sewage system */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Sewage system</td>
                                    <td className=" pt-4 pb-4 text-center">{property.sewageSystem ? 'Yes' : 'No'}</td>
                                </tr>

                                {/*cable tv*/}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Cable TV</td>
                                    <td className=" pt-4 pb-4 text-center">{property.cableTV ? 'Yes' : 'No'}</td>
                                </tr>

                                {/*high speed internet */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">High speed internet</td>
                                    <td className=" pt-4 pb-4 text-center">{property.highSpeedInternet ? 'Yes' : 'No'}</td>
                                </tr>

                                {/*Distance from grocery store */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from grocery store</td>
                                    <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromGroceryStore} km</td>
                                </tr>

                                {/*Distance from restaurant/cafe */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from restaurant/cafe</td>
                                    <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromRestaurantCafe} km</td>
                                </tr>

                                {/* Distance from exercise area*/}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from exercise area</td>
                                    <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromExerciseArea} km</td>
                                </tr>

                                {/*Distance from school */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from school</td>
                                    <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromSchool} km</td>
                                </tr>

                                {/*Distance from hospital */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from hospital</td>
                                    <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromHospital} km</td>
                                </tr>

                                {/* Area type*/}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Area type</td>
                                    <td className=" pt-4 pb-4 text-center">{property.areaType}</td>
                                </tr>

                                {/*Total area */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Total area</td>
                                    <td className=" pt-4 pb-4 text-center flex flex-col">
                                        <p>{property.area.totalArea.metreSquare} metre-square</p>
                                        <p>{property.area.totalArea.gajj} gajj</p>
                                    </td>
                                </tr>

                                {/*Covered area */}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Covered area</td>
                                    <td className=" pt-4 pb-4 text-center flex flex-col">
                                        <p>{property.area.coveredArea.metreSquare} metre-square</p>
                                        <p>{property.area.coveredArea.gajj} gajj</p>
                                    </td>
                                </tr>

                                {/*Number of owners*/}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                                    <td className=" pt-4 pb-4 text-center"> {property.numberOfOwners}</td>
                                </tr>

                                {/*Legal restrictions */}
                                <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        {!property.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                        {property.legalRestrictions.isLegalRestrictions && <>
                                            <p>Yes</p>
                                            <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center">{property.legalRestrictions.details}</p>
                                        </>}
                                    </td>
                                </tr>

                                {/*Property taxes per year */}
                                {property.propertyTaxes && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Property taxes per year</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">Rs. {property.propertyTaxes}</td>
                                </tr>}

                                {/*Home owners association fees per year */}
                                {property.homeOwnersAssociationFees && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Home owners association fees per year</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">Rs. {property.homeOwnersAssociationFees}</td>
                                </tr>}

                                {/*Number of floors */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of floors</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfFloors}</td>
                                </tr>}

                                {/*Number of living rooms */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of living rooms</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfLivingRooms}</td>
                                </tr>}

                                {/*Number of bedrooms */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of bedrooms</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfBedrooms}</td>
                                </tr>}

                                {/*Number of office rooms */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of office rooms</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfOfficeRooms}</td>
                                </tr>}

                                {/*Number of washrooms */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of washrooms</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfWashrooms}</td>
                                </tr>}

                                {/*Number of kitchens */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of kitchens</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfKitchen}</td>
                                </tr>}

                                {/* Number of car parkings*/}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of car parkings</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfCarParkingSpaces}</td>
                                </tr>}

                                {/* Number of balconies*/}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of balconies</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfBalconies}</td>
                                </tr>}

                                {/*Store room */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Store room</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.storeRoom ? 'Yes' : 'No'}</td>
                                </tr>}


                                {/*Servant room */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && property.servantRoom &&
                                    <tr className="border-2 border-gray-300">
                                        <td className="pt-4 pb-4 text-lg font-semibold text-center">Servant room</td>
                                        <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.servantRoom ? 'Yes' : 'No'}</td>
                                    </tr>}

                                {/*Furnishing*/}
                                {property.furnishing && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Furnishing</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <p>{capitalizeFirstLetterOfAString(property.furnishing.type)}</p>
                                    </td>
                                </tr>}

                                {/* kitchen furnishing*/}
                                {property.kitchenFurnishing && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Kitchen furnishing</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <p>{capitalizeFirstLetterOfAString(property.kitchenFurnishing.type)}</p>
                                    </td>
                                </tr>}

                                {/*Kitchen appliances */}
                                {property.kitchenAppliances && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Kitchen appliances</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <p>{property.kitchenAppliances.available ? 'Yes' : 'No'}</p>
                                        {property.kitchenAppliances.available && property.kitchenAppliances.details && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.kitchenAppliances.details.trim()}</p>}
                                    </td>
                                </tr>}

                                {/*Washroom fitting */}
                                {property.washroomFitting && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Washroom fitting</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <p>{capitalizeFirstLetterOfAString(property.washroomFitting)}</p>
                                    </td>
                                </tr>}

                                {/*Electrical fitting */}
                                {property.electricalFitting && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Electrical fitting</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <p className="pt-4 pb-4 text-center flex flex-col gap-2">{capitalizeFirstLetterOfAString(property.electricalFitting)}</p>
                                    </td>
                                </tr>}

                                {/*property type*/}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Flooring type</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        {property.flooringTypeArray && property.flooringTypeArray.map(type => {
                                            return <p key={type}>{type}</p>
                                        })}
                                    </td>
                                </tr>}

                                {/*roof type */}
                                {property.roofTypeArray && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Roof type</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        {property.roofTypeArray.map(type => {
                                            return <p key={type}>{type}</p>
                                        })}
                                    </td>
                                </tr>}

                                {/*wall type */}
                                {property.wallTypeArray && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Wall type</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        {property.wallTypeArray.map(type => {
                                            return <p key={type}>{type}</p>
                                        })}
                                    </td>
                                </tr>}

                                {/* Window type*/}
                                {property.windowTypeArray && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Window type</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <div className="flex flex-col">
                                            {property.windowTypeArray.map(type => {
                                                return <p key={type}>{type}</p>
                                            })}
                                        </div>
                                    </td>
                                </tr>}

                                {/* safety system*/}
                                {property.safetySystemArray && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && property.safetySystemArray.length > 0 && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Safety system</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        {property.safetySystemArray.map(type => {
                                            return <p key={type}>{type}</p>
                                        })}
                                    </td>
                                </tr>}

                                {/* Garden*/}
                                {property.garden && (property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Garden</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <p>{property.garden.available ? 'Yes' : 'No'}</p>
                                        {property.garden.details && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.garden.details.trim()}</p>}
                                    </td>
                                </tr>}

                                {/*age of construction */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Age of construction</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <p>{property.ageOfConstruction} years</p>
                                    </td>
                                </tr>}

                                {/*Condition of property */}
                                {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Condition of property</td>
                                    <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                        <p>{property.conditionOfProperty}</p>
                                    </td>
                                </tr>}

                                {/* location*/}
                                <tr className="border-2 border-gray-300">
                                    <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                                    <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
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

                                {/*Property images*/}
                                {property.propertyImagesUrl.length > 0 && < tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Property images</td>
                                    <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                        {property.propertyImagesUrl.map(image => {
                                            return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={() => window.open(image, '_blank')} />;
                                        })}
                                    </td>
                                </tr>}

                                {/*Contract images*/}
                                {property.contractImagesUrl && property.contractImagesUrl.length > 0 && <tr className="border-2 border-gray-300">
                                    <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract images</td>
                                    <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
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
                    propertyType='residential'
                    propertyId={property._id} />}

        </Fragment >
    )
}
export default ReviewResidentialProperty