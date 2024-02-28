import { useCallback } from 'react';
import { PropertyDataType as AgriculturalPropertyDataType } from '../dataTypes/agriculturalPropertyTypes';
import { PropertyDataType as CommercialPropertyType } from '../dataTypes/commercialPropertyTypes';
import { PropertyDataType as ResidentialPropertyType } from '../dataTypes/residentialPropertyTypes';

interface HookType {
    fetchPropertyData: (propertyId: string) => Promise<{
        status: 'ok',
        property: CommercialPropertyType | AgriculturalPropertyDataType | ResidentialPropertyType
    }>;
}

const useFetchPropertyData = (): HookType => {

    const fetchPropertyData = useCallback(async (propertyId: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property/fetch-selected-property?propertyId=${propertyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error('Some error occured')
        }
    }, []);

    return { fetchPropertyData };
};

export default useFetchPropertyData;

