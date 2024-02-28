
import { Fragment, useState } from "react"
import { FaRupeeSign } from "react-icons/fa";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../utils/stringUtilityFunctions";
import { formatDate } from "../../utils/dateFunctions";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

interface PropertyDetails {
    _id: string,
    propertyType: 'residential' | 'commercial' | 'agricultural',
    location: {
        name: {
            plotNumber?: string,
            village?: string,
            city?: string,
            tehsil?: string,
            district: string,
            state: string,
        }
    },
    propertyImagesUrl: string[],
    isApprovedByCityManager: {
        date: string
    },
    price?: number,
    priceData?: {
        fixed: number,
        range: {
            from: number,
            to: number
        }
    },
    title: string
}

interface PropsType {
    property: PropertyDetails,
    liveOrSold: 'live' | 'sold'
}

//This component is the home page for property dealer
const PropertyCard: React.FC<PropsType> = ({ property, liveOrSold }) => {
    const navigate = useNavigate()
    const {
        _id,
        propertyType,
        location,
        propertyImagesUrl,
        isApprovedByCityManager,
        price,
        priceData,
        title
    } = property
    const [indexOfImageToBeShown, setIndexOfImageToBeShown] = useState<number>(0)

    return (
        <Fragment>
            <div key={_id} className={`flex flex-col sm:flex-row rounded-xl border cursor-pointer sm:h-44`} onClick={() => {
                navigate(`/property-dealer/review-property?type=${propertyType}&id=${_id}`)
            }}>

                <div className="relative w-full sm:w-64">
                    <img
                        src={propertyImagesUrl[indexOfImageToBeShown]}
                        alt=''
                        className="w-full sm:w-96 h-auto max-h-72 sm:h-44 rounded-tl-xl rounded-bl-none sm:rounded-bl-xl rounded-tr-xl sm:rounded-tr-none"
                    />

                    {liveOrSold === 'sold' && <p className="absolute bottom-2 left-2 px-1 py-0.5 bg-white rounded-lg font-semibold text-gray-800 text-sm flex flex-row"><GoDotFill className="mt-1 text-yellow-500" />Closed</p>}

                    {propertyImagesUrl.length > 1 && <button
                        className="text-center absolute top-1/2 left-1 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full font-extrabold"
                        disabled={indexOfImageToBeShown === 0}
                        onClick={() => {
                            setIndexOfImageToBeShown(index => index - 1)
                        }}
                    >
                        <MdArrowBackIosNew />
                    </button>}
                    {propertyImagesUrl.length > 1 && <button
                        className="text-center absolute top-1/2 right-1 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full font-extrabold"
                        disabled={indexOfImageToBeShown === propertyImagesUrl.length - 1}
                        onClick={() => {
                            setIndexOfImageToBeShown(index => index + 1)
                        }}
                    >
                        <MdArrowForwardIos />
                    </button>}
                </div>

                <div className="w-full flex flex-col gap-1.5 px-5 justify-center py-4 sm:py-1">

                    {liveOrSold === 'live' && (propertyType === 'commercial' || propertyType === 'agricultural') && price &&
                        <p className="flex flex-row font-bold text-lg text-gray-700">
                            <FaRupeeSign className="mt-1" />{price.toLocaleString('en-IN')}
                        </p>}

                    {liveOrSold === 'live' && propertyType === 'residential' && priceData && priceData.fixed &&
                        <p className="flex flex-row font-bold text-lg text-gray-700">
                            <FaRupeeSign className="mt-1" />{priceData.fixed.toLocaleString('en-IN')}
                        </p>}

                    {liveOrSold === 'live' && propertyType === 'residential' && priceData && !priceData.fixed &&
                        <div className="flex flex-row font-bold text-lg text-gray-700">
                            <div className="flex flex-row">
                                <FaRupeeSign className="mt-1" />
                                {priceData?.range.from.toLocaleString('en-IN')}
                            </div>
                            <p className="px-2">to</p>
                            <div className="flex flex-row">
                                <FaRupeeSign className="mt-1" />
                                {priceData?.range.to.toLocaleString('en-IN')}
                            </div>
                        </div>}

                    <p className="font-semibold text-gray-500 text-wrap max-h-12 overflow-hidden ">{title}</p>

                    <p className="text-gray-500 text-wrap  overflow-hidden">{capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.district)}, {capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.state)}</p>

                    <p className="font-semibold text-sm text-gray-600">Listed {formatDate(isApprovedByCityManager.date)}</p>
                </div>
            </div>

        </Fragment >
    )
}
export default PropertyCard