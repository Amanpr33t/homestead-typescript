
import { Fragment, useEffect, useState, useCallback } from "react"
import AlertModal from "../AlertModal"
import { useNavigate } from "react-router-dom";
import { TbFilterSearch } from "react-icons/tb";
import { formatDate } from "../../utils/dateFunctions";
import { capitalizeFirstLetterOfAString } from "../../utils/stringUtilityFunctions";
import Spinner from "../Spinner";

//This component is used to see allt he properties previously added by the dealer
function PropertiesPreviouslyAdded() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-property-dealer-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/property-dealer/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })
    const [spinner, setSpinner] = useState(true)

    const [propertiesAddedByDealer, setPropertiesAddedByDealer] = useState(null) //Stores all the properties previously addded

    const [stateFilter, setStateFilter] = useState('') //Used to set state for filter   
    const [propertyAddedYearFilter, setPropertyAddedYearFilter] = useState('')//Used to set year for filter 
    const [propertyTypeFilter, setPropertyTypeFilter] = useState('')//Used to set property type for filter 
    const [propertyStatusFilter, setPropertyStatusFilter] = useState('')//Used to set status for filter 

    const [showFiltersContainer, setShowFiltersContainer] = useState(false)//Used to hide and show filters container for small screens

    const states = ['Chandigarh', 'Punjab']
    const arrayOfYears = [2024, 2025, 2026]

    const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/property-dealer/fetchPropertiesAdded` //Base url to fetch properties

    //This function is used to fetch all proerties added by a property dealer
    const fetchProperties = useCallback(async (urlForFilters) => {
        try {
            setSpinner(true)
            const response = await fetch(urlForFilters, {
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
                setShowFiltersContainer(false)
                setPropertiesAddedByDealer(data.properties)
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-dealer-authToken")
                navigate('/property-dealer/signIn', { replace: true })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured',
                routeTo: '/property-dealer'
            })
            return
        }
    }, [authToken, navigate])

    useEffect(() => {
        fetchProperties(baseUrl)
    }, [fetchProperties, baseUrl])

    //The function is used to prepare url based on the filters selected by the user
    const filterSetter = async (filters) => {
        let url = `${baseUrl}?`
        const { type, state, status, year } = filters
        if (type || state || status || year) {
            if (type) {
                url = url + `propertyType=${type}`
            }
            if (state) {
                if (url === '?') {
                    url = url + `state=${state}`
                } else {
                    url = url + `&state=${state}`
                }
            }
            if (year) {
                if (url === '?') {
                    url = url + `year=${year}`
                } else {
                    url = url + `&year=${year}`
                }
            }
            if (status) {
                if (url === '?') {
                    url = url + `status=${status}`
                } else {
                    url = url + `&status=${status}`
                }
            }
            await fetchProperties(url)
        } else {
            await fetchProperties(baseUrl)
        }
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
                            alertType: '',
                            alertMessage: '',
                            routeTo: null
                        })
                    }} />}

            {spinner && <Spinner />}


            <div className={`${alert.isAlertModal || spinner ? 'blur' : ''} pt-20  bg-gray-100 min-h-screen `}>

                {/*Used to show a home button that takes the user to property dealer home page*/}
                {!showFiltersContainer &&
                    <div className='fixed w-full top-20 pt-2 pb-2 pl-2 z-20'>
                        <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/property-dealer', { replace: true })}>Home</button>
                    </div>}

                {/*Used to show a back button for small screens. It is shown when the filters container is shown*/}
                {showFiltersContainer &&
                    <div className="w-full flex content-start z-50">
                        <button type='button' className="bg-green-500 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 h-8  " onClick={() => {
                            setShowFiltersContainer(false)
                            fetchProperties(baseUrl)
                        }}>Back</button>
                    </div>}

                {/*Filters button for small screens*/}
                {!showFiltersContainer &&
                    <div className="flex md:hidden mt-6 w-full justify-center">
                        <div className=" flex flex-row place-content-center gap-1 w-fit bg-white rounded p-1 border border-gray-300 cursor-pointer" onClick={() => {
                            setPropertyAddedYearFilter('')
                            setPropertyTypeFilter('')
                            setPropertyStatusFilter('')
                            setStateFilter('')
                            setShowFiltersContainer(true)
                        }}>
                            <TbFilterSearch className="text-3xl text-blue-500 cursor-pointer" />
                            <p className="text-lg font-semibold text-gray-600 cursor-pointer">Filters</p>
                        </div>
                    </div>}

                {/*Filters container for small screens*/}
                {showFiltersContainer &&
                    <div className="w-full md:hidden flex justify-center">
                        <div className={`w-11/12 h-fit mt-3 bg-white p-4 flex flex-col gap-5 rounded-lg } `}>
                            <div className="flex flex-row place-content-center gap-1 ">
                                <TbFilterSearch className="text-3xl text-blue-500" />
                                <p className="text-lg font-semibold text-gray-600">Filters</p>
                            </div>

                            {/*property type */}
                            <div>
                                <p className="text-lg font-semibold text-gray-600 mb-2">Property type</p>
                                <div className="flex flex-col gap-1.5">
                                    {['Agricultural', 'Residential', 'Commercial'].map(type => {
                                        return <div className="ml-6 " key={type}>
                                            <input className="mr-2 cursor-pointer" type="radio" id={type} name='propertyType' onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPropertyTypeFilter(type)
                                                }
                                            }} />
                                            <label className="text-lg text-gray-600 cursor-pointer" htmlFor={type}>{type}</label>
                                        </div>
                                    })}
                                </div>
                            </div>

                            {/*State */}
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold text-gray-600" htmlFor="state">State</label>
                                <select className='w-fit border-2 border-gray-400 p-1 rounded cursor-pointer' name="state" id="state" value={stateFilter} onChange={e => {
                                    setStateFilter(e.target.value)
                                }}>
                                    <option className="font-semibold" value="" >None</option>
                                    {states.map(state => {
                                        return <option key={state} value={state}>{state}</option>
                                    })}
                                </select>
                            </div>

                            {/*Year in which property was added*/}
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold text-gray-600" htmlFor="propertyAddedYearFilter">Property added in year</label>
                                <select className="w-fit border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="propertyAddedYearFilter" id="propertyAddedYearFilter" value={propertyAddedYearFilter} onChange={e => {
                                    setPropertyAddedYearFilter(e.target.value)
                                }}>
                                    <option className="font-semibold" value=''>None</option>
                                    {arrayOfYears.map(year => <option key={year} value={year}>{year}</option>)}
                                </select>
                            </div>

                            {/*active or inactive status*/}
                            <div>
                                <p className="text-lg font-semibold text-gray-600 mb-1">Status</p>
                                <div className="flex flex-row gap-1">
                                    {['Active', 'Inactive'].map(type => {
                                        return <div className="ml-6 " key={type}>
                                            <input className="mr-2 cursor-pointer" type="radio" id={type} name='status' onChange={() => setPropertyStatusFilter(type.toLowerCase())} />
                                            <label className="text-lg text-gray-600 cursor-pointer" htmlFor={type}>{capitalizeFirstLetterOfAString(type)}</label>
                                        </div>
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-center mt-4">
                                {!spinner && <button type='button' className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold text-lg rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => {
                                    if (propertyTypeFilter || stateFilter || propertyAddedYearFilter || propertyStatusFilter) {
                                        filterSetter({
                                            type: propertyTypeFilter,
                                            state: stateFilter,
                                            status: propertyStatusFilter,
                                            year: propertyAddedYearFilter
                                        })
                                    }
                                }}>Apply filters</button>}
                                {spinner && <div className="w-full bg-blue-500 rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1 cursor-pointer">
                                    <div className="animate-spin text-white font-bold text-xl">&#9696;</div>
                                </div>}
                            </div>

                        </div>
                    </div >}

                {/*Container to show selected filters. Will only be shown for small screens*/}
                {!showFiltersContainer && (propertyTypeFilter || stateFilter || propertyAddedYearFilter || propertyStatusFilter) &&
                    <div className="md:hidden flex flex-wrap justify-center gap-2 mt-7">
                        {propertyTypeFilter &&
                            <div className="bg-blue-500 text-white font-semibold text-lg p-0.5 pl-3 pr-3 flex flex-row gap-2 rounded">
                                <p>{capitalizeFirstLetterOfAString(propertyTypeFilter)}</p>
                                <p className="cursor-pointer" onClick={() => {
                                    setPropertyTypeFilter('')
                                    filterSetter({
                                        type: '',
                                        state: stateFilter,
                                        status: propertyStatusFilter,
                                        year: propertyAddedYearFilter
                                    })
                                }}>X</p>
                            </div>}
                        {propertyAddedYearFilter &&
                            <div className="bg-blue-500 text-white font-semibold text-lg p-0.5 pl-3 pr-3 flex flex-row gap-2 rounded">
                                <p>{capitalizeFirstLetterOfAString(propertyAddedYearFilter)}</p>
                                <p className="cursor-pointer" onClick={() => {
                                    setPropertyAddedYearFilter('')
                                    filterSetter({
                                        type: propertyTypeFilter,
                                        state: stateFilter,
                                        status: propertyStatusFilter,
                                        year: ''
                                    })
                                }}>X</p>
                            </div>}
                        {propertyStatusFilter &&
                            <div className="bg-blue-500 text-white font-semibold text-lg p-0.5 pl-3 pr-3 flex flex-row gap-2 rounded">
                                <p>{capitalizeFirstLetterOfAString(propertyStatusFilter)}</p>
                                <p className="cursor-pointer" onClick={() => {
                                    setPropertyStatusFilter('')
                                    filterSetter({
                                        type: propertyTypeFilter,
                                        state: stateFilter,
                                        status: '',
                                        year: propertyAddedYearFilter
                                    })
                                }}>X</p>
                            </div>}
                        {stateFilter &&
                            <div className="bg-blue-500 text-white font-semibold text-lg p-0.5 pl-3 pr-3 flex flex-row gap-2 rounded">
                                <p>{capitalizeFirstLetterOfAString(stateFilter)}</p>
                                <p className="cursor-pointer" onClick={() => {
                                    setStateFilter('')
                                    filterSetter({
                                        type: propertyTypeFilter,
                                        state: '',
                                        status: propertyStatusFilter,
                                        year: propertyAddedYearFilter
                                    })
                                }}>X</p>
                            </div>}
                    </div>
                }

                {<div className="flex flex-row place-content-center gap-5 pt-5 md:10 pb-20">

                    {/*Filters container for large screen*/}
                    <div className={`${spinner ? 'blur' : ''} hidden w-80 h-fit mt-16 bg-white p-4 md:flex flex-col gap-5 rounded-lg } `}>
                        <div className="flex flex-row place-content-center gap-1 ">
                            <TbFilterSearch className="text-3xl text-blue-500" />
                            <p className="text-lg font-semibold text-gray-600">Filters</p>
                        </div>

                        {/*property type */}
                        <div>
                            <p className="text-lg font-semibold text-gray-600 mb-2">Property type</p>
                            <div className="flex flex-col gap-1.5">
                                {['Agricultural', 'Residential', 'Commercial'].map(type => {
                                    return <div className="ml-6 " key={type}>
                                        <input className="mr-2 cursor-pointer" type="radio" id={type} name='propertyType' onChange={(e) => {
                                            if (e.target.checked) {
                                                setPropertyTypeFilter(type)
                                            }
                                        }} />
                                        <label className="text-lg text-gray-600 cursor-pointer" htmlFor={type}>{type}</label>
                                    </div>
                                })}
                            </div>
                        </div>

                        {/*State */}
                        <div className="flex flex-col gap-1">
                            <label className="text-lg font-semibold text-gray-600" htmlFor="state">State</label>
                            <select className='w-fit border-2 border-gray-400 p-1 rounded cursor-pointer' name="state" id="state" value={stateFilter} onChange={e => {
                                setStateFilter(e.target.value)
                            }}>
                                <option className="font-semibold" value="" >None</option>
                                {states.map(state => {
                                    return <option key={state} value={state}>{state}</option>
                                })}
                            </select>
                        </div>

                        {/*Year in which property was added*/}
                        <div className="flex flex-col gap-1">
                            <label className="text-lg font-semibold text-gray-600" htmlFor="propertyAddedYearFilter">Property added in year</label>
                            <select className="w-fit border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="propertyAddedYearFilter" id="propertyAddedYearFilter" value={propertyAddedYearFilter} onChange={e => {
                                setPropertyAddedYearFilter(e.target.value)
                            }}>
                                <option className="font-semibold" value=''>None</option>
                                {arrayOfYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>

                        {/*active or inactive status*/}
                        <div>
                            <p className="text-lg font-semibold text-gray-600 mb-1">Status</p>
                            <div className="flex flex-row gap-1">
                                {['Active', 'Inactive'].map(type => {
                                    return <div className="ml-6 " key={type}>
                                        <input className="mr-2 cursor-pointer" type="radio" id={type} name='status' onChange={() => setPropertyStatusFilter(type.toLowerCase())} />
                                        <label className="text-lg text-gray-600 cursor-pointer" htmlFor={type}>{capitalizeFirstLetterOfAString(type)}</label>
                                    </div>
                                })}
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button type='button' className="bg-blue-500 hover:bg-blue-700 text-white font-semibold text-lg rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => {
                                if (propertyTypeFilter || stateFilter || propertyAddedYearFilter || propertyStatusFilter) {
                                    filterSetter({
                                        type: propertyTypeFilter,
                                        state: stateFilter,
                                        status: propertyStatusFilter,
                                        year: propertyAddedYearFilter
                                    })
                                }
                            }}>Apply filters</button>
                        </div>

                    </div>

                    {/*Container for list of properties */}
                    {!showFiltersContainer && !spinner && <div className="relative w-11/12 md:w-6/12 flex flex-col gap-4 md:gap-9  bg-gray-100">

                        {/*A message will be shown when no properties are available */}
                        {propertiesAddedByDealer && !propertiesAddedByDealer.length && <div role="status" className="absolute top-24 z-50 w-full h-screen flex justify-center">
                            <p>{(propertyTypeFilter || stateFilter || propertyAddedYearFilter || propertyStatusFilter) ? 'No properties with these filters are available' : 'No properties have been added'}</p>
                        </div>}

                        {/*When some properties have been fetched*/}
                        {!spinner && <>
                            {propertiesAddedByDealer && propertiesAddedByDealer.length > 0 && <p className="font-semibold text-gray-600 md:text-xl text-center">{propertiesAddedByDealer.length} properties added</p>}

                            {propertiesAddedByDealer && propertiesAddedByDealer.length > 0 && propertiesAddedByDealer.map(property => {
                                return <div key={property._id} className="w-full p-5 rounded-lg bg-white">
                                    <p className="text-xl font-semibold text-gray-900 mb-5 text-center">{capitalizeFirstLetterOfAString(property.propertyType)} property</p>
                                    <div className="flex flex-row mb-4">
                                        <p className="text-lg font-semibold text-gray-700">Location:</p>
                                        <div className="mt-1">
                                            {property.location.name.plotNumber && <div className="flex flex-row gap-3 ml-6">
                                                <p className="font-semibold text-gray-500">Plot No:</p>
                                                <p className="text-gray-600">{capitalizeFirstLetterOfAString(property.location.name.plotNumber)}</p>
                                            </div>}
                                            {property.location.name.village && <div className="flex flex-row gap-5 ml-6">
                                                <p className="font-semibold text-gray-500">Village:</p>
                                                <p className="text-gray-600">{capitalizeFirstLetterOfAString(property.location.name.village)}</p>
                                            </div>}
                                            {property.location.name.tehsil && <div className="flex flex-row gap-7 ml-6">
                                                <p className="font-semibold text-gray-500">Tehsil:</p>
                                                <p className="text-gray-600">{capitalizeFirstLetterOfAString(property.location.name.tehsil)}:</p>
                                            </div>}
                                            <div className="flex flex-row gap-4 ml-6">
                                                <p className="font-semibold text-gray-500">District:</p>
                                                <p className="text-gray-600">{capitalizeFirstLetterOfAString(property.location.name.district)}</p>
                                            </div>
                                            <div className="flex flex-row gap-8 ml-6">
                                                <p className="font-semibold text-gray-500">State:</p>
                                                <p className="text-gray-600">{capitalizeFirstLetterOfAString(property.location.name.state)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-5 mb-4">
                                        <p className="text-lg font-semibold text-gray-700">Added on:</p>
                                        <p className="text-lg">{formatDate(property.createdAt)}</p>
                                    </div>
                                    <div className="flex flex-row gap-5 mb-4">
                                        <p className="text-lg font-semibold text-gray-700">Status:</p>
                                        <p className="text-green-500 font-semibold text-lg ">{capitalizeFirstLetterOfAString(property.status)}</p>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <button type='button' className="bg-blue-500 hover:bg-blue-700 text-white font-semibold text-lg rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => {
                                            if (property.propertyType.toLowerCase() === 'agricultural') {
                                                navigate(`/property-dealer/agricultural-property/${property._id}`)
                                            } else if (property.propertyType.toLowerCase() === 'residential') {
                                                navigate(`/property-dealer/residential-property/${property._id}`)
                                            } else if (property.propertyType.toLowerCase() === 'commercial') {
                                                navigate(`/property-dealer/commercial-property/${property._id}`)
                                            }
                                        }}>View details</button>
                                    </div>
                                </div>
                            })
                            }
                        </>}

                    </div>}

                </div>}
            </div>

        </Fragment >
    )
}
export default PropertiesPreviouslyAdded