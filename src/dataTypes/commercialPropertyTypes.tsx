import { EvaluationDataType } from "./evaluationDataType"

export type BuiltUpType = 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic' | 'other'

export interface PropertyDataType {
    _id?: string,
    sentBackTofieldAgentForReevaluation?: {
        details: string[]
    },
    sentToEvaluatorByCityManagerForReevaluation?:{
        details: string[]
    },
    addedByPropertyDealer?: string,
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
    propertyImagesUrl?: string[],
    contractImagesUrl?: string[] | null,
    evaluationData?: EvaluationDataType,
    uniqueId?: string
}