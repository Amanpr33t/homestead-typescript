
import { Fragment, useState } from "react"
import { FaRupeeSign } from "react-icons/fa";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { capitaliseFirstAlphabetsOfAllWordsOfASentence, capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions";
import { formatDate } from "../../../utils/dateFunctions";
import { useNavigate } from "react-router-dom";

interface PropertyType {
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

interface PropsType {
    property: PropertyType
    resetProperty: () => void
}

//This component is the home page for property dealer
const PropertyCard: React.FC<PropsType> = ({ property, resetProperty }) => {
    const navigate = useNavigate()
    const {
        _id,
        propertyType,
        location,
        propertyImagesUrl,
        price,
        isApprovedByCityManager
    } = property

    const [indexOfImageToBeShown, setIndexOfImageToBeShown] = useState<number>(0)

    return (
        <Fragment>
            <div key={_id} className={`w-fit h-fit flex flex-col rounded-xl border cursor-pointer flex-shrink-0 bg-white`} onClick={() => {
                resetProperty()
                navigate(`/property?propertyId=${_id}&type=${propertyType}`)
            }}>

                <div className="relative w-fit h-fit">
                    <img
                        src={propertyImagesUrl[indexOfImageToBeShown]}
                        alt=''
                        className="w-72 h-48 rounded-t-xl"
                    />

                    {propertyImagesUrl.length > 1 && indexOfImageToBeShown > 0 && <button
                        className="text-center absolute top-1/2 left-1 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white p-2 rounded-full font-extrabold"
                        disabled={indexOfImageToBeShown === 0}
                        onClick={(e) => {
                            e.stopPropagation()
                            setIndexOfImageToBeShown(index => index - 1)
                        }}
                    >
                        <MdArrowBackIosNew />
                    </button>}
                    {propertyImagesUrl.length > 1 && indexOfImageToBeShown + 1 < propertyImagesUrl.length && <button
                        className="text-center absolute top-1/2 right-1 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white p-2 rounded-full font-extrabold"
                        disabled={indexOfImageToBeShown === propertyImagesUrl.length - 1}
                        onClick={(e) => {
                            e.stopPropagation()
                            setIndexOfImageToBeShown(index => index + 1)
                        }}
                    >
                        <MdArrowForwardIos />
                    </button>}
                </div>

                <div className="w-fit flex flex-col justify-center p-4 ">

                    <p className="flex flex-row font-semibold text-gray-700">
                        <FaRupeeSign className="mt-1" />{price.toLocaleString('en-IN')}
                    </p>

                    <p className="text-gray-500 text-wrap">{capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.district)}, {capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.state)}</p>

                    <p className="text-gray-500">{capitalizeFirstLetterOfAString(propertyType)} property</p>

                    <p className="font-semibold text-gray-600">Listed {formatDate(isApprovedByCityManager.date)}</p>
                </div>
            </div>

        </Fragment >
    )
}
export default PropertyCard