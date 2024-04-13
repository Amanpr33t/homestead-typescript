
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import AlertModal from "../AlertModal"
import { useLocation, useNavigate } from "react-router-dom";
import { AlertType } from "../../dataTypes/alertType";
import Spinner from "../Spinner";
import { MdContentPasteOff } from "react-icons/md";
import PropertyCard from "../property-dealer/PropertyCard";
import PropertyTypeDropdown from "../property-dealer/PropertyTypeDropdown";
import ReviewsContainer from "../user/ReviewsContainer";
import SignInReminderModal from "./SignInReminderModal";
import ContactDealerModal from "./ContactDealerModal";
import Footer from "./Footer";

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
    about?: string,
    propertyDealerName: string,
    email: string,
    contactNumber: number,
    address: {
        flatPlotHouseNumber: string,
        areaSectorVillage: string,
        landmark?: string,
        city: string,
        state: string,
        district: string
    }
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
    title: string
}

//This component is the home page for property dealer
const DealerPage: React.FC = () => {
    console.log('dealer page')
    const navigate = useNavigate()

    const reviewRef = useRef<HTMLDivElement>(null);

    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const searchParamsDealerId: string | null = searchParams.get('id')

    useEffect(() => {
        if (!searchParamsDealerId) {
            navigate('/', { replace: true })
        }
    }, [navigate, searchParamsDealerId])

    const [spinner, setSpinner] = useState<boolean>(true)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const authToken: string | null = localStorage.getItem("homestead-user-authToken")

    const [dealerInfo, setDealerInfo] = useState<DealerType>()

    const [showPropertiesForSale, setShowPropertiesForSale] = useState<boolean>(true)

    const [properties, setProperties] = useState<PropertyDetails[]>([])

    const [numberOfProperties, setNumberOfProperties] = useState<number>(0)//Number of properties live or closed properties in database. If the user selects a property type, it repersents total number of live or closed properties of that properpty type
    const [totalNumberOfProperties, setTotalNumberOfProperties] = useState<number>(0)//total number of properties in database. It stores total number of live properties or closed properties

    const [customersOwnReview, setCustomersOwnReview] = useState<CustomerReviewType | null>(null)
    const [customerReviews, setCustomerReviews] = useState<CustomerReviewType[]>([])

    const [averageOfRatingsFromCustomer, setAverageOfRatingsFromCustomer] = useState<number>(0)

    const [showLogoInFullScreen, setShowLogoInFullScreen] = useState<boolean>(false)

    const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState<boolean>(false)

    const [selectedPropertyTypeOptionDropdown, setSelectedPropertyTypeOptionDropdown] = useState<'agricultural' | 'residential' | 'commercial' | 'all' | null>(null)

    const [showDealerInfoModal, setShowContactDealerInfoModal] = useState<boolean>(false)

    const [showSignInReminderModal, setShowSignInReminderModal] = useState<boolean>(false)

    const fetchDataForHomePage = useCallback(async () => {
        setSpinner(true)
        try {
            let headers: any
            if (authToken) {
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            } else {
                headers = {
                    'Content-Type': 'application/json'
                }
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/dataForPropertyDealerPage?dealerId=${searchParamsDealerId}`, {
                method: 'GET',
                headers
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                setDealerInfo(data.dealerInfo)
                setProperties(data.liveProperties)
                setNumberOfProperties(data.numberOfProperties)
                setTotalNumberOfProperties(data.numberOfProperties)
                setCustomerReviews(data.reviewsFromOtherCustomers)
                setCustomersOwnReview(data.customersOwnReview)
                setAverageOfRatingsFromCustomer(data.averageCustomerRatings)
            } else {
                throw new Error('some error occured')
            }
        } catch (error) {
            setSpinner(false)
            navigate('/')
            return
        }
    }, [navigate, searchParamsDealerId, authToken])

    const fetchProperties = async (liveOrSold: 'live' | 'sold', skipProperties: boolean, propertyType?: 'agricultural' | 'residential' | 'commercial' | 'all') => {
        let url: string
        if (propertyType && propertyType !== 'all') {
            if (skipProperties) {
                url = `${process.env.REACT_APP_BACKEND_URL}/user/fetchPropertiesForDealerPage?liveOrSold=${liveOrSold}&propertyType=${propertyType}&skip=${properties.length}&dealerId=${searchParamsDealerId}`
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}/user/fetchPropertiesForDealerPage?liveOrSold=${liveOrSold}&propertyType=${propertyType}&dealerId=${searchParamsDealerId}`
            }
        } else {
            if (skipProperties) {
                url = `${process.env.REACT_APP_BACKEND_URL}/user/fetchPropertiesForDealerPage?liveOrSold=${liveOrSold}&skip=${properties.length}&dealerId=${searchParamsDealerId}`
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}/user/fetchPropertiesForDealerPage?liveOrSold=${liveOrSold}&dealerId=${searchParamsDealerId}`
            }
        }
        try {
            const response = await fetch(url, {
                method: 'GET'
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                if (liveOrSold === 'live' && !showPropertiesForSale) {
                    setShowPropertiesForSale(true)
                } else if (liveOrSold === 'sold' && showPropertiesForSale) {
                    setShowPropertiesForSale(false)
                }

                if (propertyType) {
                    setSelectedPropertyTypeOptionDropdown(propertyType)
                } else {
                    setSelectedPropertyTypeOptionDropdown(null)
                }

                setNumberOfProperties(data.numberOfProperties)
                setTotalNumberOfProperties(data.totalNumberOfProperties)

                if (skipProperties) {
                    setProperties(properties => [...properties, ...data.properties])
                } else {
                    setProperties(data.properties)
                }
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            return
        }
    }

    useEffect(() => {
        fetchDataForHomePage()
    }, [fetchDataForHomePage])

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

            {!spinner && showLogoInFullScreen &&
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-screen bg-black bg-opacity-70 backdrop-blur-lg z-50" onClick={() => {
                    setShowLogoInFullScreen(false)
                }}>
                    <img className="rounded-full w-72 h-72 border-2 border-gray-300" src={dealerInfo?.logoUrl} alt='' onClick={(e) => e.stopPropagation()} />
                </div>}

            {!spinner &&
                <div className={`${showLogoInFullScreen ? 'h-screen' : 'min-h-screen'} flex flex-col gap-5 pt-20 bg-gray-100 `} onClick={() => setShowPropertyTypeDropdown(false)}>

                    {/*The div shows dealer information and has an add property button */}
                    <div className="py-2 px-5 lg:px-16 xl:px-20 flex md:flex-row flex-col gap-10 justify-between border-t shadow-t bg-white">
                        {/*dealer information */}
                        <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
                            <img className="rounded-full w-20 h-20 border-2 border-gray-300 cursor-pointer" src={dealerInfo?.logoUrl} alt='' onClick={() => setShowLogoInFullScreen(true)} />
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

                        <div className="flex justify-center items-center pb-5 md:pb-0">
                            <button className="bg-red-500 hover:bg-red-700 rounded-xl w-full md:w-fit p-2 md:p-4 text-white text-lg font-semibold" onClick={() => {
                                if (authToken) {
                                    setShowContactDealerInfoModal(true)
                                } else {
                                    setShowSignInReminderModal(true)
                                }
                            }}>Contact dealer</button>
                        </div>
                    </div>

                    {/*The div shows proprties sold and properties up for sale, customer notifications and reviews  */}
                    <div className=" relative flex flex-row place-content-center gap-10 pb-20">

                        <div className="lg:w-7/12 xl:6/12 flex flex-col gap-5">

                            {/*The div shows properties sold and properties up for sale*/}
                            <div className="relative bg-white lg:rounded-2xl shadow">

                                {/*buttons to show sold properties and properties for sale */}
                                <div className="flex flex-row font-medium">
                                    <button className={`lg:rounded-tl-2xl py-3 w-1/2  text-gray-600  hover:underline border-b-2 ${showPropertiesForSale && 'border-b-2 border-red-500 px-5'} hover:border-b-2 hover:border-red-500`} onClick={() => {
                                        if (!showPropertiesForSale) {
                                            fetchProperties('live', false)
                                        }
                                    }}>Properties for sale</button>
                                    <button className={` lg:rounded-tr-2xl py-3 w-1/2  text-gray-600 hover:underline border-b-2 ${!showPropertiesForSale && 'border-b-2 border-red-500'} hover:border-b-2 hover:border-red-500`} onClick={() => {
                                        if (showPropertiesForSale) {
                                            fetchProperties('sold', false)
                                        }
                                    }}>Deals closed</button>
                                </div>

                                {/*dropdown to select property type */}
                                {totalNumberOfProperties > 0 &&
                                    < PropertyTypeDropdown
                                        propertyDropdownSetter={(input: boolean) => setShowPropertyTypeDropdown(input)}
                                        selectedPropertyTypeOptionDropdown={selectedPropertyTypeOptionDropdown}
                                        fetchProperties={fetchProperties}
                                        showPropertyTypeDropdown={showPropertyTypeDropdown}
                                        showPropertiesForSale={showPropertiesForSale}
                                    />}

                                {/*Message shown to user when no property is up for sale or no property has been sold */}
                                {properties.length === 0 &&
                                    <div className="flex  items-center flex-col px-2 overflow-y-auto h-72">
                                        <div className="flex flex-row mt-20 mb-2">
                                            <MdContentPasteOff className="text-5xl text-gray-500" />
                                            <p className="-ml-2 -mt-3  text-3xl h-fit w-5 text-center rounded-full text-red-500 font-bold">0</p>
                                        </div>
                                        <p className="font-semibold text-gray-500 text-lg text-center mx-2">{showPropertiesForSale ? `No ${selectedPropertyTypeOptionDropdown && selectedPropertyTypeOptionDropdown !== 'all' ? selectedPropertyTypeOptionDropdown : ''} properties are currently up for sale` : `No ${selectedPropertyTypeOptionDropdown && selectedPropertyTypeOptionDropdown !== 'all' ? selectedPropertyTypeOptionDropdown : ''} property deals have been closed yet`}</p>
                                    </div>}

                                {properties.length > 0 &&
                                    //Container that shows property up for sale or sold
                                    <div className="p-5 pt-20 flex flex-col gap-3 relative">
                                        <p className="text-gray-500 font-semibold">Showing {properties.length} of {numberOfProperties} {showPropertiesForSale ? 'properties for sale' : 'deals closed'}</p>
                                        <div className="flex flex-col gap-5 ">
                                            {properties.map(property => {
                                                return <div key={property._id}>
                                                    <PropertyCard
                                                        property={property}
                                                        liveOrSold={showPropertiesForSale ? 'live' : 'sold'}
                                                    />
                                                </div>
                                            })}
                                        </div>
                                    </div>}

                                {/*a button to show more properties */}
                                {((showPropertiesForSale && properties?.length < numberOfProperties) || (!showPropertiesForSale && properties?.length < numberOfProperties)) &&
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
                            {searchParamsDealerId &&
                                <div ref={reviewRef}>
                                    <ReviewsContainer
                                        customerReviews={customerReviews}
                                        customersOwnReview={customersOwnReview}
                                        customerReviewsSetter={(reviews) => setCustomerReviews(reviews)}
                                        customersOwnReviewSetter={(review) => setCustomersOwnReview(review)}
                                        dealerLogoUrl={dealerInfo?.logoUrl}
                                        averageOfRatingsFromCustomer={averageOfRatingsFromCustomer}
                                        averageOfRatingsFromCustomerSetter={(rating) => setAverageOfRatingsFromCustomer(rating)}
                                        dealerId={searchParamsDealerId}
                                    />
                                </div>}

                            {/*About dealer */}
                            {dealerInfo && dealerInfo.about &&
                                <div className="bg-white flex flex-col gap-3 rounded-2xl shadow p-5">
                                    <p className="font-bold text-xl text-gray-800">About</p>
                                    <p>{dealerInfo?.about}</p>
                                </div>}
                        </div>
                    </div>

                    <Footer />
                </div>}

            {!spinner && showSignInReminderModal &&
                <SignInReminderModal hideModal={() => setShowSignInReminderModal(false)} />}

            {!spinner && dealerInfo && showDealerInfoModal &&
                <ContactDealerModal
                    dealerInfo={{
                        firmName: dealerInfo?.firmName,
                        firmLogoUrl: dealerInfo?.logoUrl,
                        propertyDealerName: dealerInfo?.propertyDealerName,
                        address: dealerInfo?.address,
                        email: dealerInfo?.email,
                        contactNumber: dealerInfo?.contactNumber,
                        _id: dealerInfo?.id
                    }}
                    modalReset={() => setShowContactDealerInfoModal(false)} />
            }

        </Fragment >
    )
}
export default DealerPage