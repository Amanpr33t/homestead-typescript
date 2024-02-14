export interface PropertyDataType {
    _id?: string,
    sentBackTofieldAgentForReevaluation?: {
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
    propertyImagesUrl?: string[],
    contractImagesUrl?: string[] | null,
    evaluationData?: {
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
    uniqueId?: string
}

export type RoadType = 'unpaved road' | 'village road' | 'district road' | 'state highway' | 'national highway'
export type IrrigationSystemType = 'sprinkler' | 'drip' | 'underground pipeline'
export type ReservoirType = 'public' | 'private'
export type CropTypeArray = 'rice' | 'wheat' | 'maize' | 'cotton'
