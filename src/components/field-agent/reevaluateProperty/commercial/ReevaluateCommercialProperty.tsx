import { Fragment, useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AlertModal from "../../../AlertModal"
import { punjabDistricts } from "../../../../utils/tehsilsAndDistricts/districts"
import PunjabTehsilsDropdown from "../../../tehsilsDropdown/Punjab"
import { capitalizeFirstLetterOfAString } from "../../../../utils/stringUtilityFunctions"
import Spinner from "../../../Spinner"
import ReviewReevaluatedCommercialProperty from "./ReviewReevaluatedCommercialProperty"
import ReevaluationDetailsModal from "../ReevaluationDetailsModal"

const arrayOfNumbers = (from: number, to: number) => {
    if (from === 0) {
        return Array.apply(null, Array(to))
            .map(function (y, i) { return i })
    } else {
        return Array.apply(null, Array(to))
            .map(function (y, i) { return i + 1 })
    }
}

interface AlertType {
    isAlertModal: boolean,
    alertType: 'success' | 'warning' | null,
    alertMessage: string | null,
    routeTo: string | null
}

interface ImageType {
    file: string;
    upload: File;
}

type BuiltUpType = 'hotel/resort' | 'factory' | 'banquet hall' | 'cold store' | 'warehouse' | 'school' | 'hospital/clinic' | 'other'

interface PropertyDataType {
    commercialPropertyType: string,
    landSize: {
        totalArea: {
            metreSquare: number,
            squareFeet: number
        },
        coveredArea: {
            metreSquare: number,
            squareFeet: number
        },
        details: string | null,
    },
    stateOfProperty: {
        empty: boolean,
        builtUp: boolean,
        builtUpPropertyType: BuiltUpType | null
    },
    location: {
        name: {
            plotNumber: number | null,
            village: string | null,
            city: string | null,
            tehsil: string | null,
            district: string,
            state: string
        }
    },
    numberOfOwners: number,
    floors: {
        floorsWithoutBasement: number,
        basementFloors: number
    },
    widthOfRoadFacing: {
        feet: number,
        metre: number
    },
    priceDemanded: {
        number: number,
        words: string
    },
    legalRestrictions: {
        isLegalRestrictions: boolean,
        details: string | null,
    },
    remarks: string | null,
    lockInPeriod?: {
        years: number | null,
        months: number | null
    },
    leasePeriod?: {
        years: number | null,
        months: number | null
    },
    shopPropertyType?: 'booth' | 'shop' | 'showroom' | 'retail-space' | 'other'
}

interface FetchedPropertyDataType extends PropertyDataType {
    _id: string,
    propertyImagesUrl: string[],
    contractImagesUrl: string[] | null,
    evaluationData: {
        incompletePropertyDetails: string[] | null
    }
}

//Component is used to add a commercial proerty
const ReevaluateCommercialProperty: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const [fetchedPropertyData, setFetchedPropertyData] = useState<FetchedPropertyDataType | null>(null)

    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(true)

    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })

    const queryParams = new URLSearchParams(location.search)
    const propertyId: string | null = queryParams.get('propertyId')
    useEffect(() => {
        if (!propertyId) {
            navigate('/field-agent')
        }
    }, [propertyId, navigate])

    const commercialPropertyType: string | null = fetchedPropertyData && fetchedPropertyData?.commercialPropertyType

    const [totalAreaSquareFeet, setTotalAreaSquareFeet] = useState<number | ''>('')
    const [coveredAreaSquareFeet, setCoveredAreaSquareFeet] = useState<number | ''>('')
    const [totalAreaError, setTotalAreaError] = useState<boolean>(false)
    const [totalAreaMetreSquare, setTotalAreaMetreSquare] = useState<number | ''>('')
    const [coveredAreaMetreSquare, setCoveredAreaMetreSquare] = useState<number | ''>('')
    const [coveredAreaError, setCoveredAreaError] = useState<boolean>(false)
    const [landSizeDetails, setLandSizeDetails] = useState<string>('')

    const [state, setState] = useState<string>('')
    const [stateError, setStateError] = useState<boolean>(false)
    const [district, setDistrict] = useState<string>('')
    const [districtError, setDistrictError] = useState<boolean>(false)
    const [plotNumber, setPlotNumber] = useState<number | ''>('')
    const [city, setCity] = useState<string>('')
    const [tehsil, setTehsil] = useState<string>('')
    const [village, setVillage] = useState<string>('')

    const [commercialPropertyImages, setCommercialPropertyImages] = useState<ImageType[]>([])
    const [commercialPropertyImageError, setCommercialPropertyImageError] = useState<boolean>(false)
    const [fetchedPropertyImagesUrl, setFetchedPropertyImagesUrl] = useState<string[]>([])

    const [contractImages, setContractImages] = useState<ImageType[]>([])
    const [fetchedContractImagesUrl, setFetchedContractImagesUrl] = useState<string[]>([])

    const [numberOfOwners, setNumberOfOwners] = useState<number>(1)

    const [priceDemandedNumber, setPriceDemandedNumber] = useState<number | ''>('')
    const [priceDemandedNumberError, setPriceDemandedNumberError] = useState<boolean>(false)
    const [priceDemandedWords, setPriceDemandedWords] = useState<string>('')
    const [priceDemandedWordsError, setPriceDemandedWordsError] = useState<boolean>(false)

    const [isLegalRestrictions, setIsLegalRestrictions] = useState<boolean | null>(null)
    const [legalRestrictionError, setLegalRestrictionError] = useState<boolean>(false)
    const [legalRestrictionDetails, setLegalRestrictionDetails] = useState<string>('')
    const [legalRestrictionDetailsError, setLegalRestrictionDetailsError] = useState<boolean>(false)

    const propertyTypeOptions = ['booth', 'shop', 'showroom', 'retail-space', 'other']
    const [propertyTypeError, setPropertyTypeError] = useState<boolean>(false)
    const [selectedPropertyType, setSelectedPropertyType] = useState<'booth' | 'shop' | 'showroom' | 'retail-space' | 'other'>()

    const [numberOfFloorsWithoutBasement, setNumberOfFloorsWithoutBasement] = useState<number>(1)
    const [numberOfBasementFloors, setNumberOfBasementFloors] = useState<number>(0)

    const [lockInPeriodMonths, setLockInPeriodMonths] = useState<number>(0)
    const [lockInPeriodYears, setLockInPeriodYears] = useState<number>(0)

    const [leasePeriodMonths, setLeasePeriodMonths] = useState<number>(0)
    const [leasePeriodYears, setLeasePeriodYears] = useState<number>(0)

    const [remarks, setRemarks] = useState<string>('')

    const [widthOfRoadFacingMetre, setWidthOfRoadFacingMetre] = useState<number | ''>('')
    const [widthOfRoadFacingFeet, setWidthOfRoadFacingFeet] = useState<number | ''>('')

    const [isEmptyProperty, setIsEmptyProperty] = useState<boolean>()
    const [builtUpProperty, setBuiltUpProperty] = useState<boolean>()
    const [stateOfPropertyError, setStateOfPropertyError] = useState<boolean>(false)
    const [builtUpSelectedOption, setBuiltupSelectedOption] = useState<BuiltUpType>()
    const builtUpPropertyOptions = ['hotel/resort', 'factory', 'banquet hall', 'cold store', 'warehouse', 'school', 'hospital/clinic', 'other']

    const states = ['chandigarh', 'punjab']

    const [propertyData, setPropertyData] = useState<PropertyDataType | null>(null)

    useEffect(() => {
        if (fetchedPropertyData) {
            setTotalAreaSquareFeet(fetchedPropertyData.landSize.totalArea.squareFeet)
            setCoveredAreaSquareFeet(fetchedPropertyData.landSize.coveredArea.squareFeet)
            setTotalAreaMetreSquare(fetchedPropertyData.landSize.totalArea.metreSquare)
            setCoveredAreaMetreSquare(fetchedPropertyData.landSize.coveredArea.metreSquare)
            setLandSizeDetails(fetchedPropertyData.landSize.details || '')
            setState(fetchedPropertyData.location.name.state)
            setDistrict(fetchedPropertyData.location.name.district)
            setPlotNumber(fetchedPropertyData.location.name.plotNumber || '')
            setCity(fetchedPropertyData.location.name.city || '')
            setTehsil(fetchedPropertyData.location.name.tehsil || '')
            setVillage(fetchedPropertyData.location.name.village || '')
            setNumberOfOwners(fetchedPropertyData.numberOfOwners)
            setPriceDemandedNumber(fetchedPropertyData.priceDemanded.number)
            setPriceDemandedWords(fetchedPropertyData.priceDemanded.words)
            setIsLegalRestrictions(fetchedPropertyData.legalRestrictions.isLegalRestrictions)
            setLegalRestrictionDetails(fetchedPropertyData.legalRestrictions.details || '')
            setSelectedPropertyType(fetchedPropertyData.shopPropertyType)
            setNumberOfBasementFloors(fetchedPropertyData.floors.basementFloors)
            setNumberOfFloorsWithoutBasement(fetchedPropertyData.floors.floorsWithoutBasement)
            setLockInPeriodMonths(fetchedPropertyData.lockInPeriod?.months || 0)
            setLockInPeriodYears(fetchedPropertyData.lockInPeriod?.years || 0)
            setLeasePeriodMonths(fetchedPropertyData.leasePeriod?.months || 0)
            setLeasePeriodYears(fetchedPropertyData.leasePeriod?.years || 0)
            setRemarks(fetchedPropertyData.remarks || '')
            setIsEmptyProperty(fetchedPropertyData.stateOfProperty.empty)
            setBuiltUpProperty(fetchedPropertyData.stateOfProperty.builtUp)
            if (fetchedPropertyData.stateOfProperty.builtUpPropertyType) {
                setBuiltupSelectedOption(fetchedPropertyData.stateOfProperty.builtUpPropertyType)
            }
            setFetchedPropertyImagesUrl(fetchedPropertyData.propertyImagesUrl)
            if (fetchedPropertyData.contractImagesUrl?.length) {
                setFetchedContractImagesUrl(fetchedPropertyData.contractImagesUrl)
            }
        }
    }, [fetchedPropertyData])

    //This function is used to get proeprty details
    const getPropertyDetails = useCallback(async () => {
        try {
            setSpinner(true)
            setError(false)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/getPropertyData?id=${propertyId}&type=commercial`, {
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
            if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                setFetchedPropertyData(data.propertyData)
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [propertyId, authToken, navigate])

    useEffect(() => {
        getPropertyDetails()
    }, [getPropertyDetails])

    const commercialPropertyImageHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setCommercialPropertyImageError(false);
            setCommercialPropertyImages((array) => [
                ...array,
                {
                    file: URL.createObjectURL(selectedFile),
                    upload: selectedFile,
                },
            ])
            // If you want to clear the selected file after handling, you can reset the input value
            if (event.target) {
                event.target.value = '';
            }
        }
    }

    //This function is triggered when the user selects a contract image
    const contractImageHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setContractImages((array) => [
                ...array,
                {
                    file: URL.createObjectURL(selectedFile),
                    upload: selectedFile,
                },
            ])
            // If you want to clear the selected file after handling, you can reset the input value
            if (event.target) {
                event.target.value = '';
            }
        }
    }

    const errorCheckingBeforeSubmit = () => {
        if (commercialPropertyImages.length + fetchedPropertyImagesUrl.length === 0) {
            setCommercialPropertyImageError(true)
        }

        if (!district) {
            setDistrictError(true)
        }
        if (!state) {
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
        } else if (builtUpProperty && commercialPropertyType === 'industrial' && !builtUpSelectedOption) {
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

        if (isLegalRestrictions === null) {
            setLegalRestrictionError(true)
        } else if (isLegalRestrictions && !legalRestrictionDetails.trim()) {
            setLegalRestrictionDetailsError(true)
        }
    }

    const formSubmit = async (event: FormEvent) => {
        event.preventDefault()
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
        if (commercialPropertyImages.length + fetchedPropertyImagesUrl.length === 0) {
            return errorFunction()
        }
        if (!district.trim() || !state.trim()) {
            return errorFunction()
        }
        if (!coveredAreaMetreSquare || !coveredAreaSquareFeet || !totalAreaMetreSquare || !totalAreaSquareFeet) {
            return errorFunction()
        }
        if (!priceDemandedNumber || !priceDemandedWords.trim()) {
            return errorFunction()
        }
        if (isLegalRestrictions === null || (isLegalRestrictions && !legalRestrictionDetails.trim())) {
            return errorFunction()
        }
        if ((!builtUpProperty && !isEmptyProperty) || (builtUpProperty && commercialPropertyType === 'industrial' && !builtUpSelectedOption)) {
            return errorFunction()
        }
        if (commercialPropertyType === 'shop' && !selectedPropertyType) {
            return errorFunction()
        }

        if (!commercialPropertyType) {
            return
        }

        const finalPropertyData = {
            commercialPropertyType,
            landSize: {
                totalArea: {
                    metreSquare: totalAreaMetreSquare,
                    squareFeet: totalAreaSquareFeet
                },
                coveredArea: {
                    metreSquare: coveredAreaMetreSquare,
                    squareFeet: coveredAreaSquareFeet
                },
                details: landSizeDetails.trim() || null,
            },
            stateOfProperty: {
                empty: isEmptyProperty as boolean,
                builtUp: builtUpProperty as boolean,
                builtUpPropertyType: builtUpSelectedOption || null
            },
            location: {
                name: {
                    plotNumber: plotNumber || null,
                    village: village.trim() || null,
                    city: city.trim() || null,
                    tehsil: tehsil || null,
                    district,
                    state
                }
            },
            numberOfOwners: numberOfOwners,
            floors: {
                floorsWithoutBasement: numberOfFloorsWithoutBasement,
                basementFloors: numberOfBasementFloors
            },
            widthOfRoadFacing: {
                feet: +widthOfRoadFacingFeet,
                metre: +widthOfRoadFacingMetre
            },
            priceDemanded: {
                number: priceDemandedNumber,
                words: priceDemandedWords.trim()
            },
            legalRestrictions: {
                isLegalRestrictions,
                details: legalRestrictionDetails.trim() || null,
            },
            remarks: remarks.trim() || null
        }

        const shopSpecificData = {
            lockInPeriod: {
                years: lockInPeriodYears || null,
                months: lockInPeriodMonths || null
            },
            leasePeriod: {
                years: leasePeriodYears || null,
                months: leasePeriodMonths || null
            },
            shopPropertyType: selectedPropertyType
        }

        if (commercialPropertyType === 'shop') {
            setPropertyData({
                ...finalPropertyData,
                ...shopSpecificData
            })
        } else {
            setPropertyData(finalPropertyData)
        }

    }

    return (
        <Fragment>

            {spinner && !error && <Spinner />}

            {alert.isAlertModal && <AlertModal
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

            {/*This message is shown when an error occurs while fetching data */}
            {error && !spinner &&
                <div className="fixed top-36 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <p className="text-red-500 cursor-pointer" onClick={getPropertyDetails}>Try again</p>
                </div>}

            {!error && !spinner && propertyData &&
                <ReviewReevaluatedCommercialProperty
                    propertyId={fetchedPropertyData?._id as string}
                    propertyData={propertyData}
                    contractImages={contractImages}
                    commercialPropertyImages={commercialPropertyImages}
                    fetchedPropertyImagesUrl={fetchedPropertyImagesUrl}
                    fetchedContractImagesUrl={fetchedContractImagesUrl}
                    propertyDataReset={() => setPropertyData(null)} />}

            {!error && !spinner &&
                <div className={`pl-2 pr-2 mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center ${alert.isAlertModal || showDetailsModal ? 'blur' : ''} ${propertyData ? 'fixed right-full' : ''}`} >

                    {/*Home button */}
                    <div className='fixed flex flex-row gap-2 w-full top-16 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
                        <button
                            type='button'
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 h-8"
                            onClick={() => navigate('/field-agent/reevaluate-property/commercial-properties', { replace: true })}>
                            Back
                        </button>
                        <button
                            type='button'
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 h-8"
                            onClick={() => navigate('/field-agent', { replace: true })}>
                            Home
                        </button>
                    </div>

                    <div className="fixed w-full text-center top-28 sm:top-16 pl-4 pr-4 pb-4 sm:pt-4 bg-white z-10">
                        <p className=" text-xl font-semibold mb-2">Reevaluate the commercial property</p>
                        <button
                            type='button'
                            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded pl-2 pr-2 h-8"
                            onClick={() => setShowDetailsModal(true)}>
                            Click here to see reevaluation details
                        </button>
                    </div>

                    <form className="w-full min-h-screen mt-52 sm:mt-44 md:w-10/12 lg:w-8/12  h-fit flex flex-col rounded border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

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
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                id="built-up"
                                                name="state"
                                                value="built-up"
                                                checked={builtUpProperty === true}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setStateOfPropertyError(false)
                                                    if (e.target.checked) {
                                                        setBuiltUpProperty(true)
                                                        setIsEmptyProperty(false)
                                                    }
                                                }} />
                                            <label htmlFor="built-up">Built-up</label>
                                        </div>

                                        <div className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                id="empty"
                                                name="state"
                                                value="empty"
                                                checked={isEmptyProperty === true}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setStateOfPropertyError(false)
                                                    if (e.target.checked) {
                                                        setIsEmptyProperty(true)
                                                        setBuiltUpProperty(false)
                                                    }
                                                }} />
                                            <label htmlFor="empty">Empty</label>
                                        </div>
                                    </div>

                                    {commercialPropertyType === 'industrial' && builtUpProperty &&
                                        <div className="flex flex-col bg-white w-fit p-1 mt-2">
                                            <p className="font-semibold">Select an option</p>
                                            {builtUpPropertyOptions.map(option => {
                                                return <div
                                                    key={option}
                                                    className="flex flex-row h-fit ">
                                                    <input
                                                        className="mr-1 cursor-pointer"
                                                        type="radio"
                                                        id={option}
                                                        name="built-up-option"
                                                        value={option}
                                                        checked={builtUpSelectedOption === option}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            setStateOfPropertyError(false)
                                                            if (e.target.checked) {
                                                                setBuiltupSelectedOption(e.target.value as BuiltUpType)
                                                            }
                                                        }} />
                                                    <label htmlFor={option}>{option}</label>
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
                                    <label
                                        className="text-xl font-semibold text-gray-500 whitespace-nowrap"
                                        htmlFor="size">
                                        Area
                                    </label>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col md:flex-row gap-5">
                                        <div className="flex flex-col gap-3 bg-gray-300 w-fit p-2 pt-0">
                                            <p className="w-full text-center font-semibold">Total area</p>
                                            <div className="flex flex-row gap-1">
                                                <input
                                                    id="total-area-metre-square"
                                                    type="number"
                                                    name='total-area-metre-square'
                                                    className={`border-2 ${totalAreaError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-32`}
                                                    placeholder="Size"
                                                    value={totalAreaMetreSquare}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                                <input
                                                    id="total-area-square-feet"
                                                    type="number"
                                                    name='total-area-square-feet'
                                                    className={`border-2 ${totalAreaError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-32`}
                                                    placeholder="Size"
                                                    value={totalAreaSquareFeet}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                                <input
                                                    id="covered-area-metre-square"
                                                    type="number"
                                                    name='covered-area-metre-square'
                                                    className={`border-2 ${coveredAreaError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-32`}
                                                    placeholder="Size"
                                                    value={coveredAreaMetreSquare}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                                <input
                                                    id="coverved-area-square-feet"
                                                    type="number"
                                                    name='covered-area-square-feet'
                                                    className={`border-2 ${coveredAreaError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-32`}
                                                    placeholder="Size"
                                                    value={coveredAreaSquareFeet}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                    <textarea
                                        className="border-2 border-gray-400 rounded h-40 sm:w-80 p-1 resize-none"
                                        id="size-textarea"
                                        name="size-textarea"
                                        autoCorrect="on"
                                        autoComplete="new-password"
                                        placeholder="Add details regarding land size (optional)"
                                        value={landSizeDetails}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            setLandSizeDetails(e.target.value)
                                        }} />
                                </div>
                            </div>
                        </div>

                        {/*shop property type */}
                        {commercialPropertyType === 'shop' &&
                            <div className="p-2 pb-5 pt-5 ">
                                {propertyTypeError && <p className="text-red-500">Select atleast one property type</p>}
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500">Property type</p>
                                    </div>
                                    <div className="flex flex-col gap-1.5 mt-1">
                                        {propertyTypeOptions.map(type => {
                                            return <div key={type}>
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    id={type}
                                                    name='property-type'
                                                    value={type}
                                                    checked={selectedPropertyType === type}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        setPropertyTypeError(false)
                                                        if (e.target.checked) {
                                                            setSelectedPropertyType(e.target.value as 'booth' | 'shop' | 'showroom' | 'retail-space' | 'other')
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
                                <label
                                    className="text-xl font-semibold text-gray-500"
                                    htmlFor="floors">
                                    Number of floors (basement excluded)
                                </label>
                                <select
                                    className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center h-fit"
                                    name="floors"
                                    id="floors"
                                    value={numberOfFloorsWithoutBasement}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setNumberOfFloorsWithoutBasement(+e.target.value)
                                    }}>
                                    {arrayOfNumbers(1, 50).map(number =>
                                        <option
                                            key={number}
                                            value={number}>
                                            {number}
                                        </option>)}
                                </select>
                            </div>
                        </div>

                        {/* Number of basement floors*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 ">
                            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                <label
                                    className="text-xl font-semibold text-gray-500"
                                    htmlFor="basement">
                                    Number of basement floors
                                </label>
                                <select
                                    className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center h-fit"
                                    name="basement"
                                    id="basement"
                                    value={numberOfBasementFloors}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setNumberOfBasementFloors(+e.target.value)
                                    }}>
                                    {arrayOfNumbers(0, 5).map(number =>
                                        <option
                                            key={number}
                                            value={number}>
                                            {number}
                                        </option>)}
                                </select>
                            </div>
                        </div>

                        {/*lock in period*/}
                        {commercialPropertyType === 'shop' &&
                            <div className="flex flex-row p-2 pb-5 pt-5 gap-5 sm:gap-16 bg-gray-100">
                                <p className="text-xl font-semibold text-gray-500 whitespace-nowrap">Lock-in period</p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-row gap-2">
                                        <select
                                            className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                            name="lock-in-period-years"
                                            id="lock-in-period-years"
                                            value={lockInPeriodYears}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setLockInPeriodYears(+e.target.value)
                                            }}>
                                            {arrayOfNumbers(0, 21).map(number =>
                                                <option
                                                    key={number}
                                                    value={number}>
                                                    {number}
                                                </option>)}
                                        </select>
                                        <label htmlFor="lock-in-period-years">Years</label>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <select
                                            className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                            name="lock-in-period-months"
                                            id="lock-in-period-months"
                                            value={lockInPeriodMonths}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setLockInPeriodMonths(+e.target.value)
                                            }}>
                                            {arrayOfNumbers(0, 12).map(number =>
                                                <option
                                                    key={number}
                                                    value={number}>
                                                    {number}
                                                </option>)}
                                        </select>
                                        <label htmlFor="lock-in-period-months">Months</label>
                                    </div>
                                </div>
                            </div>}

                        {/*lease period*/}
                        {commercialPropertyType === 'shop' &&
                            <div className="flex flex-row p-2 pb-5 pt-5 gap-5 sm:gap-16">
                                <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Lease period</p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-row gap-2">
                                        <select
                                            className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                            name="lease-years"
                                            id="lease-years"
                                            value={leasePeriodYears}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setLeasePeriodYears(+e.target.value)
                                            }}>
                                            {arrayOfNumbers(0, 21).map(number =>
                                                <option
                                                    key={number}
                                                    value={number}>
                                                    {number}
                                                </option>)}
                                        </select>
                                        <label htmlFor="lease-years">Years</label>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <select
                                            className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                            name="lease-months"
                                            id="lease-months"
                                            value={leasePeriodMonths}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                setLeasePeriodMonths(+e.target.value)
                                            }}>
                                            {arrayOfNumbers(0, 12).map(number =>
                                                <option
                                                    key={number}
                                                    value={number}>
                                                    {number}
                                                </option>)}
                                        </select>
                                        <label htmlFor="lease-months">Months</label>
                                    </div>
                                </div>
                            </div>}

                        {/* contract*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                            <div className="flex flex-row gap-5">
                                <label
                                    className="text-gray-500 text-xl font-semibold"
                                    htmlFor="image">
                                    Upload images of contract between seller and dealer (optional)
                                </label>
                                <input
                                    type="file"
                                    className='text-transparent'
                                    placeholder="image"
                                    accept="image/png, image/jpeg"
                                    name='image'
                                    onChange={contractImageHandler} />
                            </div>
                            <div className='flex flex-wrap justify-center gap-5 p-5'>
                                {fetchedContractImagesUrl && fetchedContractImagesUrl.length !== 0 && fetchedContractImagesUrl.map(url => {
                                    return <div
                                        key={Math.random()}
                                        className='relative w-fit'>
                                        <img
                                            className='relative w-auto h-60'
                                            src={url}
                                            alt="" />
                                        <div
                                            className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer'
                                            onClick={() => {
                                                const updatedState = fetchedContractImagesUrl.filter(item => item !== url)
                                                setFetchedContractImagesUrl(updatedState)
                                            }}>
                                            X
                                        </div>
                                    </div>
                                })}
                                {contractImages.length !== 0 &&
                                    contractImages.map(image => {
                                        return <div
                                            key={Math.random()}
                                            className='relative w-fit'>
                                            <img
                                                className='relative w-auto h-60'
                                                src={image.file}
                                                alt="" />
                                            <div
                                                className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer'
                                                onClick={() => {
                                                    const updatedState = contractImages.filter(item => item.file !== image.file)
                                                    setContractImages(updatedState)
                                                }}>
                                                X
                                            </div>
                                        </div>
                                    })}
                            </div>
                        </div>

                        {/*location */}
                        <div className="flex flex-col p-2 pb-5 pt-5">

                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500">Property location</p>
                            </div>

                            <div className="flex flex-col place-self-center w-11/12 gap-2">
                                <div className="flex flex-col w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="plot">
                                        Plot No.
                                    </label>
                                    <input
                                        type="number"
                                        id="plotNumber"
                                        name="plotNumber"
                                        className='border-2 border-gray-500  p-1 rounded' autoComplete="new-password"
                                        value={plotNumber}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (+e.target.value > 0) {
                                                return setPlotNumber(+e.target.value)
                                            }
                                            setPlotNumber('')
                                        }} />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="village">
                                        Village
                                    </label>
                                    <input
                                        type="text"
                                        id="village"
                                        name="village"
                                        className='border-2 border-gray-500  p-1 rounded'
                                        autoComplete="new-password"
                                        value={village}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setVillage(e.target.value)
                                        }} />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="city">
                                        City/Town
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className='border-2 border-gray-500 p-1 rounded' autoComplete="new-password"
                                        value={city}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setCity(e.target.value)
                                        }} />
                                </div>

                                <div className="flex flex-col w-full">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <label
                                            className="text-gray-500 font-semibold"
                                            htmlFor="state">
                                            State
                                        </label>
                                    </div>
                                    <select
                                        className={`border-2 ${stateError ? 'border-red-500' : 'border-gray-500'}  p-1 rounded`}
                                        name="state"
                                        id="state"
                                        value={state}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setStateError(false)
                                            setState(e.target.value)
                                            setDistrict('')
                                            setTehsil('')
                                        }}>
                                        <option
                                            className="text-gray-500 font-semibold"
                                            value=""
                                            disabled>
                                            Select a state:
                                        </option>
                                        {states.map(state => {
                                            return <option
                                                key={state}
                                                value={state}>
                                                {capitalizeFirstLetterOfAString(state)}
                                            </option>
                                        })}
                                    </select>
                                    {stateError && <p className="text-red-500">Select a state</p>}
                                </div>

                                <div className="flex flex-col w-full">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <label
                                            className="text-gray-500 font-semibold"
                                            htmlFor="district">
                                            District
                                        </label>
                                    </div>
                                    <select
                                        className={`border-2 ${districtError ? 'border-red-500' : 'border-gray-500'}  p-1 rounded`}
                                        name="district"
                                        id="district"
                                        value={district}
                                        disabled={state ? false : true}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setDistrictError(false)
                                            setDistrict(e.target.value)
                                            setTehsil('')
                                        }}>
                                        <option
                                            className="font-semibold"
                                            value=""
                                            disabled>
                                            Select a district
                                        </option>
                                        {state === 'punjab' &&
                                            punjabDistricts.map(district => {
                                                return <option
                                                    key={district}
                                                    value={district}>
                                                    {capitalizeFirstLetterOfAString(district)}
                                                </option>
                                            })}
                                        {state === 'chandigarh' &&
                                            <option value="chandigarh">
                                                Chandigarh
                                            </option>}
                                    </select>
                                    {districtError && <p className="text-red-500">Select a district</p>}
                                </div>

                                <div className="flex flex-col w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="state">
                                        Tehsil
                                    </label>
                                    <select
                                        className='border-2 border-gray-500 p-1 rounded'
                                        name="state"
                                        id="state"
                                        disabled={state && district ? false : true}
                                        value={tehsil}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setTehsil(e.target.value)
                                        }}>
                                        <option
                                            className="font-semibold"
                                            value=""
                                            disabled>
                                            Select a tehsil
                                        </option>
                                        {state === 'chandigarh' && district === 'chandigarh' &&
                                            <option value='chandigarh'>
                                                Chandigarh
                                            </option>}
                                        {state === 'punjab' && <PunjabTehsilsDropdown district={district} />}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Number of owners*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                <label
                                    className="text-xl font-semibold text-gray-500"
                                    htmlFor="owners">
                                    Number of owners
                                </label>
                                <select
                                    className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                    name="owners"
                                    id="owners"
                                    value={numberOfOwners}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setNumberOfOwners(+e.target.value)
                                    }}>
                                    {arrayOfNumbers(1, 10).map(number =>
                                        <option
                                            key={number}
                                            value={number}>
                                            {number}
                                        </option>)}
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
                                    <label
                                        className="text-xl font-semibold text-gray-500 whitespace-nowrap"
                                        htmlFor="size">
                                        Price (Rs)
                                    </label>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <input
                                        id="price-number"
                                        type="number"
                                        name='price-number'
                                        className={`border-2 ${priceDemandedNumberError ? 'border-red-400' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-40`}
                                        placeholder="Number"
                                        value={priceDemandedNumber}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.value.trim() && +e.target.value.trim() !== 0) {
                                                setPriceDemandedNumberError(false)
                                                setPriceDemandedNumber(+e.target.value.trim())
                                            } else {
                                                setPriceDemandedNumber('')
                                            }
                                        }} />
                                    <textarea
                                        className={`border-2 ${priceDemandedWordsError ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-56 sm:w-80 resize-none`}
                                        id="price-words"
                                        rows={3}
                                        name="price-words"
                                        autoCorrect="on"
                                        autoComplete="new-password"
                                        placeholder="Words"
                                        value={priceDemandedWords}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                                        <input
                                            className="mr-1 cursor-pointer"
                                            type="radio"
                                            id="yes"
                                            name="restrictions"
                                            value="yes"
                                            checked={isLegalRestrictions === true}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                        <input
                                            className=" mr-1 cursor-pointer"
                                            type="radio"
                                            id="no"
                                            name="restrictions"
                                            value="no"
                                            checked={isLegalRestrictions === false}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                            {isLegalRestrictions &&
                                <div className="text-center">
                                    <textarea
                                        className={`border-2 ${legalRestrictionDetailsError ? 'border-red-400' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`}
                                        id="restrictions"
                                        name="restrictions"
                                        autoCorrect="on"
                                        autoComplete="new-password"
                                        placeholder="Add details about restrictions"
                                        value={legalRestrictionDetails}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                                        <input
                                            id="road-facing-feet"
                                            type="number"
                                            name='road-facing-feet'
                                            className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-20`}
                                            placeholder="Size"
                                            value={widthOfRoadFacingFeet}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                        <input
                                            id="road-facing-metre"
                                            type="number"
                                            name='road-facing-metre'
                                            className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-20`}
                                            placeholder="Size"
                                            value={widthOfRoadFacingMetre}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                            {commercialPropertyImageError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
                            <div className="flex flex-row gap-5">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label
                                        className="text-gray-500 text-xl font-semibold w-40"
                                        htmlFor="image">
                                        Add property image
                                    </label>
                                </div>
                                <input
                                    type="file"
                                    className='text-transparent'
                                    placeholder="image"
                                    accept="image/png, image/jpeg"
                                    name='image'
                                    onChange={commercialPropertyImageHandler} />
                            </div>
                            <div className='flex flex-wrap justify-center gap-5 p-5'>
                                {fetchedPropertyImagesUrl.length !== 0 &&
                                    fetchedPropertyImagesUrl.map(url => {
                                        return <div
                                            key={Math.random()}
                                            className='relative w-fit bg-blue-300'>
                                            <img
                                                className='relative w-auto h-60'
                                                src={url}
                                                alt="" />
                                            <div
                                                className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer'
                                                onClick={() => {
                                                    const updatedState = fetchedPropertyImagesUrl.filter(item => item !== url)
                                                    setFetchedPropertyImagesUrl(updatedState)
                                                }}>
                                                X
                                            </div>
                                        </div>
                                    })}
                                {commercialPropertyImages.length !== 0 &&
                                    commercialPropertyImages.map(image => {
                                        return <div
                                            key={Math.random()}
                                            className='relative w-fit bg-blue-300'>
                                            <img
                                                className='relative w-auto h-60'
                                                src={image.file}
                                                alt="" />
                                            <div
                                                className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer'
                                                onClick={() => {
                                                    const updatedState = commercialPropertyImages.filter(item => item.file !== image.file)
                                                    setCommercialPropertyImages(updatedState)
                                                }}>
                                                X
                                            </div>
                                        </div>
                                    })}
                            </div>
                        </div>

                        {/*remarks*/}
                        <div className="flex flex-row gap-10 p-2 pb-5 pt-5">
                            <label
                                className="text-xl font-semibold text-gray-500 whitespace-nowrap"
                                htmlFor="remarks">
                                Remarks
                            </label>
                            <textarea
                                className="border-2 border-gray-400 rounded h-40 sm:w-80 p-1 resize-none"
                                id="remarks"
                                name="remarks"
                                autoCorrect="on"
                                autoComplete="new-password"
                                placeholder="Add remarks regarding property"
                                value={remarks}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setRemarks(e.target.value)
                                }} />
                        </div>

                        <div className="flex justify-center mt-4 p-2">
                            <button
                                type='submit'
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">
                                Save
                            </button>
                        </div>
                    </form>
                </div >}

            {!error && !spinner && !propertyData && showDetailsModal && fetchedPropertyData && fetchedPropertyData.evaluationData.incompletePropertyDetails &&
                <ReevaluationDetailsModal
                    details={fetchedPropertyData.evaluationData.incompletePropertyDetails}
                    detailsModalRemover={() => setShowDetailsModal(false)}
                />}

        </Fragment >
    )
}
export default ReevaluateCommercialProperty