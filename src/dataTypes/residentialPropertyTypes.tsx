import { EvaluationDataType } from "./evaluationDataType"

export type FlooringType = 'cemented' | 'marble' | 'luxurious marble' | 'standard tiles' | 'premium tiles' | 'luxurious tiles'
export type WallType = 'plaster' | 'paint' | 'premium paint' | 'wall paper' | 'pvc panelling' | 'art work'
export type RoofType = 'standard' | 'pop work' | 'down ceiling'
export type WindowType = 'standard' | 'wood' | 'premium material'
export type SafetySystemType = 'cctv' | 'glass break siren' | 'entry sensor' | 'motion sensor' | 'panic button' | 'keypad' | 'keyfob' | 'smoke detector' | 'co detector' | 'water sprinkler' | 'doorbell camera'
export type ConditionOfPropertyType = 'exceptionally new' | 'near to new' | 'some signs of agying' | 'need some renovations' | 'needs complete renovation'

export interface SaleType {
    floorForSale: boolean,
    houseForSale: boolean
}

export interface HouseSpecificDataType {
    typeOfSale?: SaleType
}

export interface DataCommonToHouseAndFlatType {
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
    conditionOfProperty?: ConditionOfPropertyType
}

export interface PropertyDataType extends HouseSpecificDataType, DataCommonToHouseAndFlatType {
    //data common to flat, house and plot property type
    _id?: string,
    sentBackTofieldAgentForReevaluation?: {
        details: string[]
    },
    sentToEvaluatorByCityManagerForReevaluation?: {
        details: string[]
    },
    addedByPropertyDealer?: string,
    residentialPropertyType: 'flat' | 'house' | 'plot',
    title: string,
    details: string | null,
    priceData: {
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
    propertyImagesUrl?: string[],
    contractImagesUrl?: string[] | null,
    evaluationData?: EvaluationDataType,
    uniqueId?: string,
    isLive?:boolean,
    isSold?:boolean
}