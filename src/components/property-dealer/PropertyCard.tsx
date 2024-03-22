
import { Fragment, useState } from "react"
import { FaRupeeSign } from "react-icons/fa";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { capitaliseFirstAlphabetsOfAllWordsOfASentence, capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";
import { formatDate } from "../../utils/dateFunctions";
import { GoDotFill } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { MdVerifiedUser } from "react-icons/md";

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
    title: string
}

interface PropsType {
    property: PropertyDetails,
    liveOrSold: 'live' | 'sold'
}

//This component is the home page for property dealer
const PropertyCard: React.FC<PropsType> = ({ property, liveOrSold }) => {
    const navigate = useNavigate()
    const locationUrl = useLocation();
    const {
        _id,
        propertyType,
        location,
        propertyImagesUrl,
        isApprovedByCityManager,
        price,
        title
    } = property
    const [indexOfImageToBeShown, setIndexOfImageToBeShown] = useState<number>(0)

    return (
        <Fragment>
            <div key={_id} className={` flex flex-col sm:flex-row rounded-xl border cursor-pointer sm:h-44`} onClick={() => {
                if (locationUrl.pathname.includes('property-dealer')) {
                    navigate(`/property-dealer/review-property?type=${propertyType}&id=${_id}`)
                } else {
                    navigate(`/property?type=${propertyType}&propertyId=${_id}`)
                }
            }}>

                <div className="relative w-full sm:w-fit">
                    <img
                        src={propertyImagesUrl[indexOfImageToBeShown]}
                        alt=''
                        className="w-full sm:w-96 h-auto max-h-72 sm:h-44 sm:max-h-none rounded-tl-xl rounded-bl-none sm:rounded-bl-xl rounded-tr-xl sm:rounded-tr-none"
                    />

                    <p className="absolute bottom-2 left-2 px-1 py-0.5 bg-white rounded-lg font-semibold text-gray-800 text-sm flex flex-row"><GoDotFill className={`mt-1 ${liveOrSold === 'sold' ? 'text-yellow-500' : 'text-red-500'}`} />{liveOrSold === 'sold' ? 'Closed' : 'Live'}</p>

                    {propertyImagesUrl.length > 1 && indexOfImageToBeShown > 0 && <button
                        className="text-center absolute top-1/2 left-1 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white  p-2 rounded-full font-extrabold"
                        disabled={indexOfImageToBeShown === 0}
                        onClick={(e) => {
                            e.stopPropagation()
                            setIndexOfImageToBeShown(index => index - 1)
                        }}
                    >
                        <MdArrowBackIosNew />
                    </button>}
                    {propertyImagesUrl.length > 1 && indexOfImageToBeShown + 1 < propertyImagesUrl.length && <button
                        className="text-center absolute top-1/2 right-1 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white  p-2 rounded-full font-extrabold"
                        disabled={indexOfImageToBeShown === propertyImagesUrl.length - 1}
                        onClick={(e) => {
                            e.stopPropagation()
                            setIndexOfImageToBeShown(index => index + 1)
                        }}
                    >
                        <MdArrowForwardIos />
                    </button>}
                </div>

                <div className="w-full flex flex-col gap-1.5 px-5 justify-center py-4 sm:py-1">

                    {liveOrSold === 'live' && price &&
                        <p className="flex flex-row font-bold text-lg text-gray-700">
                            <FaRupeeSign className="mt-1" />{price.toLocaleString('en-IN')}
                        </p>}

                    <p className="font-semibold text-gray-500 text-wrap max-h-12 overflow-hidden ">{capitalizeFirstLetterOfAString(title)}</p>

                    <p className="text-gray-500 text-wrap  overflow-hidden">{capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.district)}, {capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.state)}</p>

                    <p className="font-semibold text-sm text-gray-600">Listed {formatDate(isApprovedByCityManager.date)}</p>
                </div>
            </div>

        </Fragment >
    )
}
export default PropertyCard