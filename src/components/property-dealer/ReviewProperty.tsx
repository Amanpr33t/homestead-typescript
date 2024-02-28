import React, { Fragment, useEffect, useState, useCallback } from "react"
import Spinner from "../Spinner"
import { useNavigate } from "react-router-dom";
import useFetchPropertyData from "../../custom-hooks/useFetchPropertyData";
import { PropertyDataType as AgriculturalPropertyType } from "../../dataTypes/agriculturalPropertyTypes";
import { PropertyDataType as ResidentialPropertyType } from "../../dataTypes/residentialPropertyTypes";
import { PropertyDataType as CommercialPropertyType } from "../../dataTypes/commercialPropertyTypes";
import AgriculturalPropertyTable from "../table/AgriculturalPropertyTable";
import ResidentialPropertyTable from "../table/ResidentialPropertyTable";
import CommercialPropertyTable from "../table/CommercialPropertyTable";
import { useLocation } from 'react-router-dom';
import ImageContainer from "../ImagesContainer";

//This component is used to show customer messages to property dealer
const ReviewProperty: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const propertyId: string | null = searchParams.get('id');
    const propertyType: string | null = searchParams.get('type');

    useEffect(() => {
        if (!propertyId) {
            navigate('/property-dealer')
            return
        }
    }, [propertyId, navigate])

    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

    const { fetchPropertyData } = useFetchPropertyData()

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
            return
        }
    }, [authToken, navigate])

    const [spinner, setSpinner] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const [propertyData, setPropertyData] = useState<AgriculturalPropertyType | ResidentialPropertyType | CommercialPropertyType | null>(null)

    const fetchSelectedProperty = useCallback(async () => {
        try {
            setError(false)
            setSpinner(true)
            const responseData = await fetchPropertyData(propertyId as string)
            if (responseData.status === 'ok') {
                setSpinner(false)
                setPropertyData(responseData.property as AgriculturalPropertyType | ResidentialPropertyType | CommercialPropertyType)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [propertyId, fetchPropertyData])

    useEffect(() => {
        fetchSelectedProperty()
    }, [fetchSelectedProperty])

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {propertyData && !spinner && !error &&
                <div>
                    {propertyData.isSold && propertyData.propertyImagesUrl && <ImageContainer isSold={propertyData.isSold} propertyImagesUrl={propertyData.propertyImagesUrl} />}
                </div>}

        </Fragment>
    )
}
export default ReviewProperty