export type LocationType = 'rural' | 'sub-urban' | 'urban' | 'mixed-use' | 'industrial'
export type LocationStatusType = 'posh' | 'premium' | 'popular' | 'ordinary' | 'low income'
export type ConstructionType = 'newly built' | 'ready to move' | 'needs renovation' | 'needs repair'

export interface EvaluationDataType {
    areDetailsComplete?: boolean,
    incompletePropertyDetails?: string[],
    typeOfLocation?: LocationType | null,
    locationStatus?: LocationStatusType | null,
    fairValueOfProperty?: number | null,
    fiveYearProjectionOfPrices?: {
        increase: boolean | null,
        decrease: boolean | null,
        percentageIncreaseOrDecrease: number | null,
    },
    conditionOfConstruction?: ConstructionType | null,
    qualityOfConstructionRating?: number | null,
    evaluatedAt?: Date,
}