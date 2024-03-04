import { EvaluationDataType } from "./evaluationDataType"

export interface CommonDataToAllPropertyTypes {
    _id?: string,
    propertyType?: 'agricultural' | 'commercial' | 'residential',
    sentBackTofieldAgentForReevaluation?: {
        details: string[]
    },
    sentToEvaluatorByCityManagerForReevaluation?: {
        details: string[]
    },
    addedByPropertyDealer?: string,
    location: {
        name: {
            plotNumber?: number | null,
            village: string | null,
            city: string | null,
            tehsil: string | null,
            district: string,
            state: string
        }
    },
    numberOfOwners: number,
    legalRestrictions: {
        isLegalRestrictions: boolean,
        details: string | null,
    },
    title: string,
    details: string | null,
    propertyImagesUrl?: string[],
    contractImagesUrl?: string[] | null,
    evaluationData?: EvaluationDataType,
    uniqueId?: string,
    isLive?: boolean,
    isSold?: boolean,
    isApprovedByCityManager?: {
        isApproved: boolean,
        date: string | null
    },
    area: {
        //agricultural property
        size?: number,
        unit?: 'metre-square' | 'acre',

        //commercial and residential 
        totalArea?: {
            metreSquare: number,
            squareFeet?: number,//commercial
            gajj?: number//residential
        },
        coveredArea?: {
            metreSquare: number,
            squareFeet?: number,//commercial
            gajj?: number//residential
        },


        details?: string | null,//resdiential and commercial
    },
}

