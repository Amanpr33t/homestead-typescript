
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import AlertModal from "../AlertModal"
import { useNavigate } from "react-router-dom";
import { AlertType } from "../../dataTypes/alertType";
import CustomerNotifications from "./CustomerNotifications";
import Spinner from "../Spinner";
import { MdContentPasteOff } from "react-icons/md";
import PropertyCard from "./PropertyCard";
import { formatDate} from "../../utils/dateFunctions";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";

interface CustomerQueryType {
    propertyId: string,
    customerId: string,
    customerName: string,
    date: string,
    requestSeen: boolean
}

interface CustomerReviewType {
    review: string,
    rating: number,
    customerName: string,
    customerId: string,
    date: string,
    _id: string
}

interface DealerType {
    logoUrl: string,
    firmName: string,
    reraNumber: string,
    gstNumber: string,
    id: string,
    experience: number,
    about: string | null
}

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

//This component is the home page for property dealer
const PropertyDealerHomePage: React.FC = () => {
    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-property-dealer-authToken")
    const reviewRef = useRef<HTMLDivElement>(null);

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerQueryType | null>(null) //stores data about customer who has been selected
    const [dealerInfo, setDealerInfo] = useState<DealerType | undefined>()
    const [requestsFromCustomer, setRequestsFromCustomer] = useState<CustomerQueryType[]>([])//stores data about all customers who sent queries

    const [showPropertiesForSale, setShowPropertiesForSale] = useState<boolean>(true)
    const [indexUntilWhichReviewsToBeShown, setIndexUntilWhicReviewsToBeShown] = useState<number>(3)

    const [properties, setProperties] = useState<PropertyDetails[]>([])
    const [numberOfProperties, setNumberOfProperties] = useState<number>(0)

    const [showAllReviews, setShowAllReviews] = useState<boolean>(false)
    const [customerReviews, setCustomerReviews] = useState<CustomerReviewType[]>([])
    const [averageOfRatingsFromCustomer, setAverageOfRatingsFromCustomer] = useState<number>(0)

    const [showLogoInFullScreen, setShowLogoInFullScreen] = useState<boolean>(false)

    const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState<boolean>(false)

    const [selectedPropertyTypeOptionDropdown, setSelectedPropertyTypeOptionDropdown] = useState<'agricultural' | 'residential' | 'commercial' | 'all' | null>(null)

    const fetchDataForHomePage = useCallback(async () => {
        setError(false)
        setSpinner(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/homePageData`, {
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
                console.log(data.requestsFromCustomer)
                setRequestsFromCustomer(data.requestsFromCustomer)
                setDealerInfo(data.dealerInfo)
                setProperties(data.liveProperties)
                setNumberOfProperties(data.numberOfLiveProperties)
                setCustomerReviews(data.reviewsFromCustomer)
                setAverageOfRatingsFromCustomer(data.averageCustomerRatings)
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
            return
        }
    }, [authToken, navigate])

    const fetchProperties = async (liveOrSold: 'live' | 'sold', skipProperties: boolean, propertyType?: 'agricultural' | 'residential' | 'commercial' | 'all') => {
        let url: string
        if (propertyType && propertyType !== 'all') {
            if (skipProperties) {
                url = `${process.env.REACT_APP_BACKEND_URL}/property-dealer/fetchProperties?liveOrSold=${liveOrSold}&propertyType=${propertyType}&skip=${properties.length}`
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}/property-dealer/fetchProperties?liveOrSold=${liveOrSold}&propertyType=${propertyType}`
            }
        } else {
            if (skipProperties) {
                url = `${process.env.REACT_APP_BACKEND_URL}/property-dealer/fetchProperties?liveOrSold=${liveOrSold}&skip=${properties.length}`
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}/property-dealer/fetchProperties?liveOrSold=${liveOrSold}`
            }
        }
        setError(false)
        try {
            const response = await fetch(url, {
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
                if (propertyType) {
                    setSelectedPropertyTypeOptionDropdown(propertyType)
                } else {
                    setSelectedPropertyTypeOptionDropdown(null)
                }

                setNumberOfProperties(data.numberOfProperties)

                if (liveOrSold === 'live') {
                    setShowPropertiesForSale(true)
                } else if (liveOrSold === 'sold') {
                    setShowPropertiesForSale(false)
                }

                if (skipProperties) {
                    setProperties(properties => [...properties, ...data.properties])
                } else {
                    setProperties(data.properties)
                }
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
                return
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setError(true)
            return
        }
    }

    useEffect(() => {
        fetchDataForHomePage()
    }, [fetchDataForHomePage])

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const renderStarRating = (rating: number) => {
        const filledStars = Math.round(rating);
        const stars = [];

        for (let i = 0; i < 5; i++) {
            if (i < filledStars) {
                stars.push(<span className="text-2xl text-yellow-500" key={i}>&#9733;</span>); // Filled star
            } else {
                stars.push(<span className="text-2xl text-yellow-500" key={i}>&#9734;</span>); // Empty star
            }
        }

        return stars;
    };

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

            {spinner && !error && <Spinner />}

            {error && !spinner &&
                < div className="fixed top-36 w-full flex flex-col place-items-center ">
                    <p>Some error occured</p>
                    <button type='button' className="text-red-500" onClick={fetchDataForHomePage}>Try again</button>
                </div>}

            {!spinner && !error && showLogoInFullScreen && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-screen bg-black bg-opacity-70 backdrop-blur-lg z-50" onClick={() => {
                setShowLogoInFullScreen(false)
            }}>
                <img className="rounded-full w-72 h-72 border-2 border-gray-300" src={dealerInfo?.logoUrl} alt='' onClick={(e) => e.stopPropagation()} />
            </div>}

            {!spinner && !error &&
                <div className={`${showLogoInFullScreen ? 'h-screen' : 'min-h-screen'} flex flex-col gap-5 pt-16 bg-gray-100 `} onClick={() => setShowPropertyTypeDropdown(false)}>

                    {/*The div shows dealer information and has an add property button */}
                    <div className="px-5 lg:px-16 xl:px-20 flex md:flex-row flex-col justify-between md:rounded-2xl bg-white">
                        {/*dealer information */}
                        <div className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
                            <img className="rounded-full w-28 h-28 border-2 border-gray-300" src={dealerInfo?.logoUrl} alt='' onClick={() => setShowLogoInFullScreen(true)} />
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <p className="text-xl font-bold text-gray-700">{dealerInfo?.firmName}</p>
                                <div className="flex flex-row gap-2">
                                    <p className="text-gray-600 pr-2">{dealerInfo?.experience} years experience</p>
                                    {customerReviews && customerReviews.length > 0 && <>
                                        <span className="text-2xl text-yellow-500 -mt-1.5">&#9733;</span>
                                        <div className="flex flex-row">
                                            <p className="font-semibold text-gray-700">{averageOfRatingsFromCustomer}</p>
                                            <p className="font-semibold text-gray-500 hover:text-gray-700 cursor-pointer underline" onClick={() => {
                                                if (reviewRef.current) {
                                                    const offsetPosition = reviewRef.current.offsetTop;
                                                    // Scroll to the calculated offset position
                                                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                                                }
                                            }}>({customerReviews.length} reviews)</p>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>
                        {/*add property */}
                        <div className="flex justify-center items-center pb-5 md:pb-0">
                            <button className="bg-red-500 hover:bg-red-700 rounded-xl w-full md:w-fit p-2 md:p-6 text-white text-lg font-semibold">Add property</button>
                        </div>
                    </div>

                    {/*The div shows proprties sold and properties up for sale, customer notifications and reviews  */}
                    <div className=" relative flex flex-row place-content-center gap-10 pb-20">

                        <div className="lg:w-7/12 xl:6/12 flex flex-col gap-5">

                            {/*The div shows properties sold and properties up for sale*/}
                            <div className="relative bg-white lg:rounded-2xl shadow">

                                {/*buttons to show sold properties and properties for sale */}
                                <div className="flex flex-row font-medium">
                                    <button className={`lg:rounded-tl-2xl py-3 w-1/2 hover:bg-gray-700 text-gray-600 hover:text-white hover:underline border-b-2 ${showPropertiesForSale && 'border-b-2 border-red-500 px-5'}`} onClick={() => {
                                        if (!showPropertiesForSale) {
                                            fetchProperties('live', false)
                                        }
                                    }}>Properties for sale</button>
                                    <button className={` lg:rounded-tr-2xl py-3 w-1/2 hover:bg-gray-700 text-gray-600 hover:text-white hover:underline border-b-2 ${!showPropertiesForSale && 'border-b-2 border-red-500'}`} onClick={() => {
                                        if (showPropertiesForSale) {
                                            fetchProperties('sold', false)
                                        }
                                    }}>Deals closed</button>
                                </div>

                                {/*dropdown to select property type */}
                                {<div className={`z-30 absolute right-5 top-16  bg-white w-fit cursor-pointer text-gray-500  rounded-xl border border-gray-500 `} onClick={e => e.stopPropagation()}>
                                    <div className=" w-44 flex flex-row gap-3 bg-gray-50 rounded-xl p-3" onClick={() => setShowPropertyTypeDropdown(boolean => boolean === true ? false : true)}>
                                        <p className="font-semibold">{selectedPropertyTypeOptionDropdown ? capitalizeFirstLetterOfAString(selectedPropertyTypeOptionDropdown) : 'Type of property'}</p>
                                        {showPropertyTypeDropdown && <IoIosArrowUp className="absolute right-3 mt-1 text-gray-600 text-lg" />}
                                        {!showPropertyTypeDropdown && <IoIosArrowDown className="absolute right-3 mt-1 text-gray-600 text-lg" />}
                                    </div>
                                    {showPropertyTypeDropdown &&
                                        <div className={`w-44 z-50 bg-white rounded-b-xl border-t border-gray-500 `}>
                                            <p className="p-2 hover:bg-gray-50" onClick={() => {
                                                setShowPropertyTypeDropdown(false)
                                                fetchProperties(showPropertiesForSale ? 'live' : 'sold', false, 'agricultural')
                                            }}>Agricultural</p>
                                            <p className="p-2 hover:bg-gray-50" onClick={() => {
                                                setShowPropertyTypeDropdown(false)
                                                fetchProperties(showPropertiesForSale ? 'live' : 'sold', false, 'residential')
                                            }}>Residential</p>
                                            <p className="p-2 hover:bg-gray-50" onClick={() => {
                                                setShowPropertyTypeDropdown(false)
                                                fetchProperties(showPropertiesForSale ? 'live' : 'sold', false, 'commercial')
                                            }}>Commercial</p>
                                            <p className="p-2 hover:bg-gray-50 rounded-b-xl" onClick={() => {
                                                setShowPropertyTypeDropdown(false)
                                                fetchProperties(showPropertiesForSale ? 'live' : 'sold', false, 'all')
                                            }}>All</p>
                                        </div>}
                                    <div></div>
                                </div>}

                                {/*Message shown to user when no property is up for sale or no property has been sold */}
                                {properties.length === 0 &&
                                    <div className="flex justify-center items-center flex-col pt-2 px-2 overflow-y-auto h-72">
                                        <div className="flex flex-row">
                                            <MdContentPasteOff className="text-5xl text-gray-500" />
                                            <p className="-ml-2 -mt-3 text-3xl h-fit w-5 text-center rounded-full text-red-500 font-bold">0</p>
                                        </div>
                                        <p className="font-semibold text-gray-500 text-lg text-center mx-2">{showPropertiesForSale ? `No ${selectedPropertyTypeOptionDropdown && selectedPropertyTypeOptionDropdown !== 'all' ? selectedPropertyTypeOptionDropdown : ''} properties are currently up for sale` : `No ${selectedPropertyTypeOptionDropdown && selectedPropertyTypeOptionDropdown !== 'all' ? selectedPropertyTypeOptionDropdown : ''} property deals have been closed yet`}</p>
                                    </div>}

                                {properties.length > 0 &&
                                    <div className="p-5 pt-20 flex flex-col gap-3 relative">

                                        {/*Container that shows property up for sale*/}
                                        {showPropertiesForSale && <>
                                            <p className="text-gray-500 font-semibold">Showing {properties.length} of {numberOfProperties} properties for sale</p>
                                            <div className="flex flex-col gap-5 ">
                                                {properties.map(property => {
                                                    return <div key={property._id}>
                                                        <PropertyCard property={property} liveOrSold={'live'} />
                                                    </div>
                                                })}
                                            </div>
                                        </>}

                                        {/*container that shows property sold */}
                                        {!showPropertiesForSale && <>
                                            <p className="text-gray-500 font-semibold">Showing {properties.length} of {numberOfProperties} deals closed</p>
                                            <div className="flex flex-col gap-5 ">
                                                {properties.map(property => {
                                                    return <div key={property._id}>
                                                        <PropertyCard property={property} liveOrSold={'sold'} />
                                                    </div>
                                                })}
                                            </div>
                                        </>}
                                    </div>}

                                {/*a button to show more properties */}
                                {properties?.length < numberOfProperties &&
                                    <div className="flex justify-center pb-5">
                                        <button className="border p-3 rounded-lg border-gray-500 font-semibold hover:border-gray-800 hover:bg-gray-100 text-gray-700" onClick={() => {
                                            if (selectedPropertyTypeOptionDropdown) {
                                                fetchProperties(showPropertiesForSale ? 'live' : 'sold', true, selectedPropertyTypeOptionDropdown)
                                            } else {
                                                fetchProperties(showPropertiesForSale ? 'live' : 'sold', true)
                                            }
                                        }}>Show more listings</button>
                                    </div>}

                            </div>

                            {/*The div container is used to show reviews */}
                            {customerReviews && customerReviews.length > 0 &&
                                <div className="bg-white flex flex-col gap-3 rounded-2xl shadow p-5" ref={reviewRef}>
                                    <p className="font-bold text-xl text-gray-800">Reviews</p>
                                    <div className="flex items-center justify-start gap-3">
                                        <img className="rounded-full w-16 h-16 border-2 border-gray-300" src={dealerInfo?.logoUrl} alt='' />
                                        <div className="flex flex-row gap-1">
                                            {averageOfRatingsFromCustomer > 0 && <span className="text-2xl text-yellow-500 -mt-1">&#9733;</span>}
                                            {averageOfRatingsFromCustomer > 0 && <div className="flex flex-row gap-1">
                                                <p className="font-semibold text-gray-700 text-lg">{averageOfRatingsFromCustomer}</p>
                                                <p className="font-semibold text-gray-500  text-lg ">({customerReviews.length} reviews)</p>
                                            </div>}
                                        </div>
                                    </div>
                                    {customerReviews.slice(0, indexUntilWhichReviewsToBeShown).map(item => {
                                        return <div key={item._id} className="bg-gray-100 p-3 rounded-xl">
                                            <div className="flex flex-row">
                                                {renderStarRating(item.rating)}
                                                <p className="ml-2 mt-1.5 text-gray-700 font-semibold">{item.rating}.0</p>
                                            </div>
                                            <p className="mb-2 text-gray-700 font-semibold">{formatDate(item.date)}</p>
                                            <p>{item.review}</p>
                                        </div>
                                    })}
                                    {customerReviews.length > 3 &&
                                        <div className="flex justify-center mt-2">
                                            <button
                                                className="border p-3 rounded-lg border-gray-500 font-semibold hover:border-gray-800 hover:bg-gray-100 text-gray-700"
                                                onClick={() => {
                                                    if (indexUntilWhichReviewsToBeShown === 3) {
                                                        setIndexUntilWhicReviewsToBeShown(customerReviews.length)
                                                    } else {
                                                        setIndexUntilWhicReviewsToBeShown(3)
                                                    }
                                                }}>
                                                {indexUntilWhichReviewsToBeShown === 3 ? `Show all ${customerReviews.length} reviews` : 'Show less reviews'}
                                            </button>
                                        </div>}
                                </div>}

                            {/*About dealer */}
                            <div className="bg-white flex flex-col gap-3 rounded-2xl shadow p-5">
                                <p className="font-bold text-xl text-gray-800">About</p>
                                <p>{dealerInfo?.about}</p>
                            </div>
                        </div>

                        <div className="h-fit sticky top-20 w-80 hidden lg:flex ">
                            <CustomerNotifications
                                requestsFromCustomer={requestsFromCustomer}
                            />
                        </div>
                    </div>
                </div>}

        </Fragment >
    )
}
export default PropertyDealerHomePage