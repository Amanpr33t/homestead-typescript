import { Fragment, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AlertModal from '../AlertModal'
import { punjabDistricts } from '../../utils/tehsilsAndDistricts/districts'
import PunjabTehsilsDropdown from "./tehsilsDropdown/Punjab"
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../utils/stringUtilityFunctions"
import ReviewCommercialPropertyAfterSubmission from "./ReviewCommercialPropertyAfterSubmission"
import Spinner from "../Spinner"

function CommercialPropertyAddForm() {
    const navigate = useNavigate()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const propertyDealerId = queryParams.get('id')
    const propertyDealerLogoUrl = queryParams.get('logoUrl')
    const propertyDealerFirmName = queryParams.get('firmName')
    const commercialPropertyType = queryParams.get('propertyType')

    const [spinner, setSpinner] = useState(true)

    useEffect(() => {
        if (!propertyDealerId || !propertyDealerLogoUrl || !propertyDealerFirmName || (commercialPropertyType !== 'industrial' && commercialPropertyType !== 'shop')) {
            navigate('/field-agent', { replace: true })
        } else {
            setSpinner(false)
        }
    }, [propertyDealerId, propertyDealerLogoUrl, propertyDealerFirmName, commercialPropertyType, navigate])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    const [totalAreaSquareFeet, setTotalAreaSquareFeet] = useState('')
    const [coveredAreaSquareFeet, setCoveredAreaSquareFeet] = useState('')
    const [totalAreaError, setTotalAreaError] = useState(false)
    const [totalAreaMetreSquare, setTotalAreaMetreSquare] = useState('')
    const [coveredAreaMetreSquare, setCoveredAreaMetreSquare] = useState('')
    const [coveredAreaError, setCoveredAreaError] = useState(false)
    const [landSizeDetails, setLandSizeDetails] = useState('')

    const [state, setState] = useState('')
    const [stateError, setStateError] = useState(false)
    const [district, setDistrict] = useState('')
    const [districtError, setDistrictError] = useState(false)
    const [plotNumber, setPlotNumber] = useState('')
    const [city, setCity] = useState('')
    const [tehsil, setTehsil] = useState('')
    const [village, setVillage] = useState('')

    const [commercialPropertyImageUpload, setCommercialPropertyImageUpload] = useState([])
    const [commercialPropertyImageFile, setCommercialPropertyImageFile] = useState([])
    const [commercialPropertyImageFileError, setCommercialPropertyImageFileError] = useState(false)

    const [numberOfOwners, setNumberOfOwners] = useState(1)

    const [contractImageUpload, setContractImageUpload] = useState([])
    const [contractImageFile, setContractImageFile] = useState([])

    const [priceDemandedNumber, setPriceDemandedNumber] = useState('')
    const [priceDemandedNumberError, setPriceDemandedNumberError] = useState('')
    const [priceDemandedWords, setPriceDemandedWords] = useState('')
    const [priceDemandedWordsError, setPriceDemandedWordsError] = useState(false)

    const [isLegalRestrictions, setIsLegalRestrictions] = useState(false)
    const [legalRestrictionError, setLegalRestrictionError] = useState(false)
    const [legalRestrictionDetails, setLegalRestrictionDetails] = useState('')
    const [legalRestrictionDetailsError, setLegalRestrictionDetailsError] = useState(false)

    const propertyTypeOptions = ['Booth', 'Shop', 'Showroom', 'Retail-space', 'other']
    const [propertyTypeError, setPropertyTypeError] = useState(false)
    const [selectedPropertyType, setSelectedPropertyType] = useState(null)

    const [numberOfFloorsWithoutBasement, setNumberOfFloorsWithoutBasement] = useState(1)
    const [numberOfBasementFloors, setNumberOfBasementFloors] = useState(0)

    const [lockInPeriodMonths, setLockInPeriodMonths] = useState(0)
    const [lockInPeriodYears, setLockInPeriodYears] = useState(0)

    const [leasePeriodMonths, setLeasePeriodMonths] = useState(0)
    const [leasePeriodYears, setLeasePeriodYears] = useState(0)

    const [remarks, setRemarks] = useState('')

    const [widthOfRoadFacingMetre, setWidthOfRoadFacingMetre] = useState('')
    const [widthOfRoadFacingFeet, setWidthOfRoadFacingFeet] = useState('')

    const [isEmptyProperty, setIsEmptyProperty] = useState()
    const [builtUpProperty, setBuiltUpProperty] = useState()
    const [stateOfPropertyError, setStateOfPropertyError] = useState(false)
    const [builtUpSelectedOption, setBuiltupSelectedOption] = useState(null)
    const builtUpPropertyOptions = ['Hotel/Resort', 'Factory', 'Banquet hall', 'Cold Store', 'Warehouse', 'School', 'Hospital/Clinic', 'other']

    const states = ['Chandigarh', 'Punjab', 'Haryana']

    const [propertyData, setPropertyData] = useState()

    const commercialPropertyImageHandler = (event) => {
        setCommercialPropertyImageFileError(false)
        setCommercialPropertyImageFile(array => [...array, URL.createObjectURL(event.target.files[0])])
        setCommercialPropertyImageUpload(array => [...array, event.target.files[0]])
    }

    const contractImageHandler = (event) => {
        setContractImageFile(array => [...array, URL.createObjectURL(event.target.files[0])])
        setContractImageUpload(array => [...array, event.target.files[0]])
    }

    const arrayOfNumbers = (from, to) => {
        if (from === 0) {
            return Array.apply(null, Array(to))
                .map(function (y, i) { return i })
        } else {
            return Array.apply(null, Array(to))
                .map(function (y, i) { return i + 1 })
        }
    }

    const errorCheckingBeforeSubmit = () => {
        if (!commercialPropertyImageFile.length) {
            setCommercialPropertyImageFileError(true)
        }

        if (!district.trim() && !state.trim()) {
            setDistrictError(true)
            setStateError(true)

        } else if (!district.trim() && state.trim()) {
            setDistrictError(true)
            setStateError(false)

        } else if (district.trim() && !state.trim()) {
            setDistrictError(false)
            setStateError(true)
        }

        if (!totalAreaMetreSquare || !totalAreaSquareFeet) {
            setTotalAreaError(true)
        }

        if (!coveredAreaMetreSquare || !coveredAreaSquareFeet) {
            setCoveredAreaError(true)
        }

        if (!isEmptyProperty && !builtUpProperty) {
            setStateOfPropertyError(true)
        } else if (commercialPropertyType === 'industrial' && builtUpProperty && !builtUpSelectedOption) {
            setStateOfPropertyError(true)
        }

        if (commercialPropertyType === 'shop' && !selectedPropertyType) {
            setPropertyTypeError(true)
        }

        if (!priceDemandedNumber) {
            setPriceDemandedNumberError(true)
        }
        if (!priceDemandedWords.trim()) {
            setPriceDemandedWordsError(true)
        }

        if (isLegalRestrictions === undefined) {
            setLegalRestrictionError(true)
        } else {
            if (isLegalRestrictions && !legalRestrictionDetails.trim()) {
                setLegalRestrictionDetailsError(true)
            }
        }
    }

    const formSubmit = async (e) => {
        e.preventDefault()
        const errorFunction = () => {
            errorCheckingBeforeSubmit()
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields',
                routeTo: null
            })
            return
        }
        if(!commercialPropertyImageFile.length){
            return errorFunction()
        }
        if(!district.trim() || !state.trim() ){
            return errorFunction()
        }
        if(!coveredAreaMetreSquare || !coveredAreaSquareFeet || !totalAreaMetreSquare || !totalAreaSquareFeet){
            return errorFunction()
        }
        if(!priceDemandedNumber || !priceDemandedWords.trim()){
            return errorFunction()
        }
        if(isLegalRestrictions === undefined || (isLegalRestrictions && !legalRestrictionDetails.trim()) ){
            return errorFunction()
        }
        if((!builtUpProperty && !isEmptyProperty) || (commercialPropertyType === 'industrial' && (builtUpProperty && !builtUpSelectedOption))){
            return errorFunction()
        }
        if(commercialPropertyType === 'shop' && !selectedPropertyType){
            return errorFunction()
        }

        const finalPropertyData = {
            addedByPropertyDealer: propertyDealerId,
            commercialPropertyType,
            landSize: {
                totalArea: {
                    metreSquare: +totalAreaMetreSquare,
                    squareFeet: +totalAreaSquareFeet
                },
                coveredArea: {
                    metreSquare: +coveredAreaMetreSquare,
                    squareFeet: +coveredAreaSquareFeet
                },
                details: landSizeDetails.trim() && (landSizeDetails.trim()[0].toUpperCase() + landSizeDetails.trim().slice(1)),
            },
            stateOfProperty: {
                empty: isEmptyProperty,
                builtUp: builtUpProperty,
                builtUpPropertyType: builtUpSelectedOption
            },
            location: {
                name: {
                    plotNumber: plotNumber.trim() && (plotNumber.trim()[0].toUpperCase() + plotNumber.trim().slice(1)),
                    village: village.trim() && (village.trim()[0].toUpperCase() + village.trim().slice(1)),
                    city: city.trim() && (city.trim()[0].toUpperCase() + city.trim().slice(1)),
                    tehsil: tehsil,
                    district,
                    state
                }
            },
            numberOfOwners: +numberOfOwners,
            floors: {
                floorsWithoutBasement: +numberOfFloorsWithoutBasement,
                basementFloors: +numberOfBasementFloors
            },
            widthOfRoadFacing: {
                feet: +widthOfRoadFacingFeet,
                metre: +widthOfRoadFacingMetre
            },
            priceDemanded: {
                number: +priceDemandedNumber,
                words: capitaliseFirstAlphabetsOfAllWordsOfASentence(priceDemandedWords.trim())
            },
            legalRestrictions: {
                isLegalRestrictions,
                details: legalRestrictionDetails.trim() && (legalRestrictionDetails.trim()[0].toUpperCase() + legalRestrictionDetails.trim().slice(1)),
            },
            remarks: remarks.trim()
        }

        const shopSpecificData = {
            lockInPeriod: {
                years: +lockInPeriodYears,
                months: +lockInPeriodMonths
            },
            leasePeriod: {
                years: +leasePeriodYears,
                months: +leasePeriodMonths
            },
            shopPropertyType: selectedPropertyType
        }

        if (commercialPropertyType === 'shop') {
            setPropertyData({ ...finalPropertyData, ...shopSpecificData })
        } else {
            setPropertyData(finalPropertyData)
        }

    }

    return (
        <Fragment>
            {spinner && !propertyData && <Spinner />}

            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}

            {propertyData && <ReviewCommercialPropertyAfterSubmission
                propertyData={propertyData}
                commercialPropertyImageFile={commercialPropertyImageFile}
                contractImageFile={contractImageFile}
                commercialPropertyImageUpload={commercialPropertyImageUpload}
                contractImageUpload={contractImageUpload}
                propertyDataReset={() => setPropertyData(null)}
                firmName={propertyDealerFirmName} />}

            {!spinner && <div className={`pl-2 pr-2 mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center ${alert.isAlertModal ? 'blur' : ''} ${propertyData ? 'fixed right-full' : ''}`} >

                <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
                    <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/field-agent', { replace: true })}>Home</button>
                </div>

                <p className="fixed w-full text-center top-28 sm:top-16 pl-4 pr-4 pb-4 sm:pt-4 bg-white  text-xl font-bold z-10">Add a commercial property by filling the form</p>

                <form className="w-full min-h-screen mt-48 sm:mt-36 md:w-10/12 lg:w-8/12  h-fit pt-4 pb-4 flex flex-col rounded border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

                    <div className="flex flex-col md:flex-row place-items-center md:place-content-center  gap-3 mb-10 ">
                        <p className="text-3xl font-bold text-gray-500 w-fit text-center">{propertyDealerFirmName}</p>
                        {propertyDealerLogoUrl && <img className="w-20 h-auto " src={propertyDealerLogoUrl} alt='' />}
                    </div>

                    {/* Property type*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                            <p className="text-xl font-semibold text-gray-500" >Property type</p>
                            <p className="text-lg text-gray-500">{commercialPropertyType === 'industrial' ? 'Industrial/Institutional' : 'Shop/Showroom/Booth'}</p>
                        </div>
                    </div>

                    {/*built-up or empty property */}
                    <div className="p-2  flex flex-col pb-5 pt-5 ">
                        {stateOfPropertyError && <p className="text-red-500">Select an option</p>}
                        <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500 mb-2">State of property</p>
                            </div>
                            <div className="flex-col">
                                <div className="flex flex-row gap-4 sm:gap-6 pt-1">
                                    <div className="flex flex-row h-fit">
                                        <input className="mr-1 cursor-pointer" type="radio" id="built-up" name="state" value="built-up" onChange={e => {
                                            setStateOfPropertyError(false)
                                            if (e.target.checked) {
                                                setBuiltUpProperty(true)
                                                setIsEmptyProperty(false)
                                            }
                                        }} />
                                        <label htmlFor="built-up">Built-up</label>
                                    </div>

                                    <div className="flex flex-row h-fit">
                                        <input className=" mr-1 cursor-pointer" type="radio" id="empty" name="state" value="empty" onChange={e => {
                                            setStateOfPropertyError(false)
                                            if (e.target.checked) {
                                                setIsEmptyProperty(true)
                                                setBuiltUpProperty(false)
                                            }
                                        }} />
                                        <label htmlFor="empty">Empty</label>
                                    </div>
                                </div>

                                {commercialPropertyType === 'industrial' && builtUpProperty && <div className="flex flex-col bg-white w-fit p-1 mt-2">
                                    <p className="font-semibold">Select an option</p>
                                    {builtUpPropertyOptions.map(option => {
                                        return <div key={option} className="flex flex-row h-fit ">
                                            <input className="mr-1 cursor-pointer" type="radio" id={option} name="built-up-option" value={option} onChange={e => {
                                                setStateOfPropertyError(false)
                                                if (e.target.checked) {
                                                    setBuiltupSelectedOption(e.target.value)
                                                }
                                            }} />
                                            <label htmlFor="built-up-option">{option}</label>
                                        </div>
                                    })}
                                </div>}

                            </div>

                        </div>
                    </div>

                    {/*area*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        {(coveredAreaError || totalAreaError) && <p className="text-red-500 -mt-1">Provide land size</p>}
                        <div className="flex flex-row gap-5 sm:gap-16">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="size">Area</label>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex flex-col gap-3 bg-gray-300 w-fit p-2 pt-0">
                                        <p className="w-full text-center font-semibold">Total area</p>
                                        <div className="flex flex-row gap-1">
                                            <input id="total-area-metre-square" type="number" name='total-area-metre-square' className={`border-2 ${totalAreaError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-32`} placeholder="Size" value={totalAreaMetreSquare} onChange={e => {
                                                setTotalAreaError(false)
                                                if (e.target.value.trim() && +e.target.value.trim() !== 0) {
                                                    setTotalAreaMetreSquare(+e.target.value.trim())
                                                    setTotalAreaSquareFeet(Number((+e.target.value.trim() * 10.764).toFixed(2)))
                                                } else {
                                                    setTotalAreaSquareFeet('')
                                                    setTotalAreaMetreSquare('')
                                                }
                                            }} />
                                            <label htmlFor="total-area-metre-square">Metre square</label>
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            <input id="total-area-square-feet" type="number" name='total-area-square-feet' className={`border-2 ${totalAreaError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-32`} placeholder="Size" value={totalAreaSquareFeet} onChange={e => {
                                                setTotalAreaError(false)
                                                if (e.target.value.trim() && +e.target.value.trim() !== 0) {

                                                    setTotalAreaSquareFeet(+e.target.value.trim())
                                                    setTotalAreaMetreSquare(Number((+e.target.value.trim() / 10.764).toFixed(2)))
                                                } else {
                                                    setTotalAreaSquareFeet('')
                                                    setTotalAreaMetreSquare('')
                                                }
                                            }} />
                                            <label htmlFor="total-area-square-feet">Square feet</label>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 bg-gray-300 w-fit p-2 pt-0">
                                        <p className="w-full text-center font-semibold">Covered area</p>
                                        <div className="flex flex-row gap-1">
                                            <input id="covered-area-metre-square" type="number" name='covered-area-metre-square' className={`border-2 ${coveredAreaError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-32`} placeholder="Size" value={coveredAreaMetreSquare} onChange={e => {
                                                setCoveredAreaError(false)
                                                if (e.target.value.trim() && +e.target.value.trim() !== 0) {

                                                    setCoveredAreaMetreSquare(+e.target.value.trim())
                                                    setCoveredAreaSquareFeet(Number((+e.target.value.trim() * 10.764).toFixed(2)))
                                                } else {
                                                    setCoveredAreaSquareFeet('')
                                                    setCoveredAreaMetreSquare('')
                                                }
                                            }} />
                                            <label htmlFor="covered-area-metre-square">Metre square</label>
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            <input id="coverved-area-square-feet" type="number" name='covered-area-square-feet' className={`border-2 ${coveredAreaError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-32`} placeholder="Size" value={coveredAreaSquareFeet} onChange={e => {
                                                setCoveredAreaError(false)
                                                if (e.target.value.trim() && +e.target.value.trim() !== 0) {

                                                    setCoveredAreaSquareFeet(+e.target.value.trim())
                                                    setCoveredAreaMetreSquare(Number((+e.target.value.trim() / 10.764).toFixed(2)))
                                                } else {
                                                    setCoveredAreaSquareFeet('')
                                                    setCoveredAreaMetreSquare('')
                                                }
                                            }} />
                                            <label htmlFor="covered-area-square-feet">Square feet</label>
                                        </div>
                                    </div>
                                </div>


                                <textarea className="border-2 border-gray-400 rounded h-40 sm:w-80 p-1 resize-none" id="size-textarea" name="size-textarea" autoCorrect="on" autoComplete="new-password" placeholder="Add details regarding land size (optional)" value={landSizeDetails} onChange={e => {
                                    setLandSizeDetails(e.target.value)
                                }} />
                            </div>
                        </div>
                    </div>

                    {/*shop property type */}
                    {commercialPropertyType === 'shop' && <div className="p-2 pb-5 pt-5 ">
                        {propertyTypeError && <p className="text-red-500">Select atleast one property type</p>}
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500">Property type</p>
                            </div>
                            <div className="flex flex-col gap-1.5 mt-1">
                                {propertyTypeOptions.map(type => {
                                    return <div key={type}>
                                        <input className="mr-1 cursor-pointer" type="radio" id={type} name='property-type' value={type} onChange={e => {
                                            setPropertyTypeError(false)
                                            if (e.target.checked) {
                                                setSelectedPropertyType(e.target.value)
                                            }
                                        }} />
                                        <label htmlFor={type}>{type[0].toUpperCase() +
                                            type.slice(1)}</label>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>}

                    {/* Number of floors without basement*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500" htmlFor="floors">Number of floors (basement excluded)</label>
                            <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center h-fit" name="floors" id="floors" value={numberOfFloorsWithoutBasement} onChange={e => {
                                setNumberOfFloorsWithoutBasement(e.target.value)
                            }}>
                                {arrayOfNumbers(1, 50).map(number => <option key={number} value={number}>{number}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Number of basement floors*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 ">
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500" htmlFor="basement">Number of basement floors</label>
                            <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center h-fit" name="basement" id="basement" value={numberOfBasementFloors} onChange={e => {
                                setNumberOfBasementFloors(e.target.value)
                            }}>
                                {arrayOfNumbers(0, 5).map(number => <option key={number} value={number}>{number}</option>)}
                            </select>
                        </div>
                    </div>

                    {/*lock in period*/}
                    {commercialPropertyType === 'shop' && <div className="flex flex-row p-2 pb-5 pt-5 gap-5 sm:gap-16 bg-gray-100">
                        <p className="text-xl font-semibold text-gray-500 whitespace-nowrap">Lock-in period</p>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row gap-2">
                                <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="lock-in-period-years" id="lock-in-period-years" value={lockInPeriodYears} onChange={e => {
                                    setLockInPeriodYears(e.target.value)
                                }}>
                                    {arrayOfNumbers(0, 21).map(number => <option key={number} value={number}>{number}</option>)}
                                </select>
                                <label htmlFor="lock-in-period-years">Years</label>
                            </div>
                            <div className="flex flex-row gap-2">
                                <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="lock-in-period-months" id="lock-in-period-months" value={lockInPeriodMonths} onChange={e => {
                                    setLockInPeriodMonths(e.target.value)
                                }}>
                                    {arrayOfNumbers(0, 12).map(number => <option key={number} value={number}>{number}</option>)}
                                </select>
                                <label htmlFor="lock-in-period-months">Months</label>
                            </div>
                        </div>
                    </div>}

                    {/*lease period*/}
                    {commercialPropertyType === 'shop' && <div className="flex flex-row p-2 pb-5 pt-5 gap-5 sm:gap-16">
                        <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Lease period</p>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row gap-2">
                                <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="lease-years" id="lease-years" value={leasePeriodYears} onChange={e => {
                                    setLeasePeriodYears(e.target.value)
                                }}>
                                    {arrayOfNumbers(0, 21).map(number => <option key={number} value={number}>{number}</option>)}
                                </select>
                                <label htmlFor="lease-years">Years</label>
                            </div>
                            <div className="flex flex-row gap-2">
                                <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="lease-months" id="lease-months" value={leasePeriodMonths} onChange={e => {
                                    setLeasePeriodMonths(e.target.value)
                                }}>
                                    {arrayOfNumbers(0, 12).map(number => <option key={number} value={number}>{number}</option>)}
                                </select>
                                <label htmlFor="lease-months">Months</label>
                            </div>
                        </div>
                    </div>}

                    {/* contract*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        <div className="flex flex-row gap-5">
                            <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Upload images of contract between seller and dealer (optional)</label>
                            <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={contractImageHandler} onClick={e => e.target.value = null} />
                        </div>
                        {contractImageFile.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
                            {contractImageFile.map(image => {
                                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                                    <img className='relative w-auto h-60' src={image} alt="" />
                                    <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                                        const updatedState = contractImageFile.filter(file => file !== image)
                                        setContractImageFile(updatedState)
                                    }}>X</div>
                                </div>
                            })}
                        </div>}
                    </div>

                    {/*location */}
                    <div className="flex flex-col p-2 pb-5 pt-5">
                        {districtError && !stateError && <p className="text-red-500">Select a state</p>}
                        {stateError && !districtError && <p className="text-red-500">Select a district</p>}
                        {stateError && districtError && <p className="text-red-500">Select district and state</p>}

                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <p className="text-xl font-semibold text-gray-500" htmlFor="location">Property location</p>
                        </div>
                        <div className="flex flex-col place-self-center w-11/12 gap-2">
                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="plot">Plot No.</label>
                                <input type="text" id="plotNumber" name="plotNumber"
                                    className='border-2 border-gray-500  p-1 rounded' autoComplete="new-password" value={plotNumber} onChange={e => {
                                        setPlotNumber(e.target.value)
                                    }} />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="village">Village</label>
                                <input type="text" id="village" name="village"
                                    className='border-2 border-gray-500  p-1 rounded' autoComplete="new-password" value={village} onChange={e => {
                                        setVillage(e.target.value)
                                    }} />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="city">City/Town</label>
                                <input type="text" id="city" name="city"
                                    className='border-2 border-gray-500 p-1 rounded' autoComplete="new-password" value={city} onChange={e => {
                                        setCity(e.target.value)
                                    }} />
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="text-gray-500 font-semibold" htmlFor="state">State</label>
                                </div>

                                <select className={`border-2 ${stateError ? 'border-red-500' : 'border-gray-500'}  p-1 rounded`} name="state" id="state" value={state} onChange={e => {
                                    setStateError(false)
                                    setState(e.target.value)
                                    setDistrict('')
                                    setTehsil('')
                                }}>
                                    <option className="text-gray-500 font-semibold" value="" disabled>Select a state:</option>
                                    {states.map(state => {
                                        return <option key={state} value={state}>{state}</option>
                                    })}
                                </select>
                                {stateError && <p className="text-red-500">Select a state</p>}
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="text-gray-500 font-semibold" htmlFor="district">District</label>
                                </div>
                                <select className={`border-2 ${districtError ? 'border-red-500' : 'border-gray-500'}  p-1 rounded`} name="district" id="district" value={district} disabled={state ? false : true} onChange={e => {
                                    setDistrictError(false)
                                    setDistrict(e.target.value)
                                    setTehsil('')
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a district</option>
                                    {state === 'Punjab' && punjabDistricts.map(district => {
                                        return <option key={district} value={district}>{district}</option>
                                    })}
                                    {state === 'Chandigarh' &&
                                        <option value="Chandigarh">Chandigarh</option>}
                                </select>
                                {districtError && <p className="text-red-500">Select a district</p>}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="state">Tehsil</label>
                                <select className='border-2 border-gray-500 p-1 rounded' name="state" id="state" disabled={state && district ? false : true} value={tehsil} onChange={e => {
                                    setTehsil(e.target.value)
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a tehsil</option>
                                    {state === 'Chandigarh' && district === 'Chandigarh' &&
                                        <option value='Chandigarh'>Chandigarh</option>}
                                    {state === 'Punjab' && <>
                                        <PunjabTehsilsDropdown district={district} />
                                    </>}
                                </select>
                            </div>
                            {/*<div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="state">Location on Map</label>
                                <div className="w-full">
                                    <MapComponent apiKey={process.env.REACT_APP_GOOGLE_API_KEY} />
                                </div>
                            </div>*/}
                        </div>
                    </div>

                    {/* Number of owners*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500" htmlFor="owners">Number of owners</label>
                            <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="owners" id="owners" value={numberOfOwners} onChange={e => {
                                setNumberOfOwners(e.target.value)
                            }}>
                                {arrayOfNumbers(1, 10).map(number => <option key={number} value={number}>{number}</option>)}
                            </select>
                        </div>
                    </div>

                    {/*price*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 ">
                        {(priceDemandedNumberError && !priceDemandedWordsError) && <p className="text-red-500 -mt-1">Provide price in words</p>}
                        {(!priceDemandedNumberError && priceDemandedWordsError) && <p className="text-red-500 -mt-1">Provide price in numbers</p>}
                        {(priceDemandedNumberError && priceDemandedWordsError) && <p className="text-red-500 -mt-1">Provide price</p>}
                        <div className="flex flex-row gap-5 sm:gap-16">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="size">Price (Rs)</label>
                            </div>

                            <div className="flex flex-col gap-5">
                                <input id="price-number" type="number" name='price-number' className={`border-2 ${priceDemandedNumberError ? 'border-red-400' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-40`} placeholder="Number" value={priceDemandedNumber} onChange={e => {
                                    if (e.target.value.trim() && +e.target.value.trim() !== 0) {
                                        setPriceDemandedNumberError(false)
                                        setPriceDemandedNumber(+e.target.value.trim())
                                    } else {
                                        setPriceDemandedNumber('')
                                    }
                                }} />
                                <textarea className={`border-2 ${priceDemandedWordsError ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-56 sm:w-80 resize-none`} id="price-words" rows={3} name="price-words" autoCorrect="on" autoComplete="new-password" placeholder="Words" value={priceDemandedWords} onChange={e => {
                                    setPriceDemandedWordsError(false)
                                    setPriceDemandedWords(e.target.value)
                                }} />
                            </div>
                        </div>
                    </div>

                    {/*laws */}
                    <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                        {legalRestrictionError && <p className="text-red-500">Select an option</p>}
                        <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500 mb-2">Is the land under any restrictions under any laws</p>
                            </div>
                            <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                <div className="flex flex-row h-fit">
                                    <input className="mr-1 cursor-pointer" type="radio" id="yes" name="restrictions" value="yes" onChange={e => {
                                        setLegalRestrictionDetails('')
                                        setLegalRestrictionDetailsError(false)
                                        setLegalRestrictionError(false)
                                        if (e.target.checked) {
                                            setIsLegalRestrictions(true)
                                        } else {
                                            setIsLegalRestrictions(false)
                                        }
                                    }} />
                                    <label htmlFor="yes">Yes</label>
                                </div>

                                <div className="flex flex-row h-fit">
                                    <input className=" mr-1 cursor-pointer" type="radio" id="no" name="restrictions" value="no" onChange={e => {
                                        setLegalRestrictionDetails('')
                                        setLegalRestrictionDetailsError(false)
                                        setLegalRestrictionError(false)
                                        if (e.target.checked) {
                                            setIsLegalRestrictions(false)
                                        } else {
                                            setIsLegalRestrictions(true)
                                        }
                                    }} />
                                    <label htmlFor="no">No</label>
                                </div>
                            </div>
                        </div>
                        {isLegalRestrictions && <div className="text-center">
                            <textarea className={`border-2 ${legalRestrictionDetailsError ? 'border-red-400' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`} id="restrictions" name="restrictions" autoCorrect="on" autoComplete="new-password" placeholder="Add details about restrictions" value={legalRestrictionDetails} onChange={e => {
                                setLegalRestrictionDetailsError(false)
                                setLegalRestrictionDetails(e.target.value)
                            }} />
                            {legalRestrictionDetailsError && <p className="text-red-500">Provide details</p>}
                        </div>}
                    </div>

                    {/*width of road facing*/}
                    <div className=" p-2 pb-5 pt-5 flex flex-row gap-5 sm:gap-16">
                        <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Road width</p>

                        <div className="flex flex-row gap-5">
                            <div className="flex flex-col gap-3 bg-gray-300 w-fit p-2">
                                <div className="flex flex-row gap-1">
                                    <input id="road-facing-feet" type="number" name='road-facing-feet' className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-20`} placeholder="Size" value={widthOfRoadFacingFeet} onChange={e => {
                                        if (e.target.value.trim() && +e.target.value.trim() !== 0) {
                                            setWidthOfRoadFacingFeet(+e.target.value.trim())
                                            setWidthOfRoadFacingMetre(Number((+e.target.value.trim() / 0.3048).toFixed(2)))
                                        } else {
                                            setWidthOfRoadFacingFeet('')
                                            setWidthOfRoadFacingMetre('')
                                        }
                                    }} />
                                    <label htmlFor="road-facing-feet">metre</label>
                                </div>
                                <div className="flex flex-row gap-1">
                                    <input id="road-facing-metre" type="number" name='road-facing-metre' className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-20`} placeholder="Size" value={widthOfRoadFacingMetre} onChange={e => {
                                        if (e.target.value.trim() && +e.target.value.trim() !== 0) {
                                            setWidthOfRoadFacingMetre(+e.target.value.trim())
                                            setWidthOfRoadFacingFeet(Number((+e.target.value.trim() * 0.3048).toFixed(2)))
                                        } else {
                                            setWidthOfRoadFacingFeet('')
                                            setWidthOfRoadFacingMetre('')
                                        }
                                    }} />
                                    <label htmlFor="road-facing-metre">feet</label>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/*images */}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        {commercialPropertyImageFileError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
                        <div className="flex flex-row gap-5">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <label className="text-gray-500 text-xl font-semibold w-40" htmlFor="image">Add property image</label>
                            </div>
                            <input type="file" className='text-transparent ' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={commercialPropertyImageHandler} onClick={e => e.target.value = null} />
                        </div>
                        {commercialPropertyImageFile.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
                            {commercialPropertyImageFile.map(image => {
                                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                                    <img className='relative w-auto h-60' src={image} alt="" />
                                    <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                                        const updatedState = commercialPropertyImageFile.filter(file => file !== image)
                                        setCommercialPropertyImageFile(updatedState)
                                    }}>X</div>
                                </div>
                            })}
                        </div>}
                    </div>

                    {/*remarks*/}
                    <div className="flex flex-row gap-10 p-2 pb-5 pt-5">
                        <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="remarks">Remarks</label>
                        <textarea className="border-2 border-gray-400 rounded h-40 sm:w-80 p-1 resize-none" id="remarks" name="remarks" autoCorrect="on" autoComplete="new-password" placeholder="Add remarks regarding property" value={remarks} onChange={e => {
                            setRemarks(e.target.value)
                        }} />
                    </div>

                    <div className="flex justify-center mt-4 p-2">
                        <button type='submit' className="w-full bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">Save</button>
                    </div>

                </form>
            </div >}
        </Fragment >
    )
}
export default CommercialPropertyAddForm