import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyDataType as AgriculturalPropertyDataType } from '../dataTypes/agriculturalPropertyTypes';
import { PropertyDataType as CommercialPropertyType } from '../dataTypes/commercialPropertyTypes';
import { PropertyDataType as ResidentialPropertyType } from '../dataTypes/residentialPropertyTypes';

interface UploadResult {
    addOrEditPropertyData: (propertyImagesUrl: string[], contractImagesUrl: string[], propertyId?: string) => Promise<{
        status: string,
        message: string,
        routeTo: string
    }>;
}

const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")

const useAddOrEditPropertyData = (addOrEdit: 'add' | 'edit', propertyType: 'agricultural' | 'commercial' | 'residential', propertyData: AgriculturalPropertyDataType | ResidentialPropertyType | CommercialPropertyType, requestId?: string | null): UploadResult => {
    const navigate = useNavigate();

    const addOrEditPropertyData = useCallback(async (propertyImagesUrl: string[],
        contractImagesUrl: string[], propertyId?: string) => {
        const finalPropertyData: AgriculturalPropertyDataType | ResidentialPropertyType | CommercialPropertyType = {
            propertyImagesUrl,
            contractImagesUrl: contractImagesUrl.length ? contractImagesUrl : null,
            ...propertyData
        }
        try {
            let url: string
            if (propertyType === 'agricultural') {
                if (addOrEdit === 'add') {
                    url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/addAgriculturalProperty`
                } else if (addOrEdit === 'edit') {
                    url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/updateReevaluatedPropertyData?type=agricultural&id=${propertyId}`
                } else {
                    throw new Error('Add or edit not provided')
                }
            } else if (propertyType === 'commercial') {
                if (addOrEdit === 'add') {
                    url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/addCommercialProperty`
                } else if (addOrEdit === 'edit') {
                    url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/updateReevaluatedPropertyData?type=commercial&id=${propertyId}`
                } else {
                    throw new Error('Add or edit not provided')
                }
            } else if (propertyType === 'residential') {
                if (addOrEdit === 'add') {
                    url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/addResidentialProperty`
                } else if (addOrEdit === 'edit') {
                    url = `${process.env.REACT_APP_BACKEND_URL}/field-agent/updateReevaluatedPropertyData?type=residential&id=${propertyId}`
                } else {
                    throw new Error('Add or edit not provided')
                }
            } else {
                throw new Error('Property type not provided')
            }

            if (requestId && requestId !== 'null') {
                if (addOrEdit === 'add') {
                    url = url + `?requestId=${requestId}`
                }
            }
            const response = await fetch(url, {
                method: addOrEdit === 'add' ? 'POST' : 'PATCH',
                body: JSON.stringify(finalPropertyData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occurred')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                return {
                    status: 'success',
                    message: addOrEdit === 'add' ? 'Property has been added successfully' : 'Property has been updated successfully',
                    routeTo: '/field-agent'
                };
            } else if (data.status === 'invalid_authentication') {
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
                return {
                    status: 'warning',
                    message: 'Authentication failed',
                    routeTo: '/field-agent/signIn'
                };
            } else if (data.status === 'no-evaluator-available') {
                return {
                    status: 'warning',
                    message: 'No evaluator is available. Try later',
                    routeTo: '/field-agent'
                };
            } else {
                throw new Error('Some error occurred')
            }
        } catch (error) {
            throw new Error('Some error occurred')
        }
    }, [navigate, propertyData, propertyType, addOrEdit, requestId]);

    return { addOrEditPropertyData };
};

export default useAddOrEditPropertyData;

