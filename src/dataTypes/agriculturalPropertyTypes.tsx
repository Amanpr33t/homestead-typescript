import { CommonDataToAllPropertyTypes } from "./dataCommonToAllProperties"
export type RoadType = 'unpaved road' | 'village road' | 'district road' | 'state highway' | 'national highway'
export type IrrigationSystemType = 'sprinkler' | 'drip' | 'underground pipeline'
export type ReservoirType = 'public' | 'private'
export type CropTypeArray = 'rice' | 'wheat' | 'maize' | 'cotton'

export interface PropertyDataType extends CommonDataToAllPropertyTypes{
    /*area: {
        size: number,
        unit: 'metre-square' | 'acre',
        details: string | null,
    },*/
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
    price: number,
    crops: CropTypeArray[],
    road: {
        type: RoadType,
        details: string | null,
    },
    nearbyTown: string | null
}


