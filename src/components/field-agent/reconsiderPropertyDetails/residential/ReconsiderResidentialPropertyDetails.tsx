import React, { Fragment, useState, useEffect, ChangeEvent, FormEvent, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AlertModal from '../../../AlertModal'
import { punjabDistricts } from '../../../../utils/tehsilsAndDistricts/districts'
import PunjabTehsilsDropdown from "../../../tehsilsDropdown/Punjab"
import Spinner from "../../../Spinner"
import { generateNumberArray } from "../../../../utils/arrayFunctions"
import { capitalizeFirstLetterOfAString } from "../../../../utils/stringUtilityFunctions"
import { FaEdit } from "react-icons/fa";
import DetailsModal from "../DetailsModal"
import ReviewReconsideredResidentialPropertyDetails from "./ReviewReconsideredResidentialPropertyDetails"
import { FlooringType, WallType, RoofType, WindowType, SafetySystemType, ConditionOfPropertyType, PropertyDataType, SaleType, HouseSpecificDataType, DataCommonToHouseAndFlatType } from "../../../../dataTypes/residentialPropertyTypes"
import { AlertType } from "../../../../dataTypes/alertType"

interface ImageType {
    file: string;
    upload: File;
}

//This component is a form used by a field agent to add a residential property
const ReconsiderResidentialPropertyDetails: React.FC = () => {

    const navigate = useNavigate()
    const authToken: string | null = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
            return
        }
    }, [authToken, navigate])

    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const propertyId: string | null = queryParams.get('propertyId')
    useEffect(() => {
        if (!propertyId) {
            navigate('/field-agent')
            return
        }
    }, [propertyId, navigate])

    const states: string[] = ['chandigarh', 'punjab']

    const [fetchedPropertyData, setFetchedPropertyData] = useState<PropertyDataType | null>(null)

    const [propertyData, setPropertyData] = useState<PropertyDataType | null>(null)

    const [editForm, setEditForm] = useState<boolean>(false)

    const [showDealerDetails, setShowDealerDetails] = useState<boolean>(false)
    const [showReevaluationDetails, setShowReevaluationDetails] = useState<boolean>(true)
    const [dealerInfo, setDealerInfo] = useState<{
        propertyDealerName: string,
        firmName: string,
        email: string,
        contactNumber: number
    } | null>(null)

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })
    const [spinner, setSpinner] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const [propertyTitle, setPropertyTitle] = useState<string>('') //title of the proeprty
    const [propertyTitleErrorMessage, setPropertyTitleErrorMessage] = useState<string>('') //Error message to be shown when no title is provided

    const [propertyDetail, setPropertyDetail] = useState<string>('') //details of property
    const [propertyDetailError, setPropertyDetailError] = useState<boolean>(false) //It is true if property details are not property

    const [priceErrorMessage, setPriceErrorMessage] = useState<string>('') //Meesage to be shown when no price is provided
    const [isDeclareFixedPrice, setIsDeclaredFixedPrice] = useState<boolean>(false) //Is true if user wants to give a fixed price
    const [isRangeOfPrice, setIsRangeOfPrice] = useState<boolean>(false) //Is true if user wants to give a range of price
    const [fixedPrice, setFixedPrice] = useState<number | ''>('') //fixed price provided by the user
    const [fixedPriceError, setFixedPriceError] = useState<boolean>(false) //It is true if fixed price is not provided by the user
    const [rangeOfPriceFrom, setRangeOfPriceFrom] = useState<number | ''>('') //It is a number which stores the lower value of the range
    const [rangeOfPriceFromError, setRangeOfPriceFromError] = useState<boolean>(false) //It is true if rangeOfPriceFrom is not provided by the user
    const [rangeOfPriceTo, setRangeOfPriceTo] = useState<number | ''>('') //It is a number which stores the upper value of the range
    const [rangeOfPriceToError, setRangeOfPriceToError] = useState<boolean>(false) //It is true if rangeOfPriceTo is not provided by the user

    const [isWaterSupply, setIsWaterSupply] = useState<boolean | null>(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [isWaterSupplyTwentyFourHours, setIsWaterSupplyTwentyFourHours] = useState<boolean | null>(null) ////It is true if yes option is selected. It is false if the option no is selected. It is null if the user selets neither of the option
    const [waterSupplyError, setWaterSupplyError] = useState<boolean>(false) //If isWaterSupply is null, this is set to true
    const [waterSupplyTwentyFourHoursError, setWaterSupplyTwentyFourHoursError] = useState<boolean>(false)//If  isWaterSupplyTwentyFourHours is null, this is set to true

    const [electricityConnection, setElectricityConnection] = useState<boolean | null>(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [electricityConnectionError, setElectricityConnectionError] = useState<boolean>(false) //If electricityConnection is null, this is set to true

    const [sewageSystem, setSewageSystem] = useState<boolean | null>(null)//It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [sewageSystemError, setSewageSystemError] = useState<boolean>(false) //If sewageSystem is null, this is set to true

    const [cableTV, setCableTV] = useState<boolean | null>(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [cableTVError, setCableTVError] = useState<boolean>(false) //If cableTV is null, this is set to true

    const [highSpeedInternet, setHighSpeedInternet] = useState<boolean | null>(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [highSpeedInternetError, setHighSpeedInternetError] = useState<boolean>(false) //If highSpeedInternet is null, this is set to true

    //The states below stores distances from a certain point, and the errors are set to true if a distance is not provided by the user
    const [distanceFromGroceryStore, setDistanceFromGroceryStore] = useState<number | ''>('')
    const [distanceFromGroceryStoreError, setDistanceFromGroceryStoreError] = useState<boolean>(false)
    const [distanceFromRestaurantCafe, setDistanceFromRestaurantCafe] = useState<number | ''>('')
    const [distanceFromRestaurantCafeError, setDistanceFromRestaurantCafeError] = useState<boolean>(false)
    const [distanceFromExerciseArea, setDistanceFromExerciseArea] = useState<number | ''>('')
    const [distanceFromExerciseAreaError, setDistanceFromExerciseAreaError] = useState<boolean>(false)
    const [distanceFromSchool, setDistanceFromSchool] = useState<number | ''>('')
    const [distanceFromSchoolError, setDistanceFromSchoolError] = useState<boolean>(false)
    const [distanceFromHospital, setDistanceFromHospital] = useState<number | ''>('')
    const [distanceFromHospitalError, setDistanceFromHospitalError] = useState<boolean>(false)

    const areaTypeOptions: string[] = ['rural', 'urban', 'sub-urban']
    const [areaType, setAreaType] = useState<'rural' | 'urban' | 'sub-urban'>() //It stores the type of area selected by user
    const [areaTypeError, setAreaTypeError] = useState<boolean>(false) //An error is shown if the user areaType state in null

    const [numberOfFloors, setNumberOfFloors] = useState<number>(1) //Stores number of floors in a property

    const [typeOfSale, setTypeOfSale] = useState<SaleType>() //It stores the type of sale selected by user
    const [typeOfSaleError, setTypeOfSaleError] = useState<boolean>(false) //An error is shown if the user typeOfSale state in null

    const [totalAreaMetreSquare, setTotalAreaMetreSquare] = useState<number | ''>('') //Total area of the property in metre square
    const [totalAreaGajj, setTotalAreaGajj] = useState<number | ''>('') //Total area of the property in gajj
    const [totalAreaMetreSquareError, setTotalAreaErrorMetreSquareError] = useState<boolean>(false) //It is false if totalAreaMetreSquare state is empty, and vice-versa
    const [totalAreaGajjError, setTotalAreaGajjError] = useState<boolean>(false) //It is false if totalAreaGajj state is empty, and vice-versa

    const [coveredAreaMetreSquare, setCoveredAreaMetreSquare] = useState<number | ''>('') //covered area of the property in metre square
    const [coveredAreaGajj, setCoveredAreaGajj] = useState<number | ''>('') //covered area of the property in gajj
    const [coveredAreaMetreSquareError, setCoveredAreaErrorMetreSquareError] = useState<boolean>(false) //It is false if coveredAreaMetreSquare state is empty, and vice-versa
    const [coveredAreaGajjError, setCoveredAreaGajjError] = useState<boolean>(false) //It is false if coveredAreaGajj state is empty, and vice-versa

    const [numberOfLivingRooms, setNumberOfLivingRooms] = useState<number>(1)
    const [numberOfBedrooms, setNumberOfBedrooms] = useState<number>(1)
    const [numberOfOfficeRooms, setNumberOfOfficeRooms] = useState<number>(0)
    const [numberOfWashrooms, setNumberOfWashrooms] = useState<number>(1)
    const [numberOfKitchen, setNumberOfKitchen] = useState<number>(1)
    const [numberOfCarParkingSpaces, setNumberOfCarParkingSpaces] = useState<number>(0)
    const [numberOfBalconies, setNumberOfBalconies] = useState<number>(0)

    const [storeRoom, setStoreRoom] = useState<boolean | null>(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [storeRoomError, setStoreRoomError] = useState<boolean>(false) //If storeRoom is null, this is set to true

    const [servantRoom, setServantRoom] = useState<boolean | null>(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [servantRoomError, setServantRoomError] = useState<boolean>(false) //If servantRoom is null, this is set to true

    const [furnishing, setFurnishing] = useState<'fully-furnished' | 'semi-furnished' | 'unfurnished'>()//It stores a value when a radio button is clicked
    const [furnishingError, setFurnishingError] = useState<boolean>(false) //If furnishing is null, this is set to true
    const [furnishingDetails, setFurnishingDetails] = useState<string>('') //Details of furnishing
    const [furnishingDetailsError, setFurnishingDetailsError] = useState<boolean>(false) //It is true if furnishingDetails state is empty

    const [kitchenFurnishing, setKitchenFurnishing] = useState<'modular' | 'semi-furnished' | 'unfurnished'>()
    const [kitchenFurnishingError, setKitchenFurnishingError] = useState<boolean>(false) //If kitchenFurnishing is null, this is set to true
    const [kitchenFurnishingDetails, setKitchenFurnishingDetails] = useState<string>('') //Details of kitchen furnishing
    const [kitchenFurnishingDetailsError, setKitchenFurnishingDetailsError] = useState<boolean>(false) //It is true if kitchenFurnishingDetails state is empty

    const [kitchenAppliances, setKitchenAppliances] = useState<boolean | null>(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [kitchenAppliancesDetails, setKitchenAppliancesDetails] = useState<string>('') //Details of kitchen appliances
    const [kitchenAppliancesError, setKitchenAppliancesError] = useState<boolean>(false)  //If kitchenAppliances is null, this is set to true
    const [kitchenAppliancesDetailsError, setKitchenAppliancesDetailsError] = useState<boolean>(false) //It is true if kitchenAppliancesDetails state is empty

    const [washroomFitting, setWashRoomFitting] = useState<'standard' | 'premium' | 'luxurious'>() //It stores a value when a radio button is clicked
    const [washroomFittingError, setWashRoomFittingError] = useState<boolean>(false) //If washroomFitting is null, this is set to true

    const [electricalFitting, setElectricalFitting] = useState<'standard' | 'premium' | 'luxurious'>() //It is null when no radio button is selected, and stores a value when a radio button is clicked
    const [electricalFittingError, setElectricalFittingError] = useState<boolean>(false) //If electricalFitting is null, this is set to true

    const [flooringTypeArray, setFlooringTypeArray] = useState<FlooringType[]>([]) //It is null when no checkbox is selected. If checkboxes are selected, The array stores the values of all the checkboxes selected
    const [flooringTypeError, setFlooringTypeError] = useState<boolean>(false) //If flooringTypeArray is null, this is set to true
    const flooringTypeOptions = ['cemented', 'marble', 'luxurious marble', 'standard tiles', 'premium tiles', 'luxurious tiles']

    const [roofTypeArray, setRoofTypeArray] = useState<RoofType[]>([]) //It is null when no checkbox is selected. If checkboxes are selected, The array stores the values of all the checkboxes selected
    const [roofTypeError, setRoofTypeError] = useState<boolean>(false) //If roofTypeArray is null, this is set to true
    const roofTypeOptions = ['standard', 'pop work', 'down ceiling']

    const [wallTypeArray, setWallTypeArray] = useState<WallType[]>([])
    const [wallTypeError, setWallTypeError] = useState<boolean>(false)
    const wallTypeOptions = ['plaster', 'paint', 'premium paint', 'wall paper', 'pvc panelling', 'art work']

    const [windowTypeArray, setWindowTypeArray] = useState<WindowType[]>([]) //It is null when no checkbox is selected. If checkboxes are selected, The array stores the values of all the checkboxes selected
    const [windowTypeError, setWindowTypeError] = useState<boolean>(false) //If windowTypeArray is null, this is set to true
    const windowTypeOptions = ['standard', 'wood', 'premium material']

    const [safetySystemArray, setSafetySystemArray] = useState<SafetySystemType[]>([]) //If checkboxes are selected, The array stores the values of all the checkboxes selected
    const safetySystemOptions = ['cctv', 'glass break siren', 'entry sensor', 'motion sensor', 'panic button', 'keypad', 'keyfob', 'smoke detector', 'co detector', 'water sprinkler', 'doorbell camera']

    const [garden, setGarden] = useState<boolean | null>(null)  //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
    const [gardenDetails, setGardenDetails] = useState<string>('') //Details of garden
    const [gardenError, setGardenError] = useState<boolean>(false) //If garden state is null, this is set to true
    const [gardenDetailsError, setGardenDetailsError] = useState<boolean>(false) //It is true if gardenDetails state is empty

    const [ageOfConstruction, setAgeOfConstruction] = useState<number | ''>('') //It consist of a number that represents age of construction
    const [ageOfConstructionError, setAgeOfConstructionError] = useState<boolean>(false) //If ageOfConstruction state is empty, this state is set to true

    const [conditionOfProperty, setConditionOfProperty] = useState<ConditionOfPropertyType>() //It is null when no radio button is selected, and stores a value when a radio button is clicked
    const [conditionOfPropertyError, setConditionOfPropertyError] = useState<boolean>(false) //if conditionOfProperty state is null, this state is set to true
    const conditionOfPropertyOptions = ['exceptionally new', 'near to new', 'some signs of agying', 'need some renovations', 'needs complete renovation']

    const [numberOfOwners, setNumberOfOwners] = useState<number>(1)

    const [isLegalRestrictions, setIsLegalRestrictions] = useState<boolean | null>(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the options
    const [legalRestrictionError, setLegalRestrictionError] = useState<boolean>(false) //If isLegalRestrictions state is null, this state is set to true
    const [legalRestrictionDetails, setLegalRestrictionDetails] = useState<string>('') //stores details about legal restrictions
    const [legalRestrictionDetailsError, setLegalRestrictionDetailsError] = useState<boolean>(false) //if  legalRestrictionDetails state is empty, this state is set to true

    const [propertyTaxes, setPropertyTaxes] = useState<number | ''>('') //This states stores a number representing property taxes

    const [homeOwnersAssociationFees, setHomeOwnersAssociationFees] = useState<number | ''>('') //This states stores a number representing home owners association fees

    //The states below are for location of the property
    const [state, setState] = useState<string>('')
    const [stateError, setStateError] = useState<boolean>(false)
    const [district, setDistrict] = useState<string>('')
    const [districtError, setDistrictError] = useState<boolean>(false)
    const [city, setCity] = useState<string>('')
    const [tehsil, setTehsil] = useState<string>('')
    const [village, setVillage] = useState<string>('')

    //The states below are for the uploading property images
    const [propertyImageFileError, setPropertyImageFileError] = useState<boolean>(false)
    const [propertyImages, setResidentialPropertyImages] = useState<ImageType[]>([])
    const [fetchedPropertyImagesUrl, setFetchedPropertyImagesUrl] = useState<string[]>([])

    const [contractImages, setContractImages] = useState<ImageType[]>([])
    const [fetchedContractImagesUrl, setFetchedContractImagesUrl] = useState<string[]>([])


    const residentialPropertyType = fetchedPropertyData?.residentialPropertyType

    useEffect(() => {
        if (fetchedPropertyData) {
            if (residentialPropertyType === 'house' && fetchedPropertyData.typeOfSale) {
                setTypeOfSale(fetchedPropertyData.typeOfSale)
            }

            if (residentialPropertyType === 'house' || residentialPropertyType === 'flat') {
                setNumberOfFloors(fetchedPropertyData.numberOfOwners)
                if (fetchedPropertyData.numberOfLivingRooms) {
                    setNumberOfLivingRooms(fetchedPropertyData.numberOfLivingRooms)
                }
                if (fetchedPropertyData.numberOfBedrooms) {
                    setNumberOfBedrooms(fetchedPropertyData.numberOfBedrooms)
                }
                if (fetchedPropertyData.numberOfOfficeRooms) {
                    setNumberOfOfficeRooms(fetchedPropertyData.numberOfOfficeRooms)
                }
                if (fetchedPropertyData.numberOfWashrooms) {
                    setNumberOfWashrooms(fetchedPropertyData.numberOfWashrooms)
                }
                if (fetchedPropertyData.numberOfWashrooms) {
                    setNumberOfWashrooms(fetchedPropertyData.numberOfWashrooms)
                }
                if (fetchedPropertyData.numberOfKitchen) {
                    setNumberOfKitchen(fetchedPropertyData.numberOfKitchen)
                }
                if (fetchedPropertyData.numberOfCarParkingSpaces) {
                    setNumberOfCarParkingSpaces(fetchedPropertyData.numberOfCarParkingSpaces)
                }
                if (fetchedPropertyData.numberOfBalconies) {
                    setNumberOfBalconies(fetchedPropertyData.numberOfBalconies)
                }
                if (fetchedPropertyData.storeRoom) {
                    setStoreRoom(fetchedPropertyData.storeRoom)
                }
                if (fetchedPropertyData.servantRoom) {
                    setServantRoom(fetchedPropertyData.servantRoom)
                }
                if (fetchedPropertyData.furnishing && fetchedPropertyData.furnishing.type) {
                    setFurnishing(fetchedPropertyData.furnishing.type)
                }
                if (fetchedPropertyData.furnishing) {
                    setFurnishingDetails(fetchedPropertyData.furnishing.details || '')
                }
                if (fetchedPropertyData.kitchenFurnishing) {
                    setKitchenFurnishing(fetchedPropertyData.kitchenFurnishing.type)
                }
                if (fetchedPropertyData.kitchenFurnishing) {
                    setKitchenFurnishingDetails(fetchedPropertyData.kitchenFurnishing.details || '')
                }
                if (fetchedPropertyData.kitchenAppliances) {
                    setKitchenAppliances(fetchedPropertyData.kitchenAppliances.available)
                }
                if (fetchedPropertyData.kitchenAppliances) {
                    setKitchenAppliancesDetails(fetchedPropertyData.kitchenAppliances.details || '')
                }
                if (fetchedPropertyData.washroomFitting) {
                    setWashRoomFitting(fetchedPropertyData.washroomFitting)
                }
                if (fetchedPropertyData.flooringTypeArray) {
                    setFlooringTypeArray(fetchedPropertyData.flooringTypeArray)
                }
                if (fetchedPropertyData.electricalFitting) {
                    setElectricalFitting(fetchedPropertyData.electricalFitting)
                }
                if (fetchedPropertyData.roofTypeArray) {
                    setRoofTypeArray(fetchedPropertyData.roofTypeArray)
                }
                if (fetchedPropertyData.wallTypeArray) {
                    setWallTypeArray(fetchedPropertyData.wallTypeArray)
                }
                if (fetchedPropertyData.windowTypeArray) {
                    setWindowTypeArray(fetchedPropertyData.windowTypeArray)
                }
                if (fetchedPropertyData.safetySystemArray) {
                    setSafetySystemArray(fetchedPropertyData.safetySystemArray)
                }
                if (fetchedPropertyData.garden && fetchedPropertyData.garden.available) {
                    setGarden(fetchedPropertyData.garden.available)
                }
                if (fetchedPropertyData.garden) {
                    setGardenDetails(fetchedPropertyData.garden.details || '')
                }
                if (fetchedPropertyData.ageOfConstruction) {
                    setAgeOfConstruction(fetchedPropertyData.ageOfConstruction)
                }
                setConditionOfProperty(fetchedPropertyData.conditionOfProperty)
            }

            setPropertyTitle(fetchedPropertyData?.title)
            setPropertyDetail(fetchedPropertyData.details || '')
            setIsDeclaredFixedPrice(fetchedPropertyData.priceData.fixed ? true : false)
            setIsRangeOfPrice(fetchedPropertyData.priceData.fixed ? false : true)
            setFixedPrice(fetchedPropertyData.priceData.fixed || '')
            setRangeOfPriceFrom(fetchedPropertyData.priceData.range.from || '')
            setRangeOfPriceTo(fetchedPropertyData.priceData.range.to || '')
            setIsWaterSupply(fetchedPropertyData.waterSupply.available)
            setIsWaterSupplyTwentyFourHours(fetchedPropertyData.waterSupply.twentyFourHours)
            setElectricityConnection(fetchedPropertyData.electricityConnection)
            setSewageSystem(fetchedPropertyData.sewageSystem)
            setCableTV(fetchedPropertyData.cableTV)
            setHighSpeedInternet(fetchedPropertyData.highSpeedInternet)
            setDistanceFromGroceryStore(fetchedPropertyData.distance.distanceFromGroceryStore)
            setDistanceFromRestaurantCafe(fetchedPropertyData.distance.distanceFromRestaurantCafe)
            setDistanceFromExerciseArea(fetchedPropertyData.distance.distanceFromExerciseArea)
            setDistanceFromSchool(fetchedPropertyData.distance.distanceFromSchool)
            setDistanceFromHospital(fetchedPropertyData.distance.distanceFromHospital)
            setAreaType(fetchedPropertyData.areaType)
            if (fetchedPropertyData.area && fetchedPropertyData.area.totalArea && fetchedPropertyData.area.coveredArea) {
                setTotalAreaMetreSquare(fetchedPropertyData.area.totalArea.metreSquare as number)
                setTotalAreaGajj(fetchedPropertyData.area.totalArea.gajj as number)
                setCoveredAreaMetreSquare(fetchedPropertyData.area.coveredArea.metreSquare as number)
                setCoveredAreaGajj(fetchedPropertyData.area.coveredArea.gajj as number)
            }
            setNumberOfOwners(fetchedPropertyData.numberOfOwners)
            setIsLegalRestrictions(fetchedPropertyData.legalRestrictions.isLegalRestrictions)
            setLegalRestrictionDetails(fetchedPropertyData.legalRestrictions.details || '')
            setPropertyTaxes(fetchedPropertyData.propertyTaxes || '')
            setHomeOwnersAssociationFees(fetchedPropertyData.homeOwnersAssociationFees || '')
            setState(fetchedPropertyData.location.name.state)
            setDistrict(fetchedPropertyData.location.name.district)
            setCity(fetchedPropertyData.location.name.city || '')
            setTehsil(fetchedPropertyData.location.name.tehsil || '')
            setVillage(fetchedPropertyData.location.name.village || '')
            if (fetchedPropertyData.propertyImagesUrl) {
                setFetchedPropertyImagesUrl(fetchedPropertyData.propertyImagesUrl)
            }
            if (fetchedPropertyData.contractImagesUrl?.length) {
                setFetchedContractImagesUrl(fetchedPropertyData.contractImagesUrl)
            }
        }
    }, [fetchedPropertyData, residentialPropertyType])

    //This function is used to get proeprty details
    const getPropertyDetails = useCallback(async () => {
        try {
            setSpinner(true)
            setError(false)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/getPropertyData?id=${propertyId}&type=residential&dealerInfo=true`, {
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
                return
            } else if (data.status === 'ok') {
                setSpinner(false)
                setFetchedPropertyData(data.propertyData)
                setDealerInfo(data.dealerInfo)
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [propertyId, authToken, navigate])
    useEffect(() => {
        getPropertyDetails()
    }, [getPropertyDetails])

    //This function is triggered when the user selects a proeprty image
    const propertyImageHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (propertyImages.length >= 20) {
            return
        }
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setPropertyImageFileError(false);
            setResidentialPropertyImages((array) => [
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
        if (contractImages.length >= 20) {
            return
        }
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

    //The function is used to throw errors if the user has given incomplete data
    const errorCheckingBeforeSubmit = () => {
        if (propertyImages.length + fetchedPropertyImagesUrl.length === 0) {
            setPropertyImageFileError(true)
        }
        if (!propertyTitle.trim()) {
            setPropertyTitleErrorMessage('Provide a title')
        }

        if (!isDeclareFixedPrice && !isRangeOfPrice) {
            setPriceErrorMessage('Select an option')
        } else if ((isDeclareFixedPrice && !fixedPrice) ||
            (isRangeOfPrice && (!rangeOfPriceFrom || !rangeOfPriceTo))) {
            setPriceErrorMessage('Provide price details')
            if (isDeclareFixedPrice && !fixedPrice) {
                setFixedPriceError(true)
            }
            if (isRangeOfPrice && !rangeOfPriceFrom) {
                setRangeOfPriceFromError(true)
            }
            if (isRangeOfPrice && !rangeOfPriceTo) {
                setRangeOfPriceToError(true)
            }
        } else if (isRangeOfPrice &&
            (rangeOfPriceTo <= rangeOfPriceFrom)) {
            setPriceErrorMessage('Provide a greater price')
            setRangeOfPriceToError(true)
        }

        if (isWaterSupply === null) {
            setWaterSupplyError(true)
        } else if (isWaterSupply && isWaterSupplyTwentyFourHours === null) {
            setWaterSupplyTwentyFourHoursError(true)
        }

        if (electricityConnection === null) {
            setElectricityConnectionError(true)
        }

        if (sewageSystem === null) {
            setSewageSystemError(true)
        }

        if (cableTV === null) {
            setCableTVError(true)
        }

        if (highSpeedInternet === null) {
            setHighSpeedInternetError(true)
        }

        if (!distanceFromGroceryStore || !distanceFromRestaurantCafe || !distanceFromExerciseArea || !distanceFromSchool || !distanceFromHospital) {
            if (!distanceFromGroceryStore) {
                setDistanceFromGroceryStoreError(true)
            }
            if (!distanceFromRestaurantCafe) {
                setDistanceFromRestaurantCafeError(true)
            }
            if (!distanceFromExerciseArea) {
                setDistanceFromExerciseAreaError(true)
            }
            if (!distanceFromSchool) {
                setDistanceFromSchoolError(true)
            }
            if (!distanceFromHospital) {
                setDistanceFromHospitalError(true)
            }
        }

        if (!areaType) {
            setAreaTypeError(true)
        }

        if (!propertyImages.length) {
            setPropertyImageFileError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() === 'house' && !typeOfSale) {
            setTypeOfSaleError(true)
        }

        if (!totalAreaMetreSquare || !totalAreaGajj || !coveredAreaMetreSquare || !coveredAreaGajj) {
            if (!totalAreaGajj) {
                setTotalAreaGajjError(true)
            }
            if (!totalAreaMetreSquare) {
                setTotalAreaErrorMetreSquareError(true)
            }
            if (!coveredAreaGajj) {
                setCoveredAreaGajjError(true)
            }
            if (!coveredAreaMetreSquare) {
                setCoveredAreaErrorMetreSquareError(true)
            }
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && storeRoom === null) {
            setStoreRoomError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && servantRoom === null) {
            setServantRoomError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot') {
            if (!furnishing) {
                setFurnishingError(true)
            }
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot') {
            if (!kitchenFurnishing) {
                setKitchenFurnishingError(true)
            }
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot') {
            if (kitchenAppliances === null) {
                setKitchenAppliancesError(true)
            }
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && !washroomFitting) {
            setWashRoomFittingError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && !electricalFitting) {
            setElectricalFittingError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!flooringTypeArray || (flooringTypeArray && !flooringTypeArray.length))) {
            setFlooringTypeError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!roofTypeArray || (roofTypeArray && !roofTypeArray.length))) {
            setRoofTypeError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!wallTypeArray || (wallTypeArray && !wallTypeArray.length))) {
            setWallTypeError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!windowTypeArray || (windowTypeArray && !windowTypeArray.length))) {
            setWindowTypeError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot') {
            if (garden === null) {
                setGardenError(true)
            }
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && !ageOfConstruction) {
            setAgeOfConstructionError(true)
        }

        if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && !conditionOfProperty) {
            setConditionOfPropertyError(true)
        }

        if (isLegalRestrictions === null) {
            setLegalRestrictionError(true)
        } else if (isLegalRestrictions && !legalRestrictionDetails.trim()) {
            setLegalRestrictionDetailsError(true)
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

    }

    //The function is triggered when the user submits the form
    const formSubmit = async (event: FormEvent) => {
        event.preventDefault()

        //This function is triggered when the user has provided incomplete data
        const errorFunction = () => {
            errorCheckingBeforeSubmit()
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields',
                routeTo: null
            })
        }
        if (propertyImages.length + fetchedPropertyImagesUrl.length === 0) {
            return errorFunction()
        }
        if (!propertyTitle.trim()) {
            return errorFunction()
        } else if ((!isDeclareFixedPrice && !isRangeOfPrice) || (isDeclareFixedPrice && !fixedPrice) || (isRangeOfPrice && (!rangeOfPriceFrom || !rangeOfPriceTo)) || (isRangeOfPrice && (rangeOfPriceTo <= rangeOfPriceFrom))) {
            return errorFunction()
        } else if (isWaterSupply === null || (isWaterSupply && isWaterSupplyTwentyFourHours === null)) {
            return errorFunction()
        } else if (electricityConnection === null) {
            return errorFunction()
        } else if (sewageSystem === null) {
            return errorFunction()
        } else if (cableTV === null) {
            return errorFunction()
        } else if (highSpeedInternet === null) {
            return errorFunction()
        } else if (!distanceFromGroceryStore || !distanceFromRestaurantCafe || !distanceFromExerciseArea || !distanceFromSchool || !distanceFromHospital) {
            return errorFunction()
        } else if (!areaType) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() === 'house' && !typeOfSale) {
            return errorFunction()
        } else if (!totalAreaMetreSquare || !totalAreaGajj || !coveredAreaGajj || !coveredAreaMetreSquare) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && storeRoom === null) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && servantRoom === null) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!furnishing)) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!kitchenFurnishing)) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (kitchenAppliances === null)) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && !washroomFitting) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && !electricalFitting) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!flooringTypeArray || (flooringTypeArray && !flooringTypeArray.length))) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!roofTypeArray || (roofTypeArray && !roofTypeArray.length))) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!wallTypeArray || (wallTypeArray && !wallTypeArray.length))) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (!windowTypeArray || (windowTypeArray && !windowTypeArray.length))) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && (garden === null)) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && !ageOfConstruction) {
            return errorFunction()
        } else if (residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && !conditionOfProperty) {
            return errorFunction()
        } else if (isLegalRestrictions === null || (isLegalRestrictions && !legalRestrictionDetails.trim())) {
            return errorFunction()
        } else if (!district.trim() && !state.trim()) {
            return errorFunction()
        }

        if (!residentialPropertyType) {
            return
        }

        //Final property data submitted by the user
        const finalPropertyData: PropertyDataType = {
            residentialPropertyType,
            title: propertyTitle,
            details: propertyDetail.trim() || null,
            priceData: {
                fixed: fixedPrice || null,
                range: {
                    from: rangeOfPriceFrom || null,
                    to: rangeOfPriceTo || null
                }
            },
            waterSupply: {
                available: isWaterSupply,
                twentyFourHours: isWaterSupplyTwentyFourHours
            },
            electricityConnection,
            sewageSystem,
            cableTV,
            highSpeedInternet,
            distance: {
                distanceFromGroceryStore,
                distanceFromRestaurantCafe,
                distanceFromExerciseArea,
                distanceFromSchool,
                distanceFromHospital
            },
            areaType,
            area: {
                totalArea: {
                    metreSquare: totalAreaMetreSquare,
                    gajj: totalAreaGajj
                },
                coveredArea: {
                    metreSquare: coveredAreaMetreSquare,
                    gajj: coveredAreaGajj
                }
            },
            numberOfOwners,
            legalRestrictions: {
                isLegalRestrictions,
                details: legalRestrictionDetails.trim() || null,
            },
            propertyTaxes: propertyTaxes || null,
            homeOwnersAssociationFees: homeOwnersAssociationFees || null,
            location: {
                name: {
                    village: village.trim() || null,
                    city: city.trim() || null,
                    tehsil: tehsil || null,
                    district,
                    state
                }
            }
        }

        //data specific to house property type
        const houseSpecificData: HouseSpecificDataType = {
            typeOfSale: typeOfSale as SaleType
        }

        //data specific to house and flat property typr
        const fieldsCommonToHouseAndFlat: DataCommonToHouseAndFlatType = {
            numberOfFloors,
            numberOfLivingRooms,
            numberOfBedrooms,
            numberOfOfficeRooms,
            numberOfWashrooms,
            numberOfKitchen,
            numberOfCarParkingSpaces,
            numberOfBalconies,
            storeRoom: storeRoom as boolean,
            servantRoom: servantRoom as boolean,
            furnishing: {
                type: furnishing as 'fully-furnished' | 'semi-furnished' | 'unfurnished',
                details: furnishingDetails.trim() || null
            },
            kitchenFurnishing: {
                type: kitchenFurnishing as 'modular' | 'semi-furnished' | 'unfurnished',
                details: kitchenFurnishingDetails.trim() || null
            },
            kitchenAppliances: {
                available: kitchenAppliances as boolean,
                details: kitchenAppliancesDetails.trim() || null
            },
            washroomFitting: washroomFitting as 'standard' | 'premium' | 'luxurious',
            electricalFitting: electricalFitting as 'standard' | 'premium' | 'luxurious',
            flooringTypeArray,
            roofTypeArray,
            wallTypeArray,
            windowTypeArray,
            safetySystemArray: safetySystemArray.length ? safetySystemArray : null,
            garden: {
                available: garden as boolean,
                details: gardenDetails.trim() || null
            },
            ageOfConstruction: ageOfConstruction as number,
            conditionOfProperty: conditionOfProperty as ConditionOfPropertyType
        }

        //The if statements below are used to set property data in accordance with property type

        if (!residentialPropertyType) {
            return
        }

        if (residentialPropertyType.toLowerCase() === 'plot') {
            setPropertyData(finalPropertyData)
        } else if (residentialPropertyType.toLowerCase() === 'house') {
            setPropertyData({
                ...houseSpecificData,
                ...finalPropertyData,
                ...fieldsCommonToHouseAndFlat
            })
        } else if (residentialPropertyType.toLowerCase() === 'flat') {
            setPropertyData({
                ...finalPropertyData,
                ...fieldsCommonToHouseAndFlat
            })
        }
    }

    const waterSupplyCheckedFunction = (type: "water-supply-yes" | "water-supply-no") => {
        if (type === "water-supply-yes") {
            if (isWaterSupply) {
                return true
            } else {
                return false
            }
        }
        if (type === "water-supply-no") {
            if (isWaterSupply) {
                return false
            } else {
                return true
            }
        }
    }

    const twentyHoursWaterSupplyCheckedFunction = (type: 'water-supply-twenty-four-hours-yes' | 'water-supply-twenty-four-hours-no') => {
        if (type === "water-supply-twenty-four-hours-yes") {
            if (isWaterSupplyTwentyFourHours) {
                return true
            } else {
                return false
            }
        }
        if (type === "water-supply-twenty-four-hours-no") {
            if (isWaterSupplyTwentyFourHours) {
                return false
            } else {
                return true
            }
        }
    }

    const electricityConnectionCheckedFunction = (type: "electricity-connection-yes" | "electricity-connection-no") => {
        if (type === "electricity-connection-yes") {
            if (electricityConnection) {
                return true
            } else {
                return false
            }
        }
        if (type === "electricity-connection-no") {
            if (electricityConnection) {
                return false
            } else {
                return true
            }
        }
    }

    const sewageSystemCheckedFunction = (type: "sewage-system-yes" | "sewage-system-no") => {
        if (type === "sewage-system-yes") {
            if (sewageSystem) {
                return true
            } else {
                return false
            }
        }
        if (type === "sewage-system-no") {
            if (sewageSystem) {
                return false
            } else {
                return true
            }
        }
    }

    const cableTvCheckedFunction = (type: 'cable-tv-yes' | 'cable-tv-no') => {
        if (type === "cable-tv-yes") {
            if (cableTV) {
                return true
            } else {
                return false
            }
        }
        if (type === "cable-tv-no") {
            if (cableTV) {
                return false
            } else {
                return true
            }
        }
    }

    const internetCheckedFunction = (type: 'internet-yes' | 'internet-no') => {
        if (type === 'internet-yes') {
            if (highSpeedInternet) {
                return true
            } else {
                return false
            }
        }
        if (type === 'internet-no') {
            if (highSpeedInternet) {
                return false
            } else {
                return true
            }
        }
    }

    const storeRoomCheckedFunction = (type: 'store-room-yes' | 'store-room-no') => {
        if (type === 'store-room-yes') {
            if (storeRoom) {
                return true
            } else {
                return false
            }
        }
        if (type === 'store-room-no') {
            if (storeRoom) {
                return false
            } else {
                return true
            }
        }
    }

    const servantRoomCheckedFunction = (type: 'servant-room-yes' | 'servant-room-no') => {
        if (type === 'servant-room-yes') {
            if (servantRoom) {
                return true
            } else {
                return false
            }
        }
        if (type === 'servant-room-no') {
            if (servantRoom) {
                return false
            } else {
                return true
            }
        }
    }

    const kitchenAppliancesCheckedFunction = (type: "kitchen-appliances-yes" | "kitchen-appliances-no") => {
        if (type === 'kitchen-appliances-yes') {
            if (kitchenAppliances) {
                return true
            } else {
                return false
            }
        }
        if (type === 'kitchen-appliances-no') {
            if (kitchenAppliances) {
                return false
            } else {
                return true
            }
        }
    }

    const gardenCheckedFunction = (type: "garden-yes" | "garden-no") => {
        if (type === 'garden-yes') {
            if (garden) {
                return true
            } else {
                return false
            }
        }
        if (type === 'garden-no') {
            if (garden) {
                return false
            } else {
                return true
            }
        }
    }

    const legalRestrictionCheckedFunction = (type: 'legal-restrictions-yes' | 'legal-restrictions-no') => {
        if (type === 'legal-restrictions-yes') {
            if (isLegalRestrictions) {
                return true
            } else {
                return false
            }
        }
        if (type === 'legal-restrictions-no') {
            if (isLegalRestrictions) {
                return false
            } else {
                return true
            }
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

            {/*Home button */}
            {!propertyData && <button
                type='button'
                className={` ${alert.isAlertModal || showDealerDetails || showReevaluationDetails ? 'blur' : ''} fixed top-16 left-2 mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded pl-2 pr-2 h-8 z-30`}
                onClick={() => {
                    navigate('/field-agent', { replace: true })
                    return
                }}>
                Home
            </button>}

            {!error && !spinner &&
                <div className={`pl-2 pr-2 mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center ${alert.isAlertModal || showDealerDetails || showReevaluationDetails ? 'blur' : ''} ${propertyData ? 'fixed right-full' : ''}`} >

                    {/*Heading */}
                    {!propertyData &&
                        <div className="mt-28 sm:mt-20 w-full text-center pl-4 pr-4 pb-4 bg-white">
                            <p className=" text-xl font-semibold mb-2">Reevaluate the residential property</p>
                            <div className="w-full flex flex-row place-content-center gap-5">
                                <button
                                    type='button'
                                    className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded px-2 py-1 h-fit"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowDealerDetails(false)
                                        setShowReevaluationDetails(true)
                                    }}>
                                    Reevaluation details
                                </button>
                                <button
                                    type='button'
                                    className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded px-2 py-1 h-fit"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowDealerDetails(true)
                                        setShowReevaluationDetails(false)
                                    }}>
                                    Contact property dealer
                                </button>
                            </div>
                        </div>}

                    <form className="w-full min-h-screen md:w-10/12 lg:w-8/12  h-fit flex flex-col rounded border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

                        {!editForm && <div className=" w-full flex justify-center">
                            <FaEdit className="text-3xl text-orange-400 hover:text-orange-500 cursor-pointer font-bold " onClick={e => {
                                e.stopPropagation()
                                setEditForm(true)
                            }} />
                        </div>}

                        {/*Type of sale */}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() === 'house' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                                {typeOfSaleError && <p className="text-red-500">Select an option</p>}

                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Type of sale</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                        {["floor-for-sale", "house-for-sale"].map(type => {
                                            return <div key={type} className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    id={type}
                                                    checked={type === "house-for-sale" ? typeOfSale?.houseForSale : typeOfSale?.floorForSale}
                                                    name="type-of-sale"
                                                    disabled={editForm}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            setTypeOfSaleError(false)
                                                            if (type === "floor-for-sale") {
                                                                setTypeOfSale({
                                                                    floorForSale: true,
                                                                    houseForSale: false
                                                                })
                                                            } else {
                                                                setTypeOfSale({
                                                                    floorForSale: false,
                                                                    houseForSale: true
                                                                })
                                                            }
                                                        }
                                                    }} />
                                                <label htmlFor="floor-for-sale">Floor for sale</label>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>}

                        {/* Property type*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 ">
                            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                <p className="text-xl font-semibold text-gray-500" >Property type</p>
                                <p className="text-lg text-gray-500">{residentialPropertyType && capitalizeFirstLetterOfAString(residentialPropertyType)}</p>
                            </div>
                        </div>

                        {/*property title*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                            {propertyTitleErrorMessage.trim() &&
                                <p className="text-red-500 -mt-1">{propertyTitleErrorMessage.trim()}</p>}
                            <div className="flex flex-col sm:flex-row  sm:gap-10">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label
                                        className="text-xl font-semibold text-gray-500 whitespace-nowrap"
                                        htmlFor="property-title">
                                        Property title
                                    </label>
                                </div>

                                {!editForm && <p className="p-1">{propertyTitle}</p>}

                                {editForm && <textarea
                                    className={`border-2 ${propertyTitleErrorMessage.trim() ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-full sm:w-80 resize-none`}
                                    id="property-title"
                                    rows={5}
                                    name="property-title"
                                    autoCorrect="on"
                                    autoComplete="new-password"
                                    value={propertyTitle}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                        setPropertyTitleErrorMessage('')
                                        setPropertyTitle(e.target.value)
                                    }} />}
                            </div>
                        </div>

                        {/*property details*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 ">
                            {propertyDetailError &&
                                <p className="text-red-500 -mt-1">Details should be less than 500 characters</p>}
                            <div className="flex flex-col sm:flex-row sm:gap-10">
                                <label
                                    className="text-xl font-semibold text-gray-500 whitespace-nowrap"
                                    htmlFor="property-detail">
                                    Property details
                                </label>

                                {!editForm && <p className="p-1 rounded">{propertyDetail}</p>}
                                {editForm && <textarea
                                    className={`border-2 ${propertyDetailError ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-full sm:w-80 resize-none`} id="property-detail"
                                    rows={5}
                                    name="property-detail"
                                    autoCorrect="on"
                                    autoComplete="new-password"
                                    value={propertyDetail}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                        setPropertyDetailError(false)
                                        setPropertyDetail(e.target.value)
                                    }} />}
                            </div>
                        </div>

                        {/*price */}
                        <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                            {priceErrorMessage && <p className="text-red-500 -mt-1">{priceErrorMessage}</p>}
                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Price</p>
                                </div>

                                <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                    <div className="flex flex-row h-fit">
                                        <input
                                            className=" mr-1 cursor-pointer"
                                            type="radio"
                                            id="fixed-price"
                                            name="price"
                                            disabled={!editForm}
                                            checked={isDeclareFixedPrice}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.checked) {
                                                    setPriceErrorMessage('')
                                                    setIsDeclaredFixedPrice(true)
                                                    setIsRangeOfPrice(false)
                                                    setFixedPrice('')
                                                    setFixedPriceError(false)
                                                    setRangeOfPriceFrom('')
                                                    setRangeOfPriceFromError(false)
                                                    setRangeOfPriceTo('')
                                                    setRangeOfPriceToError(false)
                                                }
                                            }} />
                                        <label htmlFor="fixed-price">Declare a fixed price</label>
                                    </div>

                                    {isDeclareFixedPrice &&
                                        <div className="ml-10">
                                            <input
                                                id="fixed-price-number"
                                                type="number"
                                                name='fixed-price-number'
                                                disabled={!editForm}
                                                className={`border-2 ${fixedPriceError ? 'border-red-400' : 'border-gray-300'} pl-1 pr-1 rounded bg-white w-40`}
                                                placeholder="Number"
                                                value={fixedPrice}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (+e.target.value.trim() > 0) {
                                                        setFixedPriceError(false)
                                                        setPriceErrorMessage('')
                                                        setFixedPrice(+e.target.value.trim())
                                                    } else {
                                                        setFixedPrice('')
                                                    }
                                                }} />
                                        </div>}

                                    <div className="flex flex-row h-fit">
                                        <input
                                            className=" mr-1 cursor-pointer"
                                            type="radio"
                                            id="range-of-price"
                                            disabled={!editForm}
                                            name="price"
                                            checked={isRangeOfPrice}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.checked) {
                                                    setPriceErrorMessage('')
                                                    setIsDeclaredFixedPrice(false)
                                                    setIsRangeOfPrice(true)
                                                    setFixedPrice('')
                                                    setFixedPriceError(false)
                                                    setRangeOfPriceFrom('')
                                                    setRangeOfPriceFromError(false)
                                                    setRangeOfPriceTo('')
                                                    setRangeOfPriceToError(false)
                                                }
                                            }} />
                                        <label htmlFor="range-of-price">Range of price</label>
                                    </div>

                                    {isRangeOfPrice &&
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row ml-10 gap-2">
                                                <label htmlFor="range-of-price-number-1">From</label>
                                                <input
                                                    id="range-of-price-number-1"
                                                    type="number"
                                                    disabled={!editForm}
                                                    name='range-of-price-number-1'
                                                    className={`border-2 ${rangeOfPriceFromError ? 'border-red-400' : 'border-gray-300'} pl-1 pr-1 rounded bg-white w-40`}
                                                    placeholder="Number"
                                                    value={rangeOfPriceFrom}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (+e.target.value.trim() > 0) {
                                                            setPriceErrorMessage('')
                                                            setRangeOfPriceFromError(false)
                                                            setRangeOfPriceFrom(+e.target.value.trim())
                                                        } else {
                                                            setRangeOfPriceFrom('')
                                                        }
                                                    }} />
                                            </div>
                                            <div className="flex flex-row ml-10 gap-7">
                                                <label htmlFor="range-of-price-number-2">To</label>
                                                <input
                                                    id="range-of-price-number-2"
                                                    type="number"
                                                    name='range-of-price-number-2'
                                                    disabled={!editForm}
                                                    className={`border-2 ${rangeOfPriceToError ? 'border-red-400' : 'border-gray-300'} pl-1 pr-1 rounded bg-white w-40`}
                                                    placeholder="Number"
                                                    value={rangeOfPriceTo}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (+e.target.value.trim() > 0) {
                                                            setPriceErrorMessage('')
                                                            setRangeOfPriceToError(false)
                                                            setRangeOfPriceTo(+e.target.value.trim())
                                                        } else {
                                                            setRangeOfPriceTo('')
                                                        }
                                                    }} />
                                            </div>
                                        </div>}
                                </div>
                            </div>
                        </div>

                        {/*water supply*/}
                        <div className="p-2  flex flex-col pb-5 pt-5 ">
                            {(waterSupplyError || waterSupplyTwentyFourHoursError) && <p className="text-red-500">Select an option</p>}

                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Is water supply available</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    {["water-supply-yes", "water-supply-no"].map(type => {
                                        return <div key={type} className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                disabled={!editForm}
                                                id={type}
                                                checked={waterSupplyCheckedFunction(type as "water-supply-yes" | "water-supply-no")}
                                                name="water-supply"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        if (type === "water-supply-yes") {
                                                            setIsWaterSupply(true)
                                                        } else {
                                                            setIsWaterSupply(false)
                                                        }
                                                        setIsWaterSupplyTwentyFourHours(null)
                                                        setWaterSupplyError(false)
                                                        setWaterSupplyTwentyFourHoursError(false)
                                                    }
                                                }} />
                                            <label htmlFor={type}>{type === "water-supply-yes" ? 'Yes' : 'No'}</label>
                                        </div>
                                    })}
                                </div>
                            </div>

                            {isWaterSupply &&
                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ml-3">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">24 hours water supply</p>
                                    </div>
                                    <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                        {['water-supply-twenty-four-hours-yes', 'water-supply-twenty-four-hours-no'].map(type => {
                                            return <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    id={type}
                                                    disabled={!editForm}
                                                    checked={twentyHoursWaterSupplyCheckedFunction(type as 'water-supply-twenty-four-hours-yes' | 'water-supply-twenty-four-hours-no')}
                                                    name="water-supply-twenty-four-hours"
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            if (type === 'water-supply-twenty-four-hours-yes') {
                                                                setIsWaterSupplyTwentyFourHours(true)
                                                            } else {
                                                                setIsWaterSupplyTwentyFourHours(false)
                                                            }
                                                            setWaterSupplyTwentyFourHoursError(false)
                                                        }
                                                    }} />
                                                <label htmlFor={type}>{type === "water-supply-twenty-four-hours-yes" ? 'Yes' : 'No'}</label>
                                            </div>
                                        })}
                                    </div>
                                </div>}
                        </div>

                        {/*electricity connection*/}
                        <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                            {electricityConnectionError && <p className="text-red-500">Select an option</p>}

                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Electricity connection</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    {["electricity-connection-yes", "electricity-connection-no"].map(type => {
                                        return <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                id={type}
                                                disabled={!editForm}
                                                checked={electricityConnectionCheckedFunction(type as "electricity-connection-yes" | "electricity-connection-no")}
                                                name="electricity-connection"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        if (type === "electricity-connection-yes") {
                                                            setElectricityConnection(true)
                                                        } else {
                                                            setElectricityConnection(false)
                                                        }
                                                        setElectricityConnectionError(false)
                                                    }
                                                }} />
                                            <label htmlFor={type}>{type === "electricity-connection-yes" ? 'Yes' : 'No'}</label>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                        {/*sewage system*/}
                        <div className="p-2  flex flex-col pb-5 pt-5">
                            {sewageSystemError && <p className="text-red-500">Select an option</p>}

                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Sewage sysem</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    {["sewage-system-yes", "sewage-system-no"].map(type => {
                                        return <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                disabled={!editForm}
                                                id={type}
                                                checked={sewageSystemCheckedFunction(type as "sewage-system-yes" | "sewage-system-no")}
                                                name="sewage-system"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        if (type === "sewage-system-yes") {
                                                            setSewageSystem(true)
                                                        } else {
                                                            setSewageSystem(false)
                                                        }
                                                        setSewageSystemError(false)
                                                    }
                                                }} />
                                            <label htmlFor={type}>{type === "sewage-system-yes" ? 'Yes' : 'No'}</label>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                        {/*cable tv*/}
                        <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                            {cableTVError && <p className="text-red-500">Select an option</p>}

                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Cable TV</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">

                                    {['cable-tv-yes', 'cable-tv-no'].map(type => {
                                        return <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                id={type}
                                                checked={cableTvCheckedFunction(type as 'cable-tv-yes' | 'cable-tv-no')}
                                                name="cable-tv"
                                                disabled={!editForm}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        if (type === 'cable-tv-yes') {
                                                            setCableTV(true)
                                                        } else {
                                                            setCableTV(false)
                                                        }
                                                        setCableTVError(false)
                                                    }
                                                }} />
                                            <label htmlFor={type}>{type === "cable-tv-yes" ? 'Yes' : 'No'}</label>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                        {/*high speed internet*/}
                        <div className="p-2  flex flex-col pb-5 pt-5 ">
                            {highSpeedInternetError && <p className="text-red-500">Select an option</p>}

                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">High speed internet</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    {['internet-yes', 'internet-no'].map(type => {
                                        return <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                disabled={!editForm}
                                                type="radio"
                                                id={type}
                                                checked={internetCheckedFunction(type as 'internet-yes' | 'internet-no')}
                                                name="internet"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        if (type === 'internet-yes') {
                                                            setHighSpeedInternet(true)
                                                        } else {
                                                            setHighSpeedInternet(false)
                                                        }
                                                        setHighSpeedInternetError(false)
                                                    }
                                                }} />
                                            <label htmlFor={type}>{type === "internet-yes" ? 'Yes' : 'No'}</label>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                        {/*distance */}
                        <div className="flex flex-col gap-1 p-2 pb-5 pt-5 bg-gray-100">
                            {(distanceFromGroceryStoreError || distanceFromRestaurantCafeError || distanceFromExerciseAreaError || distanceFromSchoolError || distanceFromHospitalError) &&
                                <p className="text-red-500">Select district and state</p>}

                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500">Distance from</p>
                            </div>
                            <div className="flex flex-col place-self-center w-11/12 gap-2">

                                {/*grocery store */}
                                <div className="flex flex-row gap-8 w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="grocery-store">
                                        Grocery store (km)
                                    </label>
                                    <input
                                        type="number"
                                        id="grocery-store"
                                        name="grocery-store"
                                        disabled={!editForm}
                                        className={`border-2 ${distanceFromGroceryStoreError ? 'border-red-500' : 'border-gray-500'} border-gray-500 w-12 text-center p-1 rounded`}
                                        autoComplete="new-password"
                                        value={distanceFromGroceryStore}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (+e.target.value.trim() > 0) {
                                                setDistanceFromGroceryStore(+e.target.value.trim())
                                                setDistanceFromGroceryStoreError(false)
                                            } else {
                                                setDistanceFromGroceryStore('')
                                            }
                                        }} />
                                </div>

                                {/*Restaurant/cafe */}
                                <div className="flex flex-row gap-3 w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="restaurant-cafe">
                                        Restaurant/Cafe (km)
                                    </label>
                                    <input
                                        type="number"
                                        disabled={!editForm}
                                        id="restaurant-cafe"
                                        name="restaurant-cafe"
                                        className={`border-2 ${distanceFromRestaurantCafeError ? 'border-red-500' : 'border-gray-500'} w-12 text-center p-1 rounded`}
                                        autoComplete="new-password"
                                        value={distanceFromRestaurantCafe}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (+e.target.value.trim() > 0) {
                                                setDistanceFromRestaurantCafe(+e.target.value.trim())
                                                setDistanceFromRestaurantCafeError(false)
                                            } else {
                                                setDistanceFromRestaurantCafe('')
                                            }
                                        }} />
                                </div>

                                {/*Exercise area */}
                                <div className="flex flex-row gap-9 w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="exrecise-area">
                                        Exercise area (km)
                                    </label>
                                    <input
                                        type="number"
                                        disabled={!editForm}
                                        id="exrecise-area"
                                        name="exrecise-area"
                                        className={`border-2 ${distanceFromExerciseAreaError ? 'border-red-500' : 'border-gray-500'} w-12 text-center p-1 rounded`}
                                        autoComplete="new-password"
                                        value={distanceFromExerciseArea}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (+e.target.value.trim() > 0) {
                                                setDistanceFromExerciseArea(+e.target.value.trim())
                                                setDistanceFromExerciseAreaError(false)
                                            } else {
                                                setDistanceFromExerciseArea('')
                                            }
                                        }} />
                                </div>

                                {/*School */}
                                <div className="flex flex-row gap-20 w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="school">
                                        School (km)
                                    </label>
                                    <input
                                        type="number"
                                        id="school"
                                        name="school"
                                        disabled={!editForm}
                                        className={`border-2 ${distanceFromSchoolError ? 'border-red-500' : 'border-gray-500'} w-12 text-center p-1 rounded`}
                                        autoComplete="new-password"
                                        value={distanceFromSchool}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (+e.target.value.trim() > 0) {
                                                setDistanceFromSchool(+e.target.value.trim())
                                                setDistanceFromSchoolError(false)
                                            } else {
                                                setDistanceFromSchool('')
                                            }
                                        }} />
                                </div>

                                {/*hospital */}
                                <div className="flex flex-row gap-16 w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="hospital">
                                        Hospital (km)
                                    </label>
                                    <input
                                        type="number"
                                        id="hospital"
                                        disabled={!editForm}
                                        name="hospital"
                                        className={`border-2 ${distanceFromHospitalError ? 'border-red-500' : 'border-gray-500'} w-12 text-center ml-1 p-1 rounded`}
                                        autoComplete="new-password"
                                        value={distanceFromHospital}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (+e.target.value.trim() > 0) {
                                                setDistanceFromHospital(+e.target.value.trim())
                                                setDistanceFromHospitalError(false)
                                            } else {
                                                setDistanceFromHospital('')
                                            }
                                        }} />
                                </div>
                            </div>
                        </div>

                        {/*area type*/}
                        <div className="p-2  flex flex-col pb-5 pt-5">
                            {areaTypeError && <p className="text-red-500">Select an option</p>}

                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Area type</p>
                                </div>
                                <div className="flex flex-col gap-1 pt-1 pr-4 sm:pr-0">
                                    {areaTypeOptions.map(type => {
                                        return <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                id={'area-' + type}
                                                checked={areaType === type}
                                                disabled={!editForm}
                                                name="area-type"
                                                value={type}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setAreaType(e.target.value as 'rural' | 'urban' | 'sub-urban')
                                                        setAreaTypeError(false)
                                                    }
                                                }} />
                                            <label htmlFor={'area-' + type}>{capitalizeFirstLetterOfAString(type)}</label>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Number of floors*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <label
                                        className="text-xl font-semibold text-gray-500"
                                        htmlFor="owners">
                                        Number of floors
                                    </label>
                                    <select
                                        className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                        name="floors"
                                        id="floors"
                                        disabled={!editForm}
                                        value={numberOfFloors}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setNumberOfFloors(+e.target.value)
                                        }}>
                                        {generateNumberArray(1, 10).map(number =>
                                            <option
                                                key={number}
                                                value={number}
                                            >
                                                {number}
                                            </option>)}
                                    </select>
                                </div>
                            </div>}

                        {/*total area*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 ">
                            {(totalAreaGajjError || totalAreaMetreSquareError) &&
                                <p className="text-red-500 -mt-1">Provide details</p>}
                            <div className="flex flex-row gap-5 sm:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Total area</p>
                                </div>

                                {/*metre-square */}
                                <div className="flex flex-col w-full gap-3">
                                    <div className="flex flex-row gap-1 ">
                                        <input
                                            id="total-area-metre"
                                            type="number"
                                            name='total-area-metre'
                                            disabled={!editForm}
                                            className={`border-2 ${totalAreaMetreSquareError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`}
                                            placeholder="Size"
                                            value={totalAreaMetreSquare}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (+e.target.value.trim() > 0) {
                                                    setTotalAreaErrorMetreSquareError(false)
                                                    setTotalAreaMetreSquare(+e.target.value.trim())
                                                } else {
                                                    setTotalAreaMetreSquare('')
                                                }
                                            }} />
                                        <label htmlFor="total-area-metre">Metre square</label>
                                    </div>

                                    {/*gajj*/}
                                    <div className="flex flex-row gap-1 ">
                                        <input
                                            id="total-area-gajj"
                                            type="number"
                                            disabled={!editForm}
                                            name='total-area-gajj'
                                            className={`border-2 ${totalAreaGajjError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`}
                                            placeholder="Size"
                                            value={totalAreaGajj}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (+e.target.value.trim() > 0) {
                                                    setTotalAreaGajjError(false)
                                                    setTotalAreaGajj(+e.target.value.trim())
                                                } else {
                                                    setTotalAreaGajj('')
                                                }
                                            }} />
                                        <label htmlFor="total-area-gajj">Gajj</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*covered area*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                            {(coveredAreaGajjError || coveredAreaMetreSquareError) && <p className="text-red-500 -mt-1">Provide details</p>}
                            <div className="flex flex-col sm:flex-row gap-5 sm:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Covered area</p>
                                </div>

                                {/*metre-square */}
                                <div className="flex flex-col  place-items-center sm:place-items-start gap-3">
                                    <div className="flex flex-row gap-1">
                                        <input
                                            id="covered-area-metre"
                                            type="number"
                                            name='covered-area-metre'
                                            className={`border-2 ${coveredAreaMetreSquareError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`}
                                            placeholder="Size"
                                            disabled={!editForm}
                                            value={coveredAreaMetreSquare}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (+e.target.value.trim() > 0) {
                                                    setCoveredAreaErrorMetreSquareError(false)
                                                    setCoveredAreaMetreSquare(+e.target.value.trim())
                                                } else {
                                                    setCoveredAreaMetreSquare('')
                                                }
                                            }} />
                                        <label htmlFor="covered-area-metre">Metre square</label>
                                    </div>

                                    {/*gajj*/}
                                    <div className="flex flex-row gap-1">
                                        <input
                                            id="covered-area-gajj"
                                            type="number"
                                            name='covered-area-gajj'
                                            disabled={!editForm}
                                            className={`border-2 ${coveredAreaGajjError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`}
                                            placeholder="Size"
                                            value={coveredAreaGajj}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (+e.target.value.trim() > 0) {
                                                    setCoveredAreaGajjError(false)
                                                    setCoveredAreaGajj(+e.target.value.trim())
                                                } else {
                                                    setCoveredAreaGajj('')
                                                }
                                            }} />
                                        <label htmlFor="covered-area-gajj">Gajj</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Number of living rooms*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5 ">
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <label
                                        className="text-xl font-semibold text-gray-500"
                                        htmlFor="number-of-rooms">
                                        Number of Living Rooms
                                    </label>
                                    <select
                                        className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-rooms"
                                        id="number-of-rooms"
                                        value={numberOfLivingRooms}
                                        disabled={!editForm}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setNumberOfLivingRooms(+e.target.value)
                                        }}>
                                        {generateNumberArray(1, 10).map(number =>
                                            <option
                                                key={number}
                                                value={number}
                                            >
                                                {number}
                                            </option>)}
                                    </select>
                                </div>
                            </div>}

                        {/* Number of bedrooms*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <label
                                        className="text-xl font-semibold text-gray-500"
                                        htmlFor="number-of-bedrooms">
                                        Number of Bedrooms
                                    </label>
                                    <select
                                        className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                        name="number-of-bedrooms"
                                        disabled={!editForm}
                                        id="number-of-bedrooms"
                                        value={numberOfBedrooms}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setNumberOfBedrooms(+e.target.value)
                                        }}>
                                        {generateNumberArray(1, 10).map(number => <option
                                            key={number}
                                            value={number}
                                        >
                                            {number}
                                        </option>)}
                                    </select>
                                </div>
                            </div>}

                        {/* Number of office rooms*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5 ">
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <label
                                        className="text-xl font-semibold text-gray-500"
                                        htmlFor="number-of-office-rooms">
                                        Number of Office rooms
                                    </label>
                                    <select
                                        className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                        name="number-of-office-rooms"
                                        id="number-of-office-rooms"
                                        disabled={!editForm}
                                        value={numberOfOfficeRooms}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setNumberOfOfficeRooms(+e.target.value)
                                        }}>
                                        {generateNumberArray(0, 9).map(number =>
                                            <option
                                                key={number}
                                                value={number}
                                            >
                                                {number}
                                            </option>)}
                                    </select>
                                </div>
                            </div>}

                        {/* Number of washrooms*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <label
                                        className="text-xl font-semibold text-gray-500"
                                        htmlFor="number-of-washrooms">
                                        Number of Washrooms
                                    </label>
                                    <select
                                        className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                        name="number-of-washrooms"
                                        disabled={!editForm}
                                        id="number-of-washrooms"
                                        value={numberOfWashrooms}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setNumberOfWashrooms(+e.target.value)
                                        }}>
                                        {generateNumberArray(1, 10).map(number =>
                                            <option
                                                key={number}
                                                value={number}
                                            >
                                                {number}
                                            </option>)}
                                    </select>
                                </div>
                            </div>}

                        {/* Number of kitchen*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5">
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <label
                                        className="text-xl font-semibold text-gray-500"
                                        htmlFor="number-of-kitchen">
                                        Number of Kitchens
                                    </label>
                                    <select
                                        className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                        name="number-of-kitchen"
                                        disabled={!editForm}
                                        id="number-of-kitchen"
                                        value={numberOfKitchen}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setNumberOfKitchen(+e.target.value)
                                        }}>
                                        {generateNumberArray(1, 10).map(number =>
                                            <option
                                                key={number}
                                                value={number}
                                            >
                                                {number}
                                            </option>)}
                                    </select>
                                </div>
                            </div>}

                        {/* Number of car parking spaces*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <label
                                        className="text-xl font-semibold text-gray-500"
                                        htmlFor="number-of-car-parkings">
                                        Number of car parkings
                                    </label>
                                    <select
                                        className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                        name="number-of-car-parkings"
                                        disabled={!editForm}
                                        id="number-of-car-parkings"
                                        value={numberOfCarParkingSpaces}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setNumberOfCarParkingSpaces(+e.target.value)
                                        }}>
                                        {generateNumberArray(0, 9).map(number =>
                                            <option
                                                key={number}
                                                value={number}
                                            >
                                                {number}
                                            </option>)}
                                    </select>
                                </div>
                            </div>}

                        {/* Number of balconies*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5 ">
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <label
                                        className="text-xl font-semibold text-gray-500"
                                        htmlFor="number-of-balconies">
                                        Number of balconies
                                    </label>
                                    <select
                                        className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center"
                                        name="number-of-balconies"
                                        id="number-of-balconies"
                                        disabled={!editForm}
                                        value={numberOfBalconies}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setNumberOfBalconies(+e.target.value)
                                        }}>
                                        {generateNumberArray(0, 9).map(number =>
                                            <option
                                                key={number}
                                                value={number}
                                            >
                                                {number}
                                            </option>)}
                                    </select>
                                </div>
                            </div>}

                        {/*store room*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                                {storeRoomError && <p className="text-red-500">Select an option</p>}

                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Store room</p>
                                    </div>
                                    <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                        {['store-room-yes', 'store-room-no'].map(type => {
                                            return <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    disabled={!editForm}
                                                    type="radio"
                                                    id={type}
                                                    checked={storeRoomCheckedFunction(type as 'store-room-yes' | 'store-room-no')}
                                                    name="store-room"
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            if (type === 'store-room-yes') {
                                                                setStoreRoom(true)
                                                            } else {
                                                                setStoreRoom(false)
                                                            }
                                                            setStoreRoomError(false)
                                                        }
                                                    }} />
                                                <label htmlFor={type}>{type === 'store-room-yes' ? 'Yes' : 'No'}</label>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>}

                        {/*servant room*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 ">
                                {servantRoomError && <p className="text-red-500">Select an option</p>}
                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Servant room</p>
                                    </div>
                                    <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                        {['servant-room-yes', 'servant-room-no'].map(type => {
                                            return <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    id={type}
                                                    checked={servantRoomCheckedFunction(type as 'servant-room-yes' | 'servant-room-no')}
                                                    disabled={!editForm}
                                                    name="servant-room"
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            if (type === 'servant-room-yes') {
                                                                setServantRoom(true)
                                                            } else {
                                                                setServantRoom(false)
                                                            }
                                                            setServantRoomError(false)
                                                        }
                                                    }} />
                                                <label htmlFor={type}>{type === 'servant-room-yes' ? 'Yes' : 'No'}</label>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>}

                        {/*Furnishing */}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                                {furnishingError && <p className="text-red-500">Select an option</p>}

                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">House Furnishing</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">

                                        {['fully-furnished', 'semi-furnished', 'unfurnished'].map(type => {
                                            return <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    id={'house-' + type}
                                                    disabled={!editForm}
                                                    name="furnishing"
                                                    checked={type === furnishing}
                                                    onClick={() => {
                                                        setFurnishingDetails('')
                                                        setFurnishingDetailsError(false)
                                                        setFurnishingError(false)
                                                    }} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            setFurnishing(type as 'fully-furnished' | 'semi-furnished' | 'unfurnished')
                                                        }
                                                    }} />
                                                <label htmlFor={'house-' + type}>{capitalizeFirstLetterOfAString(type)}</label>
                                            </div>
                                        })}
                                    </div>
                                </div>

                                {furnishing && (furnishing === 'semi-furnished' || furnishing === 'fully-furnished') && editForm &&
                                    <div className="text-center">
                                        <textarea
                                            className={`border-2 ${furnishingDetailsError ? "border-red-500" : "border-gray-400"}  rounded h-40 w-80 p-1 resize-none`}
                                            id="furnishing-details"
                                            name="furnishing-details"
                                            autoCorrect="on"
                                            disabled={!editForm}
                                            autoComplete="new-password"
                                            placeholder="Add details about furnishing (optional)"
                                            value={furnishingDetails}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                                setFurnishingDetails(e.target.value)
                                                setFurnishingDetailsError(false)
                                            }} />
                                        {furnishingDetailsError && <p className="text-red-500">Details cannot be more than 500 characters</p>}
                                    </div>}

                                {furnishing && (furnishing === 'semi-furnished' || furnishing === 'fully-furnished') && !editForm && <div className="w-full flex justify-center mt-2">
                                    <p className="bg-gray-300 p-1 rounded w-11/12 sm:w-8/12">{furnishingDetails}</p>
                                </div>}

                            </div>}

                        {/*Kitchen furnishing */}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5">
                                {kitchenFurnishingError && <p className="text-red-500">Select an option</p>}

                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Kitchen furnishing</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                        {['modular', 'semi-furnished', 'unfurnished'].map(type => {
                                            return <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    id={'kitchen-' + type}
                                                    name="kitchen-furnishing"
                                                    disabled={!editForm}
                                                    checked={type === kitchenFurnishing}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        setKitchenFurnishingDetails('')
                                                        setKitchenFurnishingDetailsError(false)
                                                        setKitchenFurnishingError(false)
                                                        if (e.target.checked) {
                                                            setKitchenFurnishing(type as 'modular' | 'semi-furnished' | 'unfurnished')
                                                        }
                                                    }} />
                                                <label htmlFor={'kitchen-' + type}>{capitalizeFirstLetterOfAString(type)}</label>
                                            </div>
                                        })}

                                    </div>
                                </div>

                                {kitchenFurnishing && (kitchenFurnishing === 'semi-furnished' || kitchenFurnishing === 'modular') && editForm &&
                                    <div className="text-center">
                                        <textarea
                                            className={`border-2 ${kitchenFurnishingDetailsError ? "border-red-500" : "border-gray-400"}  rounded h-40 w-80 p-1 resize-none`}
                                            id="type-of-kitchen-details"
                                            name="type-of-kitchen-details"
                                            autoCorrect="on"
                                            autoComplete="new-password"
                                            placeholder="Add details about furnishing (optional)"
                                            value={kitchenFurnishingDetails}
                                            onChange={e => {
                                                setKitchenFurnishingDetails(e.target.value)
                                                setKitchenFurnishingDetailsError(false)
                                            }} />
                                        {kitchenFurnishingDetailsError && <p className="text-red-500">Details cannot be more than 500 alpabets</p>}
                                    </div>}

                                {kitchenFurnishing && (kitchenFurnishing === 'semi-furnished' || kitchenFurnishing === 'modular') && !editForm && <div className="w-full flex justify-center mt-2">
                                    <p className="bg-gray-300 p-1 rounded w-11/12 sm:w-8/12">{kitchenFurnishingDetails}</p>
                                </div>}
                            </div>}

                        {/*kitchen appliances */}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                            {kitchenAppliancesError && <p className="text-red-500">Select an option</p>}
                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Kitchen appliances</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    {["kitchen-appliances-yes", "kitchen-appliances-no"].map(type => {
                                        return <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                disabled={!editForm}
                                                id={type}
                                                name="kitchen-appliances"
                                                checked={kitchenAppliancesCheckedFunction(type as "kitchen-appliances-yes" | "kitchen-appliances-no")}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    setKitchenAppliancesDetails('')
                                                    setKitchenAppliancesDetailsError(false)
                                                    setKitchenAppliancesError(false)
                                                    if (e.target.checked) {
                                                        if (type === "kitchen-appliances-yes") {
                                                            setKitchenAppliances(true)
                                                        } else {
                                                            setKitchenAppliances(false)
                                                        }
                                                    }
                                                }} />
                                            <label htmlFor={type}>{type === "kitchen-appliances-yes" ? 'Yes' : 'No'}</label>
                                        </div>
                                    })}
                                </div>
                            </div>

                            {kitchenAppliances && editForm &&
                                <div className="text-center">
                                    <textarea
                                        className={`border-2 ${kitchenAppliancesDetailsError ? 'border-red-500' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`}
                                        id="kitchen-appliances-details"
                                        name="kitchen-appliances-details"
                                        autoCorrect="on"
                                        autoComplete="new-password"
                                        placeholder="Add details about kitchen appliances (optional)"
                                        value={kitchenAppliancesDetails}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                            setKitchenAppliancesDetails(e.target.value)
                                            setKitchenAppliancesDetailsError(false)
                                        }} />
                                    {kitchenAppliancesDetailsError && <p className="text-red-500">Details cannot be more than 500 alphabets</p>}
                                </div>}
                            {kitchenAppliances && !editForm && <div className="w-full flex justify-center mt-2">
                                <p className="bg-gray-300 p-1 rounded w-11/12 sm:w-8/12">{kitchenAppliancesDetails}</p>
                            </div>}
                        </div>}

                        {/*washroom fitting*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 ">
                                {washroomFittingError && <p className="text-red-500">Select an option</p>}

                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Washrooom fitting</p>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                        {['standard', 'premium', 'luxurious'].map(type => {
                                            return <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    id={'washroom-' + type}
                                                    disabled={!editForm}
                                                    checked={type === washroomFitting}
                                                    name="washroom-fitting"
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            setWashRoomFittingError(false)
                                                            setWashRoomFitting(type as 'standard' | 'premium' | 'luxurious')
                                                        }
                                                    }} />
                                                <label htmlFor={'washroom-' + type}>{capitalizeFirstLetterOfAString(type)}</label>
                                            </div>
                                        })}
                                    </div>

                                </div>
                            </div>}

                        {/*electrical fitting*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                                {electricalFittingError && <p className="text-red-500">Select an option</p>}

                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Electrical fitting</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                        {['standard', 'premium', 'luxurious'].map(type => {
                                            return <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    disabled={!editForm}
                                                    id={'electrical-' + type}
                                                    name="electrical-fitting"
                                                    checked={type === electricalFitting}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            setElectricalFittingError(false)
                                                            setElectricalFitting(type as 'standard' | 'premium' | 'luxurious')
                                                        }
                                                    }} />
                                                <label htmlFor={'electrical-' + type}>{capitalizeFirstLetterOfAString(type)}</label>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>}

                        {/*flooring type*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 ">
                                {flooringTypeError && <p className="text-red-500">Select atleast one option</p>}

                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Flooring type</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                        {flooringTypeOptions.map(type =>
                                            <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="checkbox"
                                                    disabled={!editForm}
                                                    checked={flooringTypeArray.includes(type as 'cemented' | 'marble' | 'luxurious marble' | 'standard tiles' | 'premium tiles' | 'luxurious tiles')}
                                                    id={'flooring-' + type}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            setFlooringTypeError(false)
                                                            if (!flooringTypeArray) {
                                                                setFlooringTypeArray([type as FlooringType])
                                                            } else {
                                                                setFlooringTypeArray(flooringTypeArray => [
                                                                    ...flooringTypeArray,
                                                                    type as FlooringType
                                                                ])
                                                            }
                                                        } else {
                                                            const updatedFlooringTypeArray = flooringTypeArray.filter(item => item !== type as FlooringType)
                                                            setFlooringTypeArray(updatedFlooringTypeArray)
                                                        }
                                                    }} />
                                                <label htmlFor={'flooring-' + type}>{type}</label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}

                        {/*roof type*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                                {roofTypeError && <p className="text-red-500">Select atleast one option</p>}

                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Roof type</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                        {roofTypeOptions.map(type =>
                                            <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    disabled={!editForm}
                                                    type="checkbox"
                                                    id={'roof-' + type}
                                                    checked={roofTypeArray.includes(type as 'standard' | 'pop work' | 'down ceiling')}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            setRoofTypeError(false)
                                                            if (!roofTypeArray) {
                                                                setRoofTypeArray([type as RoofType])
                                                            } else {
                                                                setRoofTypeArray(roofTypeArray => [
                                                                    ...roofTypeArray,
                                                                    type as RoofType
                                                                ])
                                                            }
                                                        } else {
                                                            const updatedRoofTypeArray = roofTypeArray.filter(item => item !== type as RoofType)
                                                            setRoofTypeArray(updatedRoofTypeArray)
                                                        }
                                                    }} />
                                                <label htmlFor={'roof-' + type}>{type}</label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}

                        {/*wall type*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5">
                                {wallTypeError && <p className="text-red-500">Select atleast one option</p>}

                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Wall type</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                        {wallTypeOptions.map(type =>
                                            <div
                                                key={type}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="checkbox"
                                                    id={'wall-' + type}
                                                    disabled={!editForm}
                                                    checked={wallTypeArray.includes(type as 'plaster' | 'paint' | 'premium paint' | 'wall paper' | 'pvc panelling' | 'art work')}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            setWallTypeError(false)
                                                            if (!wallTypeArray) {
                                                                setWallTypeArray([type as WallType])
                                                            } else {
                                                                setWallTypeArray(wallTypeArray => [
                                                                    ...wallTypeArray,
                                                                    type as WallType
                                                                ])
                                                            }
                                                        } else {
                                                            const updatedWallTypeArray = wallTypeArray.filter(item => item !== type as WallType)
                                                            setWallTypeArray(updatedWallTypeArray)
                                                        }
                                                    }} />
                                                <label htmlFor={'wall-' + type}>{type}</label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}

                        {/*Window type*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                            {windowTypeError && <p className="text-red-500">Select atleast one option</p>}

                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Window type</p>
                                </div>
                                <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                    {windowTypeOptions.map(type =>
                                        <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="checkbox"
                                                disabled={!editForm}
                                                id={'window-' + type}
                                                checked={windowTypeArray.includes(type as 'standard' | 'wood' | 'premium material')}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        setWindowTypeError(false)
                                                        if (!windowTypeArray) {
                                                            setWindowTypeArray([type as WindowType])
                                                        } else {
                                                            setWindowTypeArray(windowTypeArray => [
                                                                ...windowTypeArray,
                                                                type as WindowType
                                                            ])
                                                        }
                                                    } else {
                                                        const updatedWindowTypeArray = windowTypeArray.filter(item => item !== type)
                                                        setWindowTypeArray(updatedWindowTypeArray)
                                                    }
                                                }} />
                                            <label htmlFor={'window-' + type}>{type}</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>}

                        {/*safety system*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-row gap-8 sm:gap-10 lg:gap-16 pb-5 pt-5 ">
                                <p className="text-xl font-semibold text-gray-500 mb-2">Safety system</p>
                                <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                    {safetySystemOptions.map(type =>
                                        <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="checkbox"
                                                disabled={!editForm}
                                                id={'safety-' + type}
                                                checked={safetySystemArray.includes(type as 'cctv' | 'glass break siren' | 'entry sensor' | 'motion sensor' | 'panic button' | 'keypad' | 'keyfob' | 'smoke detector' | 'co detector' | 'water sprinkler' | 'doorbell camera')}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                        setSafetySystemArray(array => [
                                                            ...array,
                                                            type as SafetySystemType
                                                        ])
                                                    } else {
                                                        const updatedSafetySystemArray = safetySystemArray.filter(item => item !== type)
                                                        setSafetySystemArray(updatedSafetySystemArray)
                                                    }
                                                }} />
                                            <label htmlFor={'safety-' + type}>{type}</label>
                                        </div>
                                    )}
                                </div>
                            </div>}

                        {/*garden */}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                            {gardenError && <p className="text-red-500">Select an option</p>}
                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Garden</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    {['garden-yes', 'garden-no'].map(type => {
                                        return <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                disabled={!editForm}
                                                type="radio"
                                                id={type}
                                                name="garden"
                                                checked={gardenCheckedFunction(type as 'garden-yes' | 'garden-no')}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    setGardenDetails('')
                                                    setGardenDetailsError(false)
                                                    setGardenError(false)
                                                    if (e.target.checked) {
                                                        if (type === 'garden-yes') {
                                                            setGarden(true)
                                                        } else {
                                                            setGarden(false)
                                                        }
                                                    }
                                                }} />
                                            <label htmlFor={type}>{type === 'garden-yes' ? 'Yes' : 'No'}</label>
                                        </div>
                                    })}
                                </div>
                            </div>

                            {garden && editForm &&
                                <div className="text-center">
                                    <textarea
                                        className={`border-2 ${gardenDetailsError ? 'border-red-500' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`}
                                        id="garden-details"
                                        name="garden-details"
                                        autoCorrect="on"
                                        autoComplete="new-password"
                                        placeholder="Add details about garden (optional)"
                                        value={gardenDetails}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                            setGardenDetails(e.target.value)
                                            setGardenDetailsError(false)
                                        }} />
                                    {gardenDetailsError && <p className="text-red-500">Details cannot be more than 500 alphabets</p>}
                                </div>}
                            {garden && !editForm && <div className="flex justify-center">
                                <p className="bg-gray-300 p-1 rounded w-11/12 sm:w-8/12">{gardenDetails}</p>
                            </div>}
                        </div>}

                        {/*age of construction*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="flex flex-col p-2 pb-5 pt-5 ">
                                {ageOfConstructionError && <p className="text-red-500 -mt-1">Provide details</p>}
                                <div className="flex flex-row gap-5 sm:gap-16">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Age of construction</p>
                                    </div>

                                    <div className="flex flex-row gap-1">
                                        <input
                                            id="total-area-metre"
                                            type="number"
                                            disabled={!editForm}
                                            name='total-area-metre'
                                            className={`border-2 ${ageOfConstructionError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-16 text-center`}
                                            placeholder="Size"
                                            value={ageOfConstruction}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (+e.target.value.trim() > 0 && +e.target.value.trim() <= 100) {
                                                    setAgeOfConstructionError(false)
                                                    setAgeOfConstruction(+e.target.value.trim())
                                                } else {
                                                    setAgeOfConstruction('')
                                                }
                                            }} />
                                        <p>years</p>
                                    </div>

                                </div>
                            </div>}

                        {/*Condition of property*/}
                        {residentialPropertyType && residentialPropertyType.toLowerCase() !== 'plot' &&
                            <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                                {conditionOfPropertyError && <p className="text-red-500">Select an option</p>}

                                <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Condition of property</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                                        {conditionOfPropertyOptions.map(option => {
                                            return <div
                                                key={option}
                                                className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    disabled={!editForm}
                                                    id={'condition-' + option}
                                                    name="condition-of-property"
                                                    checked={conditionOfProperty === option}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        if (e.target.checked) {
                                                            setConditionOfPropertyError(false)
                                                            setConditionOfProperty(option as ConditionOfPropertyType)
                                                        }
                                                    }} />
                                                <label htmlFor={'condition-' + option}>{option}</label>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>}

                        {/* Number of owners*/}
                        <div className="flex flex-col p-2 pb-5 pt-5">
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
                                    disabled={!editForm}
                                    value={numberOfOwners}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setNumberOfOwners(+e.target.value)
                                    }}>
                                    {generateNumberArray(1, 10).map(number =>
                                        <option
                                            key={number}
                                            value={number}
                                        >
                                            {number}
                                        </option>)}
                                </select>
                            </div>
                        </div>

                        {/*laws */}
                        <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                            {legalRestrictionError && <p className="text-red-500">Select an option</p>}
                            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Is the land under any restrictions under any laws</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    {['legal-restrictions-yes', 'legal-restrictions-no'].map(type => {
                                        return <div
                                            key={type}
                                            className="flex flex-row h-fit">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                disabled={!editForm}
                                                id={type}
                                                checked={legalRestrictionCheckedFunction(type as 'legal-restrictions-yes' | 'legal-restrictions-no')}
                                                name="restrictions"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    setLegalRestrictionDetails('')
                                                    setLegalRestrictionDetailsError(false)
                                                    setLegalRestrictionError(false)
                                                    if (e.target.checked) {
                                                        if (type === 'legal-restrictions-yes') {
                                                            setIsLegalRestrictions(true)
                                                        } else {
                                                            setIsLegalRestrictions(false)
                                                        }
                                                    }
                                                }} />
                                            <label htmlFor={type}>{type === 'legal-restrictions-yes' ? 'Yes' : 'No'}</label>
                                        </div>
                                    })}
                                </div>
                            </div>

                            {isLegalRestrictions && editForm &&
                                <div className="text-center">
                                    <textarea
                                        className={`border-2 ${legalRestrictionDetailsError ? 'border-red-400' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`}
                                        id="restrictions"
                                        name="restrictions"
                                        autoCorrect="on"
                                        autoComplete="new-password"
                                        placeholder="Add details about restrictions"
                                        value={legalRestrictionDetails}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                            setLegalRestrictionDetailsError(false)
                                            setLegalRestrictionDetails(e.target.value)
                                        }} />
                                    {legalRestrictionDetailsError && <p className="text-red-500">Provide details</p>}
                                </div>}
                            {isLegalRestrictions && !editForm && <div className="w-full flex justify-center mt-2">
                                <p className="bg-gray-300 p-1 rounded w-11/12 sm:w-8/12">{legalRestrictionDetails}</p>
                            </div>}
                        </div>

                        {/*Property taxes*/}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 lg:gap-16  p-2 pb-5 pt-3">
                            <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Property taxes per year</p>
                            <div className="flex flex-row place-content-center gap-1">
                                <p>Rs.</p>
                                <input
                                    id="proeprty-taxes"
                                    type="number"
                                    name='proeprty-taxes'
                                    disabled={!editForm}
                                    className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-28 `}
                                    value={propertyTaxes}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        if (+e.target.value.trim() > 0) {
                                            setPropertyTaxes(+e.target.value.trim())
                                        } else {
                                            setPropertyTaxes('')
                                        }
                                    }} />
                            </div>
                        </div>

                        {/*home owners association fees*/}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 lg:gap-16 p-2 pb-5 pt-3 bg-gray-100">
                            <p className="text-xl font-semibold text-gray-500 " >Home owners association fees per year</p>
                            <div className="flex flex-row place-content-center gap-1">
                                <p>Rs.</p>
                                <input
                                    id="home-owners-fees"
                                    type="number"
                                    disabled={!editForm}
                                    name='home-owners-fees'
                                    className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-28 `}
                                    value={homeOwnersAssociationFees}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        if (+e.target.value.trim() > 0) {
                                            setHomeOwnersAssociationFees(+e.target.value.trim())
                                        } else {
                                            setHomeOwnersAssociationFees('')
                                        }
                                    }} />
                            </div>
                        </div>

                        {/*location */}
                        <div className="flex flex-col p-2 pb-5 pt-5 ">

                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500">Property location</p>
                            </div>

                            <div className="flex flex-col place-self-center w-11/12 gap-2">

                                {/*village */}
                                <div className="flex flex-col w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="village">
                                        Village
                                    </label>
                                    <input
                                        type="text"
                                        id="village"
                                        disabled={!editForm}
                                        name="village"
                                        className='border-2 border-gray-500  p-1 rounded'
                                        autoComplete="new-password"
                                        value={village}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setVillage(e.target.value)
                                        }} />
                                </div>

                                {/*city */}
                                <div className="flex flex-col w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="city">
                                        City/Town
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        disabled={!editForm}
                                        name="city"
                                        className='border-2 border-gray-500 p-1 rounded'
                                        autoComplete="new-password"
                                        value={city}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setCity(e.target.value)
                                        }} />
                                </div>

                                {/*state */}
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
                                        disabled={!editForm}
                                        value={state}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
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
                                                value={state}
                                            >
                                                {capitalizeFirstLetterOfAString(state)}
                                            </option>
                                        })}
                                    </select>
                                    {stateError && <p className="text-red-500">Select a state</p>}
                                </div>

                                {/*district */}
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
                                        disabled={editForm === false || !state}
                                        value={district}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
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
                                                    value={district}
                                                >
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

                                {/*tehsil */}
                                <div className="flex flex-col w-full">
                                    <label
                                        className="text-gray-500 font-semibold"
                                        htmlFor="state">Tehsil</label>
                                    <select
                                        className='border-2 border-gray-500 p-1 rounded'
                                        name="state"
                                        id="state"
                                        disabled={editForm === false || !state || !district}
                                        value={tehsil}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            setTehsil(e.target.value)
                                        }}>
                                        <option
                                            className="font-semibold"
                                            value=""
                                            disabled >
                                            Select a tehsil
                                        </option>
                                        {state === 'chandigarh' && district === 'chandigarh' &&
                                            <option
                                                value='chandigarh'>
                                                Chandigarh
                                            </option>}
                                        {state === 'punjab' && <PunjabTehsilsDropdown
                                            district={district} />}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* contract*/}
                        <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                            <div className="flex flex-row gap-5">
                                <label
                                    className="text-gray-500 text-xl font-semibold"
                                    htmlFor="contract-image">
                                    Upload images of contract between seller and dealer (optional)
                                </label>
                                <input
                                    type="file"
                                    id="contract-image"
                                    disabled={!editForm}
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
                                        {editForm && <div
                                            className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer'
                                            onClick={() => {
                                                const updatedState = fetchedContractImagesUrl.filter(item => item !== url)
                                                setFetchedContractImagesUrl(updatedState)
                                            }}>
                                            X
                                        </div>}
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
                                            {editForm && <div
                                                className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer'
                                                onClick={() => {
                                                    const updatedState = contractImages.filter(item => item.file !== image.file)
                                                    setContractImages(updatedState)
                                                }}>
                                                X
                                            </div>}
                                        </div>
                                    })}
                            </div>
                        </div>

                        {/*images */}
                        <div className="flex flex-col p-2 pb-5 pt-5 ">
                            {propertyImageFileError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
                            <div className="flex flex-row gap-5">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label
                                        className="text-gray-500 text-xl font-semibold"
                                        htmlFor="property-image">
                                        Upload property images
                                    </label>
                                </div>
                                <input
                                    type="file"
                                    className='text-transparent'
                                    disabled={!editForm}
                                    placeholder="image"
                                    accept="image/png, image/jpeg"
                                    name='image'
                                    onChange={propertyImageHandler} />
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
                                            {editForm && <div
                                                className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer'
                                                onClick={() => {
                                                    const updatedState = fetchedPropertyImagesUrl.filter(item => item !== url)
                                                    setFetchedPropertyImagesUrl(updatedState)
                                                }}>
                                                X
                                            </div>}
                                        </div>
                                    })}
                                {propertyImages.length !== 0 &&
                                    propertyImages.map(image => {
                                        return <div
                                            key={Math.random()}
                                            className='relative w-fit bg-blue-300'>
                                            <img
                                                className='relative w-auto h-60'
                                                src={image.file}
                                                alt="" />
                                            {editForm && <div
                                                className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer'
                                                onClick={() => {
                                                    const updatedState = propertyImages.filter(item => item.file !== image.file)
                                                    setResidentialPropertyImages(updatedState)
                                                }}>
                                                X
                                            </div>}
                                        </div>
                                    })}
                            </div>
                        </div>

                        {editForm && <div className="flex justify-center mt-4 p-2">
                            <button
                                type='submit'
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">
                                Save
                            </button>
                        </div>}

                    </form>
                </div >}

            {!error && !spinner && propertyData &&
                <ReviewReconsideredResidentialPropertyDetails
                    propertyId={fetchedPropertyData?._id as string}
                    propertyData={propertyData}
                    contractImages={contractImages}
                    propertyImages={propertyImages}
                    fetchedPropertyImagesUrl={fetchedPropertyImagesUrl}
                    fetchedContractImagesUrl={fetchedContractImagesUrl}
                    propertyDataReset={() => setPropertyData(null)} />}

            {!error && !spinner && !propertyData && (showDealerDetails || showReevaluationDetails) && fetchedPropertyData && fetchedPropertyData.sentBackTofieldAgentForReevaluation && fetchedPropertyData.sentBackTofieldAgentForReevaluation.details &&
                <DetailsModal
                    showDealerDetails={showDealerDetails}
                    showReevaluationDetails={showReevaluationDetails}
                    reevaluationDetails={fetchedPropertyData.sentBackTofieldAgentForReevaluation.details}
                    dealerInfo={dealerInfo as {
                        propertyDealerName: string,
                        firmName: string,
                        email: string,
                        contactNumber: number
                    }}
                    detailsModalRemover={() => {
                        setShowDealerDetails(false)
                        setShowReevaluationDetails(false)
                    }}
                />}
        </Fragment >
    )
}
export default ReconsiderResidentialPropertyDetails