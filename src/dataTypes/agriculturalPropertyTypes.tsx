import { EvaluationDataType } from "./evaluationDataType"

export interface PropertyDataType {
    _id?: string,
    sentBackTofieldAgentForReevaluation?: {
        details: string[]
    },
    sentToEvaluatorByCityManagerForReevaluation?: {
        details: string[]
    },
    addedByPropertyDealer?: string,
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
    title: string,
    details: string | null,
    irrigationSystem: IrrigationSystemType[] | null,
    price: number,
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
    propertyImagesUrl?: string[],
    contractImagesUrl?: string[] | null,
    evaluationData?: EvaluationDataType,
    uniqueId?: string,
    isLive?:boolean,
    isSold?:boolean
}

export type RoadType = 'unpaved road' | 'village road' | 'district road' | 'state highway' | 'national highway'
export type IrrigationSystemType = 'sprinkler' | 'drip' | 'underground pipeline'
export type ReservoirType = 'public' | 'private'
export type CropTypeArray = 'rice' | 'wheat' | 'maize' | 'cotton'
