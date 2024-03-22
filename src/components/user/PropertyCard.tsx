
import { Fragment, useState } from "react"
import { FaRupeeSign } from "react-icons/fa";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../utils/stringUtilityFunctions";
import { formatDate } from "../../utils/dateFunctions";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import ContactDealerModal from "./ContactDealerModal";
import SignInReminderModal from "./SignInReminderModal";

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
    price: number,
    title: string,
    fairValueOfProperty?: number,
    addedByPropertyDealer: string
}

interface DealerInfoType {
    firmName: string;
    firmLogoUrl: string,
    propertyDealerName: string,
    address: {
        flatPlotHouseNumber: string,
        areaSectorVillage: string,
        landmark?: string,
        city: string,
        state: string,
        district: string
    }
    email: string;
    contactNumber: number,
    _id: string
}

interface PropsType {
    property: PropertyDetails
}

//This component is the home page for property dealer
const PropertyCard: React.FC<PropsType> = ({ property }) => {
    const navigate = useNavigate()
    const {
        _id,
        location,
        propertyImagesUrl,
        isApprovedByCityManager,
        price,
        fairValueOfProperty
    } = property

    const authToken: string | null = localStorage.getItem("homestead-user-authToken")
    const [indexOfImageToBeShown, setIndexOfImageToBeShown] = useState<number>(0)

    const [dealerInfo, setDealerInfo] = useState<DealerInfoType | null>(null)
    const [signInReminderModal, setSignInReminderModal] = useState<boolean>(false)

    const fetchDealerDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/fetchDealerDetails?propertyId=${property._id}`, {
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
                setDealerInfo(data.dealerInfo)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            return
        }
    }

    return (
        <Fragment>
            <div key={_id} className={` flex flex-col sm:flex-row rounded-xl border cursor-pointer sm:h-44 shadow`} onClick={() => {
                navigate(`/property?propertyId=${property._id}&type=${property.propertyType}`)
            }}>

                <div className="relative w-full sm:w-fit">
                    <img
                        src={propertyImagesUrl[indexOfImageToBeShown]}
                        alt=''
                        className="w-full sm:w-96 h-auto max-h-72 sm:h-44 sm:max-h-none rounded-tl-xl rounded-bl-none sm:rounded-bl-xl rounded-tr-xl sm:rounded-tr-none"
                    />

                    <p className="absolute bottom-2 left-2 px-1 py-0.5 bg-white rounded-lg font-semibold text-gray-800 text-sm flex flex-row"><GoDotFill className={`mt-1 text-red-500`} />Live</p>

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

                <div className="relative w-full flex flex-col gap-1.5 px-5 justify-center py-4 sm:py-1">
                    {fairValueOfProperty && <p className="absolute right-2 top-2 bg-green-500 text-white py-1 px-2 rounded-3xl font-semibold">{(((fairValueOfProperty - price) / fairValueOfProperty) * 100).toFixed(0)}% cheaper</p>}

                    <p className="flex flex-row font-bold text-lg text-gray-700">
                        <FaRupeeSign className="mt-1" />{price.toLocaleString('en-IN')}
                    </p>

                    {/*<p className="font-semibold text-gray-500 text-wrap max-h-12 overflow-hidden ">{capitalizeFirstLetterOfAString(title)}</p>*/}

                    <p className="text-gray-500 text-wrap  overflow-hidden">{capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.district)}, {capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.state)}</p>

                    <p className="font-semibold text-sm text-gray-600">Listed {formatDate(isApprovedByCityManager.date)}</p>

                    <button className="w-fit text-blue-600 hover:text-blue-800 hover:underline font-semibold mt-3" onClick={(e) => {
                        e.stopPropagation()
                        if (authToken) {
                            fetchDealerDetails()
                        } else {
                            setSignInReminderModal(true)
                        }
                    }}>Contact property dealer</button>
                </div>
            </div>

            {dealerInfo &&
                <ContactDealerModal
                    dealerInfo={dealerInfo}
                    modalReset={() => setDealerInfo(null)}
                    propertyId={property._id} />
            }

            {signInReminderModal && <SignInReminderModal hideModal={() => setSignInReminderModal(false)} />}

        </Fragment >
    )
}
export default PropertyCard