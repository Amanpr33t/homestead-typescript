import { Fragment, useCallback, useEffect, useState } from "react"
import AlertModal from "../AlertModal"
import { AlertType } from "../../dataTypes/alertType";
import Spinner from "../Spinner";
import { LiaFilterSolid } from "react-icons/lia";
import HomePageFilterModal from "./HomePageFiltersModal";
import { MdContentPasteOff, MdCurrencyRupee } from "react-icons/md";
import PropertyCard from "./PropertyCard";
import { Link } from "react-router-dom";
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";
import { IoClose } from "react-icons/io5";

interface TopPropertyDealersType {
    _id: string,
    firmLogoUrl: string,
    district: string,
    state: string,
    firmName: string,
    averageRating: number
}

interface FiltersType {
    propertyType: ('agricultural' | 'residential' | 'commercial')[],
    commercialPropertyType: ('shop' | 'industrial')[],
    builtupOrEmpty: ('built-up' | 'empty')[],
    builtUpPropertyType: ('hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic')[],
    residentialPropertyType: ('house' | 'flat' | 'plot')[],
    state: string | null,
    district: string | null,
    price: {
        min: number | null,
        max: number | null
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
    price: number,
    title: string,
    fairValueOfProperty?: number,
    addedByPropertyDealer: string
}

//This component is the home page for property dealer
const UserHomePage: React.FC = () => {

    const authToken: string | null = localStorage.getItem("homestead-user-authToken")

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const [initialLoad, setInitialLoad] = useState<boolean>(true)

    const [properties, setProperties] = useState<PropertyDetails[]>([])
    const [totalNumberOfProperties, setTotalNumberOfProperties] = useState<number>(0)

    const [topPropertyDealers, setTopPropertyDealers] = useState<TopPropertyDealersType[]>()

    const [filtersModal, setFiltersModal] = useState<boolean>(false)

    const [isFilters, setIsFilters] = useState<boolean>(false)

    //states for filters
    const [propertyType, setPropertyType] = useState<('agricultural' | 'commercial' | 'residential')[]>([])
    const [commercialPropertyType, setCommercialPropertyType] = useState<('shop' | 'industrial')[]>([])
    const [builtupOrEmpty, setBuiltupOrEmpty] = useState<('built-up' | 'empty')[]>([])
    const [builtUpPropertyType, setBuiltUpPropertyType] = useState<('hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic')[]>([])
    const [residentialPropertyType, setResidentialPropertyType] = useState<('flat' | 'house' | 'plot')[]>([])
    const [state, setState] = useState('')
    const [district, setDistrict] = useState('')
    const [minPrice, setMinPrice] = useState<'' | number>('')
    const [maxPrice, setMaxPrice] = useState<'' | number>('')

    useEffect(() => {
        if (propertyType.length || commercialPropertyType.length || builtUpPropertyType.length || builtupOrEmpty.length || residentialPropertyType.length || state || district || typeof minPrice === 'number' || typeof maxPrice === 'number') {
            setIsFilters(true)
        } else {
            setIsFilters(false)
        }
    }, [propertyType, commercialPropertyType, builtUpPropertyType, builtupOrEmpty, residentialPropertyType, state, district, maxPrice, minPrice])

    const fetchDataForHomePage = useCallback(async () => {
        setError(false)
        setSpinner(true)
        let url: string
        if (authToken) {
            url = `${process.env.REACT_APP_BACKEND_URL}/user/homePageDataForSignedUser`
        } else {
            url = `${process.env.REACT_APP_BACKEND_URL}/user/homePageDataForUnsignedUser`
        }
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
                setSpinner(false)
                setInitialLoad(false)
                setProperties(data.bestDeals)
                setTopPropertyDealers(data.topDealers)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setError(true)
            return
        }
    }, [authToken])

