import React, { Fragment, useEffect, useState, useCallback } from "react"
import Spinner from "../../Spinner";
import { useNavigate } from "react-router-dom";
import { PropertyDataType as AgriculturalPropertyType } from "../../../dataTypes/agriculturalPropertyTypes";
import { PropertyDataType as ResidentialPropertyType } from "../../../dataTypes/residentialPropertyTypes";
import { PropertyDataType as CommercialPropertyType } from "../../../dataTypes/commercialPropertyTypes";
import { useLocation } from 'react-router-dom';
import ImageContainer from "./ImagesContainer";
import { capitaliseFirstAlphabetsOfAllWordsOfASentence, capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions";
import { formatDate } from "../../../utils/dateFunctions";
import AgriculturalPropertyReview from "./Agricultural";
import ResidentialPropertyReview from "./Residential";
import CommercialPropertyReview from "./Commercial";
import { BiArea } from "react-icons/bi";
import { FaRupeeSign } from "react-icons/fa";

//This component is used to show customer messages to property dealer
const ReviewProperty: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const currentUrl = location.pathname;

    const searchParams = new URLSearchParams(location.search);
    const propertyId: string | null = searchParams.get('id');
    const propertyType: string | null = searchParams.get('type');

    useEffect(() => {
        if (!propertyId || (propertyType !== 'agricultural' && propertyType !== 'residential' && propertyType !== 'commercial')) {
            navigate('/property-dealer')
            return
        }
    }, [propertyId, navigate, propertyType])

    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")

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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property/fetch-selected-property?propertyId=${propertyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                setPropertyData(data.property as AgriculturalPropertyType | ResidentialPropertyType | CommercialPropertyType)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
        }
    }, [propertyId, authToken])

    useEffect(() => {
        fetchSelectedProperty()
    }, [fetchSelectedProperty])

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {error && !spinner &&
                < div className="fixed top-36 w-full flex flex-col place-items-center ">
                    <p>Some error occured</p>
                    <button type='button' className="text-red-500" onClick={fetchSelectedProperty}>Try again</button>
                </div>}

            {propertyData && !spinner && !error &&
                <div className=" flex flex-col place-items-center">

                    {propertyData.propertyImagesUrl &&
                        <ImageContainer
                            isClosed={propertyData.isClosed as boolean}
                            isLive={propertyData.isLive as boolean}
                            imagesUrl={propertyData.propertyImagesUrl} />}

                    <div className="flex flex-row w-full md:w-11/12 lg:w-9/12 gap-10 pb-10">
                        <div className="w-full flex flex-col px-3 sm:px-7 md:px-0 ">
                            <div className=" py-7 border-b shadow-b border-gray-300">
                                <p className=" text-2xl font-semibold text-gray-700">{propertyData.location.name.plotNumber && `${propertyData.location.name.plotNumber}, `}{propertyData.location.name.village && `${capitalizeFirstLetterOfAString(propertyData.location.name.village)}, `}{propertyData.location.name.city && `${capitalizeFirstLetterOfAString(propertyData.location.name.city)}, `}{capitalizeFirstLetterOfAString(propertyData.location.name.district)}, {capitalizeFirstLetterOfAString(propertyData.location.name.state)}</p>
                                <div className="flex flex-row mt-2 text-gray-700  gap-5 ">
                                    {propertyType === 'agricultural' &&
                                        <div className="flex flex-row">
                                            {propertyData.area.size && <p className="flex flex-row gap-1">
                                                <BiArea className="mt-1" /> {propertyData.area.size.toLocaleString('en-IN')}
                                            </p>}
                                            {propertyData.area.unit === 'metre-square' ? <div>m<sup>2</sup></div> : 'acre'}
                                        </div>}
                                    {propertyType !== 'agricultural' &&
                                        <div className="flex flex-row">
                                            <p className="flex flex-row gap-1">
                                                <BiArea className="mt-1" /> {propertyData.area.totalArea?.metreSquare.toLocaleString('en-IN')}
                                            </p>
                                            <div>m<sup>2</sup></div>
                                        </div>
                                    }
                                    <p className="">{capitalizeFirstLetterOfAString(propertyType as string)} property</p>
                                </div>
                                <p className="text-gray-700  mt-1 mb-4">Listed on {propertyData.isApprovedByCityManager && propertyData.isApprovedByCityManager.date && formatDate(propertyData.isApprovedByCityManager?.date)}</p>

                                {(propertyType === 'commercial' || propertyType === 'agricultural') && (propertyData as CommercialPropertyType | AgriculturalPropertyType).price &&
                                    <p className="flex flex-row font-bold text-lg text-gray-700">
                                        <FaRupeeSign className="mt-1" />{(propertyData as CommercialPropertyType | AgriculturalPropertyType).price.toLocaleString('en-IN')}
                                    </p>}

                                
                                    <p className="flex flex-row font-bold text-lg text-gray-700">
                                        <FaRupeeSign className="mt-1" />
                                        {propertyData.price.toLocaleString('en-IN')}
                                    </p>

                            </div>
                            <div className="flex flex-col gap-4 py-8 border-b shadow-b border-gray-300">
                                <p className="text-xl font-semibold text-gray-800">{propertyData.title}</p>
                                {propertyData.details && <p className="text-gray-700">{propertyData.details}</p>}
                            </div>
                            {propertyType === 'agricultural' && propertyData !== null &&
                                <AgriculturalPropertyReview
                                    property={propertyData as AgriculturalPropertyType}
                                />}
                            {propertyType === 'residential' && propertyData !== null &&
                                <ResidentialPropertyReview
                                    property={propertyData as ResidentialPropertyType}
                                />}
                            {propertyType === 'commercial' && propertyData !== null &&
                                <CommercialPropertyReview
                                    property={propertyData as CommercialPropertyType}
                                />}
                        </div>
                    </div>
                </div>}

        </Fragment>
    )
}
export default ReviewProperty