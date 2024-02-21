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

//This component is used to show customer messages to property dealer
const ReviewProperty: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const propertyId: string | null = searchParams.get('id');
    const propertyType: string | null = searchParams.get('type');

    useEffect(() => {
        if (!propertyId || (propertyType !== 'agricultural' && propertyType !== 'commercial' && propertyType !== 'residential')) {
            navigate('/property-dealer')
            return
        }
    }, [propertyId, propertyType, navigate])

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
            const responseData = await fetchPropertyData(propertyType as 'residential' | 'commercial' | 'agricultural', propertyId as string)
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
    }, [propertyId, propertyType, fetchPropertyData])

    useEffect(() => {
        fetchSelectedProperty()
    }, [fetchSelectedProperty])

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {error && !spinner &&
                <div className="fixed top-36 w-full flex flex-col place-items-center md:hidden">
                    <p>Some error occured</p>
                    <button className="text-red-500" onClick={fetchSelectedProperty}>Try again</button>
                </div>}

            {propertyData && !spinner && !error &&
                <div>
                    <button type='button' className="bg-green-500 hover:bg-green-600 fixed top-16 left-2 mt-2 text-white font-semibold rounded px-2 py-1" onClick={() => {
                        navigate('/property-dealer')
                        return
                    }}>Back</button>
                    <div className={`pt-20 `}>
                        {/*heading */}
                        <div className="w-full z-20 mb-3">
                            <p className="text-2xl font-semibold text-center">Property details</p>
                        </div>
                        <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                            {propertyType === 'residential' && <ResidentialPropertyTable
                                propertyData={propertyData as ResidentialPropertyType}
                            />}
                            {propertyType === 'agricultural' && <AgriculturalPropertyTable
                                propertyData={propertyData as AgriculturalPropertyType}
                            />}
                            {propertyType === 'commercial' && <CommercialPropertyTable
                                propertyData={propertyData as CommercialPropertyType}
                            />}
                        </div>
                    </div>
                </div>}

        </Fragment>
    )
}
export default ReviewProperty