    const applyFilters = async (filtersInput: FiltersType) => {
        const { propertyType, price, state, district } = filtersInput
        if (!propertyType.length && !price.min && !price.max && !state && !district) {
            return
        }
        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/fetchProperties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filters: filtersInput,
                    skip: properties.length
                })
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                setProperties(data.properties)
                setTotalNumberOfProperties(data.totalNumberOfProperties)
                setFiltersModal(false)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setFiltersModal(false)
            setAlert({
                isAlertModal: true,
                alertMessage: 'Some error occured. Try again.',
                alertType: 'warning',
                routeTo: null
            })
            return
        }
    }

    useEffect(() => {
        fetchDataForHomePage()
    }, [fetchDataForHomePage])

    const removeItemFromArray = (array: string[], input: string): string[] => {
        const index = array.findIndex(item => item === input);
        if (index !== -1) {
            const newArray = [...array]; // Create a copy of the array
            newArray.splice(index, 1); // Remove the element
            return newArray; // Return the updated array
        }
        return array
    }

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
                < div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <button type='button' className="text-red-500" onClick={fetchDataForHomePage}>Try again</button>
                </div>}

            {filtersModal &&
                <HomePageFilterModal
                    propertyTypeSetter={(input) => setPropertyType(input)}
                    commercialPropertyTypeSetter={(input) => setCommercialPropertyType}
                    builtupOrEmptySetter={(input) => setBuiltupOrEmpty(input)}
                    builtUpPropertyTypeSetter={(input) => setBuiltUpPropertyType(input)}
                    residentialPropertyTypeSetter={(input) => setResidentialPropertyType(input)}
                    stateSetter={(input) => setState(input)}
                    districtSetter={(input) => setDistrict(input)}
                    minPriceSetter={(input) => setMinPrice(input)}
                    maxPriceSetter={(input) => setMaxPrice(input)}
                    modalReset={() => setFiltersModal(false)}
                    applyFilters={(filtersInput: FiltersType) => applyFilters(filtersInput)}
                    propertyType={propertyType}
                    commercialPropertyType={commercialPropertyType}
                    builtupOrEmpty={builtupOrEmpty}
                    builtUpPropertyType={builtUpPropertyType}
                    residentialPropertyType={residentialPropertyType}
                    state={state}
                    district={district}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                />}

            {!initialLoad && !error &&
                <div className="lg:px-20 pt-20 w-full min-h-screen " >

                    <div className="relative w-full md:h-72 h-56 ">
                        <img className="bg-gray-100 w-full md:h-72 h-56 lg:rounded-lg" src='' alt='' />
                        <div className="absolute top-10 z-10 w-full sm:hidden flex flex justify-center">
                            <div className="w-fit flex flex-row items-center gap-1 border border-gray-400 hover:border-gray-600 cursor-pointer rounded-xl py-3 px-5 text-gray-700 font-semibold mr-2 bg-white" onClick={() => setFiltersModal(true)}>
                                <LiaFilterSolid className="text-2xl" />
                                <p>Apply filters</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex flex-row justify-center lg:justify-between gap-10 pb-5 ">

                        <div className="w-full mx-4 lg:mx-0 sm:w-10/12 lg:w-7/12 xl:6/12 flex flex-col gap-5">

                            {properties.length === 0 &&
                                <div className="flex  items-center flex-col px-2 overflow-y-auto h-72">
                                    <div className="flex flex-row mt-20 mb-2">
                                        <MdContentPasteOff className="text-5xl text-gray-500" />
                                        <p className="-ml-2 -mt-3  text-3xl h-fit w-5 text-center rounded-full text-red-500 font-bold">0</p>
                                    </div>
                                    <p className="font-semibold text-gray-500 text-lg text-center mx-2">No properties available</p>
                                </div>}

                            {properties.length > 0 &&
                                //Container that shows property up for sale or sold
                                <div className="py-7 flex flex-col gap-6 relative">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        {!isFilters && <p className="text-2xl font-bold text-gray-700">Best deals for you</p>}
                                        {isFilters && <p className="text-2xl font-bold text-gray-700">Showing {properties.length} out of {totalNumberOfProperties} properties</p>}
                                        <div className="hidden sm:flex flex-row items-center gap-1 border border-gray-400 hover:border-gray-600 cursor-pointer rounded-xl py-3 px-5 text-gray-700 font-semibold mr-2 hover:bg-gray-100" onClick={() => setFiltersModal(true)}>
                                            <LiaFilterSolid className="text-2xl" />
                                            <p>Filters</p>
                                        </div>
                                    </div>

                                    {isFilters &&
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-row gap-2 sm:gap-5 flex-wrap">
                                                {propertyType.length > 0 && propertyType.map(type => {
                                                    return <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1 ">
                                                        <p className="text-gray-800 cursor-auto">{capitalizeFirstLetterOfAString(type)}</p>
                                                        <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                            const updatedArray = removeItemFromArray(propertyType, type) as ('agricultural' | 'commercial' | 'residential')[]
                                                            setPropertyType(updatedArray)
                                                            applyFilters({
                                                                propertyType: updatedArray,
                                                                commercialPropertyType,
                                                                builtUpPropertyType,
                                                                builtupOrEmpty,
                                                                residentialPropertyType,
                                                                state: state || null,
                                                                district: district || null,
                                                                price: {
                                                                    min: minPrice || null,
                                                                    max: maxPrice || null
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                })}
                                                {residentialPropertyType.length > 0 && residentialPropertyType.map(type => {
                                                    return <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1 ">
                                                        <p className="text-gray-800 cursor-auto">{capitalizeFirstLetterOfAString(type)}</p>
                                                        <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                            const updatedArray = removeItemFromArray(residentialPropertyType, type) as ("house" | "flat" | "plot")[]
                                                            setResidentialPropertyType(updatedArray)
                                                            applyFilters({
                                                                propertyType,
                                                                commercialPropertyType,
                                                                builtUpPropertyType,
                                                                builtupOrEmpty,
                                                                residentialPropertyType: updatedArray,
                                                                state: state || null,
                                                                district: district || null,
                                                                price: {
                                                                    min: minPrice || null,
                                                                    max: maxPrice || null
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                })}
                                                {builtUpPropertyType.length > 0 && builtUpPropertyType.map(type => {
                                                    return <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1">
                                                        <p className="text-gray-800 cursor-auto">{capitalizeFirstLetterOfAString(type)}</p>
                                                        <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                            const updatedArray = removeItemFromArray(builtUpPropertyType, type) as ("hotel/resort" | "factory" | "banquet hall" | "cold store" | "warehouse" | "school" | "hospital/clinic")[]
                                                            setBuiltUpPropertyType(updatedArray)
                                                            applyFilters({
                                                                propertyType,
                                                                commercialPropertyType,
                                                                builtUpPropertyType: updatedArray,
                                                                builtupOrEmpty,
                                                                residentialPropertyType,
                                                                state: state || null,
                                                                district: district || null,
                                                                price: {
                                                                    min: minPrice || null,
                                                                    max: maxPrice || null
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                })}
                                                {commercialPropertyType.length > 0 && commercialPropertyType.map(type => {
                                                    return <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1">
                                                        <p className="text-gray-800 cursor-auto">{capitalizeFirstLetterOfAString(type)}</p>
                                                        <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                            const updatedArray = removeItemFromArray(commercialPropertyType, type) as ("shop" | "industrial")[]
                                                            setCommercialPropertyType(updatedArray)
                                                            applyFilters({
                                                                propertyType,
                                                                commercialPropertyType: updatedArray,
                                                                builtUpPropertyType,
                                                                builtupOrEmpty,
                                                                residentialPropertyType,
                                                                state: state || null,
                                                                district: district || null,
                                                                price: {
                                                                    min: minPrice || null,
                                                                    max: maxPrice || null
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                })}
                                                {state && <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1 ">
                                                    <p className="text-gray-800 cursor-auto">{capitalizeFirstLetterOfAString(state)}</p>
                                                    <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                        setState('')
                                                        applyFilters({
                                                            propertyType,
                                                            commercialPropertyType,
                                                            builtUpPropertyType,
                                                            builtupOrEmpty,
                                                            residentialPropertyType,
                                                            state: null,
                                                            district: district || null,
                                                            price: {
                                                                min: minPrice || null,
                                                                max: maxPrice || null
                                                            }
                                                        })
                                                    }} />
                                                </div>}
                                                {district && <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1 ">
                                                    <p className="text-gray-800 cursor-auto">{capitalizeFirstLetterOfAString(district)}</p>
                                                    <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                        setDistrict('')
                                                        applyFilters({
                                                            propertyType,
                                                            commercialPropertyType,
                                                            builtUpPropertyType,
                                                            builtupOrEmpty,
                                                            residentialPropertyType,
                                                            state: state || null,
                                                            district: null,
                                                            price: {
                                                                min: minPrice || null,
                                                                max: maxPrice || null
                                                            }
                                                        })
                                                    }} />
                                                </div>}
                                                {typeof maxPrice === 'number' && typeof minPrice === 'number' &&
                                                    <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1 text-gray-800 ">
                                                        <div className="flex flex-row gap-0 items-center">
                                                            <MdCurrencyRupee />
                                                            <p className="-ml-0.5 cursor-auto">{minPrice}</p>
                                                        </div>
                                                        to
                                                        <div className="flex flex-row gap-0 items-center">
                                                            <MdCurrencyRupee />
                                                            <p className="-ml-0.5 cursor-auto">{maxPrice}</p>
                                                        </div>
                                                        <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                            setMaxPrice('')
                                                            setMinPrice('')
                                                            applyFilters({
                                                                propertyType,
                                                                commercialPropertyType,
                                                                builtUpPropertyType,
                                                                builtupOrEmpty,
                                                                residentialPropertyType,
                                                                state: state || null,
                                                                district: district || null,
                                                                price: {
                                                                    min: null,
                                                                    max: null
                                                                }
                                                            })
                                                        }} />
                                                    </div>}
                                                {typeof maxPrice !== 'number' && typeof minPrice === 'number' &&
                                                    <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1 text-gray-800 cursor-default">
                                                        <div className="flex flex-row gap-0 items-center">
                                                            <MdCurrencyRupee />
                                                            <p className="-ml-0.5 cursor-auto">{minPrice} and above</p>
                                                        </div>
                                                        <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                            setMaxPrice('')
                                                            setMinPrice('')
                                                            applyFilters({
                                                                propertyType,
                                                                commercialPropertyType,
                                                                builtUpPropertyType,
                                                                builtupOrEmpty,
                                                                residentialPropertyType,
                                                                state: state || null,
                                                                district: district || null,
                                                                price: {
                                                                    min: null,
                                                                    max: null
                                                                }
                                                            })
                                                        }} />
                                                    </div>}
                                                {typeof maxPrice === 'number' && typeof minPrice !== 'number' &&
                                                    <div className="flex flex-row items-center rounded-3xl border-2 border-gray-300 px-3 py-2 w-fit gap-1 text-gray-800 cursor-default">
                                                        <div className="flex flex-row gap-0 items-center">
                                                            <p className="mr-1 cursor-auto">Up to</p>
                                                            <MdCurrencyRupee />
                                                            <p className="-ml-0.5 cursor-auto">{maxPrice}</p>
                                                        </div>
                                                        <IoClose className="text-2xl hover:text-red-500 cursor-pointer" onClick={() => {
                                                            setMaxPrice('')
                                                            setMinPrice('')
                                                            applyFilters({
                                                                propertyType,
                                                                commercialPropertyType,
                                                                builtUpPropertyType,
                                                                builtupOrEmpty,
                                                                residentialPropertyType,
                                                                state: state || null,
                                                                district: district || null,
                                                                price: {
                                                                    min: null,
                                                                    max: null
                                                                }
                                                            })
                                                        }} />
                                                    </div>}
                                            </div>
                                            <button className="bg-red-600 hover:bg-red-800 px-3 py-2 rounded-xl w-fit text-white font-semibold" onClick={() => {
                                                setPropertyType([])
                                                setCommercialPropertyType([])
                                                setResidentialPropertyType([])
                                                setBuiltUpPropertyType([])
                                                setBuiltupOrEmpty([])
                                                setDistrict('')
                                                setState('')
                                                setMinPrice('')
                                                setMaxPrice('')
                                                fetchDataForHomePage()
                                            }}>Clear filters</button>
                                        </div>}

                                    <div className="flex flex-col gap-5 ">
                                        {properties.map(property => {
                                            return <div key={Math.random()}>
                                                <PropertyCard
                                                    property={property}
                                                />
                                            </div>
                                        })}
                                    </div>
                                </div>}

                        </div>

                        <div className="mt-10 h-fit sticky top-24 w-80 hidden lg:flex flex-col border shadow-md rounded-lg">
                            <p className="text-center text-xl font-semibold text-white bg-gray-800 rounded-t-lg py-2">Top rated property dealers</p>
                            <div className="overflow-y-auto max-h-80">
                                {topPropertyDealers && topPropertyDealers.map(dealer => {
                                    return <div key={dealer._id} className="py-3 px-2 flex flex-row gap-3 border-y shadow">
                                        <img className="rounded-full w-16 h-16 border border-gray-300" src={dealer.firmLogoUrl} alt='' />
                                        <div className="flex flex-col">
                                            <Link to={`/dealer-details?id=${dealer._id}`} className=" font-semibold text-blue-600 hover:text-blue-800 text-wrap">{dealer.firmName.length > 25 ? `${dealer.firmName.substring(0, 25)}...` : dealer.firmName}</Link>
                                            <div className="flex flex-row items-center gap-1 -mt-1">
                                                <span className="text-2xl text-yellow-500 -mt-1">&#9733;</span>
                                                <p className="text-gray-700 text-sm font-semibold">{dealer.averageRating}/5</p>
                                            </div>
                                            <p className="text-gray-700 -mt-1">
                                                {capitalizeFirstLetterOfAString(dealer.district)}, {capitalizeFirstLetterOfAString(dealer.state)}
                                            </p>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center bg-gray-100 py-10 lg:hidden">
                        <div className=" h-fit w-full mx-4 lg:mx-0 sm:w-10/12  flex flex-col border shadow-md rounded-lg bg-white" >
                            <p className="text-center text-xl font-semibold text-white bg-gray-800 rounded-t-lg py-2">Top rated property dealers</p>
                            <div className="overflow-y-auto max-h-80">
                                {topPropertyDealers && topPropertyDealers.map(dealer => {
                                    return <div key={dealer._id} className="py-3 px-2 flex flex-row gap-3 border-y shadow">
                                        <img className="rounded-full w-16 h-16 border border-gray-300" src={dealer.firmLogoUrl} alt='' />
                                        <div className="flex flex-col">
                                            <Link to={`/dealer-details?id=${dealer._id}`} className=" font-semibold text-blue-600 hover:text-blue-800 text-wrap">{dealer.firmName.length > 25 ? `${dealer.firmName.substring(0, 25)}...` : dealer.firmName}</Link>
                                            <div className="flex flex-row items-center gap-1 -mt-1">
                                                <span className="text-2xl text-yellow-500 -mt-1">&#9733;</span>
                                                <p className="text-gray-700 text-sm font-semibold">{dealer.averageRating}/5</p>
                                            </div>
                                            <p className="text-gray-700 -mt-1">
                                                {capitalizeFirstLetterOfAString(dealer.district)}, {capitalizeFirstLetterOfAString(dealer.state)}
                                            </p>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                </div>}

        </Fragment >
    )
}
export default UserHomePage