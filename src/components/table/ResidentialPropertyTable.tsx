import { Fragment } from "react"
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

interface ImageType {
    file: string;
    upload: File;
}

interface PropertyDataType {
    //data common to flat, house and plot property type
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
    propertyImagesUrl?: string[],
    contractImagesUrl?: string[] | null
}

interface PropsType {
    propertyData: PropertyDataType,
    propertyImages?: ImageType[],
    contractImages?: ImageType[],
    fetchedPropertyImagesUrl?: string[],
    fetchedContractImagesUrl?: string[]
    firmName?: string
}

//The component is used to review the residential proeprty before it is saved in the database
const ResidentialPropertyTable: React.FC<PropsType> = (props) => {
    const {
        propertyData,
        firmName,
        propertyImages,
        contractImages,
        fetchedContractImagesUrl,
        fetchedPropertyImagesUrl } = props

    return (
        <Fragment>
            <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                <thead >
                    <tr className="bg-gray-200 border-2 border-gray-300">
                        <th className="w-28 text-xl pt-4 pb-4 sm:w-48">Field</th>
                        <th className="text-xl ">Data</th>
                    </tr>
                </thead>
                <tbody>

                    {/*firm name */}
                    {firmName && < tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Firm name</td>
                        <td className=" pt-4 pb-4 text-center">{firmName}</td>
                    </tr>}

                    {/*proeprty type */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.residentialPropertyType.toLowerCase()}</td>
                    </tr>

                    {/*title */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Title</td>
                        <td className=" pt-4 pb-4 pr-2 pl-2 text-center">{propertyData.title}</td>
                    </tr>

                    {/*details */}
                    {propertyData.details && <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Details</td>
                        <td className=" pt-4 pb-4 pr-2 pl-2 flex justify-center">
                            <p>{propertyData.details}</p>
                        </td>
                    </tr>}

                    {/*type of sale */}
                    {propertyData.residentialPropertyType.toLowerCase() === 'house' && propertyData.typeOfSale && <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Type of sale</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.typeOfSale.floorForSale ? 'Floor for sale' : 'House for sale'}</td>
                    </tr>}

                    {/*price fixed*/}
                    {!propertyData.price.range.from && !propertyData.price.range.to && propertyData.price.fixed && <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                        <td className=" pt-4 pb-4 text-center">Rs. {propertyData.price.fixed}</td>
                    </tr>}

                    {/*price range */}
                    {propertyData.price.range.from && propertyData.price.range.to && !propertyData.price.fixed && <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                        <td className=" pt-4 pb-4 text-center">Rs. {propertyData.price.range.from} - Rs. {propertyData.price.range.to}</td>
                    </tr>}

                    {/*water supply */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Water supply</td>
                        <td className=" pt-4 pb-4 flex flex-col place-items-center">
                            <p>{propertyData.waterSupply.available ? 'Yes' : 'No'}</p>
                            {propertyData.waterSupply.available && propertyData.waterSupply.twentyFourHours ?
                                <p className="w-fit bg-gray-200 mr-1 ml-1 text-center p-1">24 hours water supply is available</p> :
                                <p className="w-fit bg-gray-200 mr-1 ml-1 text-center p-1">24 hours water supply is not available</p>}
                        </td>
                    </tr>

                    {/*electricity connection */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Electricity connection</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.electricityConnection ? 'Yes' : 'No'}</td>
                    </tr>

                    {/*sewage system */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Sewage system</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.sewageSystem ? 'Yes' : 'No'}</td>
                    </tr>

                    {/*cable tv*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Cable TV</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.cableTV ? 'Yes' : 'No'}</td>
                    </tr>

                    {/*high speed internet */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">High speed internet</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.highSpeedInternet ? 'Yes' : 'No'}</td>
                    </tr>

                    {/*Distance from grocery store */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from grocery store</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromGroceryStore} km</td>
                    </tr>

                    {/*Distance from restaurant/cafe */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from restaurant/cafe</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromRestaurantCafe} km</td>
                    </tr>

                    {/* Distance from exercise area*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from exercise area</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromExerciseArea} km</td>
                    </tr>

                    {/*Distance from school */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from school</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromSchool} km</td>
                    </tr>

                    {/*Distance from hospital */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from hospital</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.distance.distanceFromHospital} km</td>
                    </tr>

                    {/* Area type*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Area type</td>
                        <td className=" pt-4 pb-4 text-center">{propertyData.areaType}</td>
                    </tr>

                    {/*Total area */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Total area</td>
                        <td className=" pt-4 pb-4 text-center flex flex-col">
                            <p>{propertyData.area.totalArea.metreSquare} metre-square</p>
                            <p>{propertyData.area.totalArea.gajj} gajj</p>
                        </td>
                    </tr>

                    {/*Covered area */}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Covered area</td>
                        <td className=" pt-4 pb-4 text-center flex flex-col">
                            <p>{propertyData.area.coveredArea.metreSquare} metre-square</p>
                            <p>{propertyData.area.coveredArea.gajj} gajj</p>
                        </td>
                    </tr>

                    {/*Number of owners*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                        <td className=" pt-4 pb-4 text-center"> {propertyData.numberOfOwners}</td>
                    </tr>

                    {/*Legal restrictions */}
                    <tr className="border-2 border-gray-300">
                        <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                        <td className="pt-4 pb-4 flex flex-col place-items-center gap-2">
                            {!propertyData.legalRestrictions.isLegalRestrictions && <p className="text-center ">No</p>}
                            {propertyData.legalRestrictions.isLegalRestrictions && <>
                                <p className="text-center ">Yes</p>
                                <p className="mx-2 sm:mx-5 bg-gray-200 w-fit p-1">{propertyData.legalRestrictions.details}</p>
                            </>}
                        </td>
                    </tr>

                    {/*Property taxes per year */}
                    {propertyData.propertyTaxes &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Property taxes per year</td>
                            <td className="pt-4 pb-4 text-center">Rs. {propertyData.propertyTaxes}</td>
                        </tr>}

                    {/*Home owners association fees per year */}
                    {propertyData.homeOwnersAssociationFees &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Home owners association fees per year</td>
                            <td className="pt-4 pb-4 text-center ">Rs. {propertyData.homeOwnersAssociationFees}</td>
                        </tr>}

                    {/*Number of floors */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of floors</td>
                            <td className="pt-4 pb-4 text-center">{propertyData.numberOfFloors}</td>
                        </tr>}

                    {/*Number of living rooms */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of living rooms</td>
                            <td className="pt-4 pb-4 text-center ">{propertyData.numberOfLivingRooms}</td>
                        </tr>}

                    {/*Number of bedrooms */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of bedrooms</td>
                            <td className="pt-4 pb-4 text-center ">{propertyData.numberOfBedrooms}</td>
                        </tr>}

                    {/*Number of office rooms */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of office rooms</td>
                            <td className="pt-4 pb-4 text-center ">{propertyData.numberOfOfficeRooms}</td>
                        </tr>}

                    {/*Number of washrooms */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of washrooms</td>
                            <td className="pt-4 pb-4 text-center ">{propertyData.numberOfWashrooms}</td>
                        </tr>}

                    {/*Number of kitchens */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of kitchens</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfKitchen}</td>
                        </tr>}

                    {/* Number of car parkings*/}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of car parkings</td>
                            <td className="pt-4 pb-4 text-center">{propertyData.numberOfCarParkingSpaces}</td>
                        </tr>}

                    {/* Number of balconies*/}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of balconies</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.numberOfBalconies}</td>
                        </tr>}

                    {/*Store room */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Store room</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.storeRoom ? 'Yes' : 'No'}</td>
                        </tr>}


                    {/*Servant room */}
                    {propertyData.servantRoom && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Servant room</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">{propertyData.servantRoom ? 'Yes' : 'No'}</td>
                        </tr>}

                    {/*Furnishing*/}
                    {propertyData.furnishing && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Furnishing</td>
                            <td className="pt-4 pb-4 flex flex-col gap-2">
                                <p className="text-center">{propertyData.furnishing.type}</p>
                                {propertyData.furnishing.details &&
                                    <div className="flex justify-center">
                                        <p className="mx-2 sm:mx-5 bg-gray-200 w-fit p-1">{propertyData.furnishing.details}</p>
                                    </div>}
                            </td>
                        </tr>}

                    {/* kitchen furnishing*/}
                    {propertyData.kitchenFurnishing && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Kitchen furnishing</td>
                            <td className="pt-4 pb-4 flex flex-col gap-2">
                                <p className="text-center">{propertyData.kitchenFurnishing.type}</p>
                                {propertyData.kitchenFurnishing.details &&
                                    <div className="flex justify-center">
                                        <p className="mx-2 sm:mx-5 bg-gray-200 w-fit p-1">{propertyData.kitchenFurnishing.details}</p>
                                    </div>}
                            </td>
                        </tr>}

                    {/*Kitchen appliances */}
                    {propertyData.kitchenAppliances && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Kitchen appliances</td>
                            <td className="pt-4 pb-4 flex flex-col gap-2">
                                <p className="text-center">{propertyData.kitchenAppliances.available ? 'Yes' : 'No'}</p>
                                {propertyData.kitchenAppliances.available && propertyData.kitchenAppliances.details && propertyData.kitchenAppliances.details.trim() &&
                                    <div className="flex justify-center">
                                        <p className="mx-2 sm:mx-5 bg-gray-200 w-fit p-1">{propertyData.kitchenAppliances.details}</p>
                                    </div>}
                            </td>
                        </tr>}

                    {/*Washroom fitting */}
                    {propertyData.washroomFitting && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Washroom fitting</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <p className="pt-4 pb-4 text-center flex flex-col gap-2">{capitalizeFirstLetterOfAString(propertyData.washroomFitting)}</p>
                            </td>
                        </tr>}

                    {/*Electrical fitting */}
                    {propertyData.electricalFitting && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Electrical fitting</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <p className="pt-4 pb-4 text-center flex flex-col gap-2">{capitalizeFirstLetterOfAString(propertyData.electricalFitting)}</p>
                            </td>
                        </tr>}

                    {/*property type*/}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Flooring type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.flooringTypeArray && propertyData.flooringTypeArray.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>}

                    {/*roof type */}
                    {propertyData.roofTypeArray && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Roof type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.roofTypeArray.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>}

                    {/*wall type */}
                    {propertyData.wallTypeArray && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Wall type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.wallTypeArray.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>}

                    {/* Window type*/}
                    {propertyData.windowTypeArray && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Window type</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                <div className="flex flex-col">
                                    {propertyData.windowTypeArray.map(type => {
                                        return <p key={type}>{type}</p>
                                    })}
                                </div>
                            </td>
                        </tr>}

                    {/* safety system*/}
                    {propertyData.safetySystemArray && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') && propertyData.safetySystemArray.length > 0 &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Safety system</td>
                            <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                {propertyData.safetySystemArray.map(type => {
                                    return <p key={type}>{type}</p>
                                })}
                            </td>
                        </tr>}

                    {/* Garden*/}
                    {propertyData.garden && (propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Garden</td>
                            <td className="pt-4 pb-4 flex flex-col gap-2">
                                <p className="text-center ">{propertyData.garden.available ? 'Yes' : 'No'}</p>
                                {propertyData.garden.details && propertyData.garden.details.trim() && <div className="flex justify-center">
                                    <p className="p-1 mx-2 sm:mx-5 bg-gray-200 w-fit">{propertyData.garden.details.trim()}</p>
                                </div>}
                            </td>
                        </tr>}

                    {/*age of construction */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Age of construction</td>
                            <td className="pt-4 pb-4 text-center ">
                                <p>{propertyData.ageOfConstruction} years</p>
                            </td>
                        </tr>}

                    {/*Condition of property */}
                    {(propertyData.residentialPropertyType.toLowerCase() === 'flat' || propertyData.residentialPropertyType.toLowerCase() === 'house') &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Condition of property</td>
                            <td className="pt-4 pb-4 text-center ">
                                <p>{propertyData.conditionOfProperty}</p>
                            </td>
                        </tr>}

                    {/* location*/}
                    <tr className="border-2 border-gray-300">
                        <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                        <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                            {propertyData.location.name.village && <div className="flex flex-row gap-2">
                                <p className="font-semibold">Village:</p>
                                <p>{propertyData.location.name.village}</p>
                            </div>}
                            {propertyData.location.name.city && <div className="flex flex-row gap-2">
                                <p className="font-semibold">City:</p>
                                <p>{propertyData.location.name.city}</p>
                            </div>}
                            {propertyData.location.name.tehsil && <div className="flex flex-row gap-2">
                                <h2 className="font-semibold">Tehsil:</h2>
                                <p>{propertyData.location.name.tehsil}</p>
                            </div>}
                            <div className=" flex flex-row gap-2">
                                <p className="font-semibold">District:</p>
                                <p>{propertyData.location.name.district}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">State:</p>
                                <p>{propertyData.location.name.state}</p>
                            </div>
                        </td>
                    </tr>

                    {/*Land images */}
                    <tr className="border-2 border-gray-300">
                        <td className="pt-4 pb-4 text-lg font-semibold text-center">Land images</td>
                        <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                            {propertyImages && propertyImages.map(image => {
                                return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image.file} alt="" onClick={()=>window.open(image.file, '_blank')}/>;
                            })}
                            {fetchedPropertyImagesUrl && fetchedPropertyImagesUrl.map(image => {
                                return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={()=>window.open(image, '_blank')}/>;
                            })}
                            {propertyData.propertyImagesUrl && propertyData.propertyImagesUrl.map(image => {
                                return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={()=>window.open(image, '_blank')}/>;
                            })}
                        </td>
                    </tr>

                    {/*contract images */}
                    {(contractImages || propertyData.contractImagesUrl) &&
                        <tr className="border-2 border-gray-300">
                            <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract images</td>
                            <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                {contractImages && contractImages.map(image => {
                                    return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image.file} alt="" onClick={()=>window.open(image.file, '_blank')}/>
                                })}
                                {fetchedContractImagesUrl && fetchedContractImagesUrl.map(image => {
                                    return <img
                                        key={Math.random()}
                                        className='w-40 h-auto cursor-pointer'
                                        src={image}
                                        alt=""
                                        onClick={()=>window.open(image, '_blank')} />
                                })}
                                {propertyData.contractImagesUrl && propertyData.contractImagesUrl.map(image => {
                                    return <img
                                        key={Math.random()}
                                        className='w-40 h-auto cursor-pointer'
                                        src={image}
                                        alt="" 
                                        onClick={()=>window.open(image, '_blank')}/>
                                })}
                            </td>
                        </tr>}
                </tbody>
            </table>
        </Fragment >
    )
}
export default ResidentialPropertyTable