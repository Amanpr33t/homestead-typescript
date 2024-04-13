import React, { Fragment, useEffect, useState, useCallback } from "react"
import Spinner from "../../Spinner";
import { Link, useNavigate } from "react-router-dom";
import { PropertyDataType as AgriculturalPropertyType } from "../../../dataTypes/agriculturalPropertyTypes";
import { PropertyDataType as ResidentialPropertyType } from "../../../dataTypes/residentialPropertyTypes";
import { PropertyDataType as CommercialPropertyType } from "../../../dataTypes/commercialPropertyTypes";
import { useLocation } from 'react-router-dom';
import ImageContainer from "../../property-dealer/reviewProperty/ImagesContainer";
import { capitaliseFirstAlphabetsOfAllWordsOfASentence, capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions";
import { formatDate } from "../../../utils/dateFunctions";
import AgriculturalPropertyReview from "../../property-dealer/reviewProperty/Agricultural";
import ResidentialPropertyReview from "../../property-dealer/reviewProperty/Residential";
import CommercialPropertyReview from "../../property-dealer/reviewProperty/Commercial";
import { BiArea } from "react-icons/bi";
import { FaRupeeSign } from "react-icons/fa";
import DealerInfoCard from "./DealerInfoCard";
import PropertyCard from "./PropertyCard";
import { AlertType } from "../../../dataTypes/alertType";
import AlertModal from "../../AlertModal";
import Footer from "../Footer";

interface DealerAddressType {
    flatPlotHouseNumber: string,
    areaSectorVillage: string
    landmark?: string
    postalCode: number,
    city: string,
    state: string,
    district: string,
}
interface DealerPropertyType {
    isApprovedByCityManager: {
        date: string
    },
    propertyType: 'agricultural' | 'commercial' | 'residential',
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
    price: number,
    propertyImagesUrl: string[],
    _id: string
}

interface DealerInfoType {
    email: string,
    propertyDealerName: string,
    logoUrl: string,
    firmName: string,
    id: string,
    contactNumber: number,
    address: DealerAddressType,
    averageCustomerRatings: number,
    numberOfReviews: number,
    threePropertiesAddedByPropertyDealer: DealerPropertyType[]
}

//This component is used to show customer messages to property dealer
const PropertyDetails: React.FC = () => {
    console.log('nav')
    const navigate = useNavigate()
    const location = useLocation()

    const searchParams = new URLSearchParams(location.search);
    const propertyId: string | null = searchParams.get('propertyId');
    const propertyType: string | null = searchParams.get('type');

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [dealerInfo, setDealerInfo] = useState<DealerInfoType | null>(null)

    useEffect(() => {
        if (!propertyId || (propertyType !== 'agricultural' && propertyType !== 'residential' && propertyType !== 'commercial')) {
            navigate('/')
            return
        }
    }, [propertyId, navigate, propertyType])

    const [spinner, setSpinner] = useState<boolean>(false)

    const [propertyData, setPropertyData] = useState<AgriculturalPropertyType | ResidentialPropertyType | CommercialPropertyType | null>(null)

    const fetchSelectedProperty = useCallback(async () => {
        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/reviewProperty?propertyId=${propertyId}`, {
                method: 'GET'
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                setPropertyData(data.property as AgriculturalPropertyType | ResidentialPropertyType | CommercialPropertyType)
                setDealerInfo(data.dealerInfo)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
        }
    }, [propertyId])

    useEffect(() => {
        fetchSelectedProperty()
    }, [fetchSelectedProperty])

    return (
        <Fragment>
            {alert.isAlertModal &&
                <AlertModal
                    message={alert.alertMessage}
                    type={alert.alertType}
                    routeTo={alert.routeTo}
                    alertModalRemover={() => {
                        setAlert({
                            isAlertModal: false,
                            alertType: null,
                            alertMessage: null,
                            routeTo: null
                        })
                    }} />}


            {spinner && <Spinner />}

            {propertyData && !spinner &&
                <div className={`flex flex-col place-items-center`}>

                    {propertyData.propertyImagesUrl &&
                        <ImageContainer
                            isClosed={propertyData.isClosed as boolean}
                            isLive={propertyData.isLive as boolean}
                            imagesUrl={propertyData.propertyImagesUrl} />}

                    <div className="flex flex-row w-full md:w-11/12 lg:w-9/12 gap-10 pb-10">

                        <div className="w-full flex flex-col px-3 sm:px-7 md:px-0 ">

                            <div className=" py-7 border-b shadow-b border-gray-300 flex flex-row justify-between ">
                                <div>
                                    <p className="text-xl font-semibold text-gray-700">{propertyData.location.name.plotNumber && `${propertyData.location.name.plotNumber}, `}{propertyData.location.name.village && `${capitalizeFirstLetterOfAString(propertyData.location.name.village)}, `}{propertyData.location.name.city && `${capitalizeFirstLetterOfAString(propertyData.location.name.city)}, `}{capitalizeFirstLetterOfAString(propertyData.location.name.district)}, {capitalizeFirstLetterOfAString(propertyData.location.name.state)}</p>
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

                                    <p className="flex flex-row font-bold text-lg text-gray-700">
                                        <FaRupeeSign className="mt-1" />{(propertyData as CommercialPropertyType | AgriculturalPropertyType | ResidentialPropertyType).price.toLocaleString('en-IN')}
                                    </p>
                                </div>
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

                        {dealerInfo && propertyId &&
                            <DealerInfoCard
                                dealerInfo={{
                                    logoUrl: dealerInfo.logoUrl,
                                    firmName: dealerInfo.firmName,
                                    id: dealerInfo.id,
                                    email: dealerInfo.email,
                                    propertyDealerName: dealerInfo.propertyDealerName,
                                    contactNumber: dealerInfo.contactNumber,
                                    address: dealerInfo.address,
                                    averageCustomerRatings: dealerInfo.averageCustomerRatings,
                                    numberOfReviews: dealerInfo.numberOfReviews
                                }}
                                propertyId={propertyId} />
                        }
                    </div>

                    {dealerInfo && dealerInfo.threePropertiesAddedByPropertyDealer.length > 0 &&
                        <div className="w-full bg-gray-100 flex flex-col gap-7 place-items-center py-12">
                            <p className="text-center px-5 text-2xl font-semibold text-gray-700">More properties from {capitaliseFirstAlphabetsOfAllWordsOfASentence(dealerInfo?.firmName)}</p>

                            <Link to={`/dealer-details?id=${dealerInfo.id}`} className="rounded-lg py-3 mb-2 px-4 border border-gray-400 hover:border-gray-600 bg-gray-50 font-semibold text-gray-700 hover:bg-white" >View dealers' profile</Link>

                            <div className="flex flex-row gap-5 overflow-x-auto w-fit max-w-screen px-3">
                                {dealerInfo.threePropertiesAddedByPropertyDealer.map(property => {
                                    return <PropertyCard
                                        key={property._id}
                                        property={property}
                                        resetProperty={() => setPropertyData(null)}
                                    />
                                })}
                            </div>
                        </div>}
                    <Footer />
                </div>}

        </Fragment>
    )
}
export default PropertyDetails