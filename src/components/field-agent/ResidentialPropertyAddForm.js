
import { Fragment, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AlertModal from '../AlertModal'
import { punjabDistricts } from '../../utils/tehsilsAndDistricts/districts'
import PunjabTehsilsDropdown from "./tehsilsDropdown/Punjab"
import ReviewResidentialPropertyAfterSubmission from "./ReviewResidentialPropertyAfterSubmission"
import Spinner from "../Spinner"

//This component is a form used by a field agent to add a residential property
function ResidentialPropertyAddForm() {
  const navigate = useNavigate()
  const authToken = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        if (!authToken) {
          navigate('/field-agent/signIn', { replace: true })
        }
      }, [authToken, navigate])

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const propertyDealerId = queryParams.get('id') //We get property dealer ID from the query params 
  const propertyDealerLogoUrl = queryParams.get('logoUrl') //We get property dealer logo url from the query params 
  const propertyDealerFirmName = queryParams.get('firmName') //We get property dealer firm name from the query params  
  const residentialPropertyType = queryParams.get('propertyType') //We get residential property type from the query params

  const [spinner, setSpinner] = useState(true)

  useEffect(() => {
    //if propertyDealerId or propertyDealerLogoUrl or propertyDealerFirmName or residentialPropertyType is not available, the user is routed to the field-agent home page
    if (!propertyDealerId || !propertyDealerLogoUrl || !propertyDealerFirmName || (residentialPropertyType.toLowerCase() !== 'plot' && residentialPropertyType.toLowerCase() !== 'flat' && residentialPropertyType.toLowerCase() !== 'house')) {
      navigate('/field-agent', { replace: true })
    } else {
      setSpinner(false)
    }
  }, [propertyDealerId, propertyDealerLogoUrl, propertyDealerFirmName, residentialPropertyType, navigate])

  const [alert, setAlert] = useState({
    isAlertModal: false,
    alertType: '',
    alertMessage: '',
    routeTo: null
  })

  const [propertyTitle, setPropertyTitle] = useState('') //title of the proeprty
  const [propertyTitleErrorMessage, setPropertyTitleErrorMessage] = useState('') //Error message to be shown when no title is provided

  const [propertyDetail, setPropertyDetail] = useState('') //details of property
  const [propertyDetailError, setPropertyDetailError] = useState(false) //It is true if property details are not property

  const [priceErrorMessage, setPriceErrorMessage] = useState('') //Meesage to be shown when no price is provided
  const [isDeclareFixedPrice, setIsDeclaredFixedPrice] = useState(false) //Is true if user wants to give a fixed price
  const [isRangeOfPrice, setIsRangeOfPrice] = useState(false) //Is true if user wants to give a range of price
  const [fixedPrice, setFixedPrice] = useState('') //fixed price provided by the user
  const [fixedPriceError, setFixedPriceError] = useState(false) //It is true if fixed price is not provided by the user
  const [rangeOfPriceFrom, setRangeOfPriceFrom] = useState('') //It is a number which stores the lower value of the range
  const [rangeOfPriceFromError, setRangeOfPriceFromError] = useState(false) //It is true if rangeOfPriceFrom is not provided by the user
  const [rangeOfPriceTo, setRangeOfPriceTo] = useState('') //It is a number which stores the upper value of the range
  const [rangeOfPriceToError, setRangeOfPriceToError] = useState(false) //It is true if rangeOfPriceTo is not provided by the user

  const [isWaterSupply, setIsWaterSupply] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [isWaterSupplyTwentyFourHours, setIsWaterSupplyTwentyFourHours] = useState(null) ////It is true if yes option is selected. It is false if the option no is selected. It is null if the user selets neither of the option
  const [waterSupplyError, setWaterSupplyError] = useState(false) //If isWaterSupply is null, this is set to true
  const [waterSupplyTwentyFourHoursError, setWaterSupplyTwentyFourHoursError] = useState(false)//If  isWaterSupplyTwentyFourHours is null, this is set to true

  const [electricityConnection, setElectricityConnection] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [electricityConnectionError, setElectricityConnectionError] = useState(false) //If electricityConnection is null, this is set to true

  const [sewageSystem, setSewageSystem] = useState(null)//It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [sewageSystemError, setSewageSystemError] = useState(false) //If sewageSystem is null, this is set to true

  const [cableTV, setCableTV] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [cableTVError, setCableTVError] = useState(false) //If cableTV is null, this is set to true

  const [highSpeedInternet, setHighSpeedInternet] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [highSpeedInternetError, setHighSpeedInternetError] = useState(false) //If highSpeedInternet is null, this is set to true

  //The states below stores distances from a certain point, and the errors are set to true if a distance is not provided by the user
  const [distanceFromGroceryStore, setDistanceFromGroceryStore] = useState('')
  const [distanceFromGroceryStoreError, setDistanceFromGroceryStoreError] = useState(false)
  const [distanceFromRestaurantCafe, setDistanceFromRestaurantCafe] = useState('')
  const [distanceFromRestaurantCafeError, setDistanceFromRestaurantCafeError] = useState(false)
  const [distanceFromExerciseArea, setDistanceFromExerciseArea] = useState('')
  const [distanceFromExerciseAreaError, setDistanceFromExerciseAreaError] = useState(false)
  const [distanceFromSchool, setDistanceFromSchool] = useState('')
  const [distanceFromSchoolError, setDistanceFromSchoolError] = useState(false)
  const [distanceFromHospital, setDistanceFromHospital] = useState('')
  const [distanceFromHospitalError, setDistanceFromHospitalError] = useState(false)

  const [areaType, setAreaType] = useState(null) //It stores the type of area selected by user
  const [areaTypeError, setAreaTypeError] = useState(false) //An error is shown if the user areaType state in null

  const [numberOfFloors, setNumberOfFloors] = useState(1) //Stores number of floors in a property

  const [typeOfSale, setTypeOfSale] = useState(null) //It stores the type of sale selected by user
  const [typeOfSaleError, setTypeOfSaleError] = useState(false) //An error is shown if the user typeOfSale state in null

  const [totalAreaMetreSquare, setTotalAreaMetreSquare] = useState('') //Total area of the property in metre square
  const [totalAreaGajj, setTotalAreaGajj] = useState('') //Total area of the property in gajj
  const [totalAreaMetreSquareError, setTotalAreaErrorMetreSquareError] = useState(false) //It is false if totalAreaMetreSquare state is empty, and vice-versa
  const [totalAreaGajjError, setTotalAreaGajjError] = useState(false) //It is false if totalAreaGajj state is empty, and vice-versa

  const [coveredAreaMetreSquare, setCoveredAreaMetreSquare] = useState('') //covered area of the property in metre square
  const [coveredAreaGajj, setCoveredAreaGajj] = useState('') //covered area of the property in gajj
  const [coveredAreaMetreSquareError, setCoveredAreaErrorMetreSquareError] = useState(false) //It is false if coveredAreaMetreSquare state is empty, and vice-versa
  const [coveredAreaGajjError, setCoveredAreaGajjError] = useState(false) //It is false if coveredAreaGajj state is empty, and vice-versa

  const [numberOfLivingRooms, setNumberOfLivingRooms] = useState(1)
  const [numberOfBedrooms, setNumberOfBedrooms] = useState(1)
  const [numberOfOfficeRooms, setNumberOfOfficeRooms] = useState(0)
  const [numberOfWashrooms, setNumberOfWashrooms] = useState(1)
  const [numberOfKitchen, setNumberOfKitchen] = useState(1)
  const [numberOfCarParkingSpaces, setNumberOfCarParkingSpaces] = useState(0)
  const [numberOfBalconies, setNumberOfBalconies] = useState(0)

  const [storeRoom, setStoreRoom] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [storeRoomError, setStoreRoomError] = useState(false) //If storeRoom is null, this is set to true

  const [servantRoom, setServantRoom] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [servantRoomError, setServantRoomError] = useState(false) //If servantRoom is null, this is set to true
  const [servantWashroom, setServantWashroom] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [servantWashroomError, setServantWashroomError] = useState(false) //If servantWashroom is null, this is set to true

  const [furnishing, setFurnishing] = useState(null)//It is null when no radio button is selected, and stores a value when a radio button is clicked
  const [furnishingError, setFurnishingError] = useState(false) //If furnishing is null, this is set to true
  const [furnishingDetails, setFurnishingDetails] = useState('') //Details of furnishing
  const [furnishingDetailsError, setFurnishingDetailsError] = useState(false) //It is true if furnishingDetails state is empty

  const [kitchenFurnishing, setKitchenFurnishing] = useState(null) //It is null when no radio button is selected, and stores a value when a radio button is clicked
  const [kitchenFurnishingError, setKitchenFurnishingError] = useState(false) //If kitchenFurnishing is null, this is set to true
  const [kitchenFurnishingDetails, setKitchenFurnishingDetails] = useState('') //Details of kitchen furnishing
  const [kitchenFurnishingDetailsError, setKitchenFurnishingDetailsError] = useState(false) //It is true if kitchenFurnishingDetails state is empty

  const [kitchenAppliances, setKitchenAppliances] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [kitchenAppliancesDetails, setKitchenAppliancesDetails] = useState('') //Details of kitchen appliances
  const [kitchenAppliancesError, setKitchenAppliancesError] = useState(false)  //If kitchenAppliances is null, this is set to true
  const [kitchenAppliancesDetailsError, setKitchenAppliancesDetailsError] = useState(false) //It is true if kitchenAppliancesDetails state is empty

  const [washroomFitting, setWashRoomFitting] = useState(null) //It is null when no radio button is selected, and stores a value when a radio button is clicked
  const [washroomFittingError, setWashRoomFittingError] = useState(false) //If washroomFitting is null, this is set to true

  const [electricalFitting, setElectricalFitting] = useState(null) //It is null when no radio button is selected, and stores a value when a radio button is clicked
  const [electricalFittingError, setElectricalFittingError] = useState(false) //If electricalFitting is null, this is set to true

  const [flooringTypeArray, setFlooringTypeArray] = useState(null) //It is null when no checkbox is selected. If checkboxes are selected, The array stores the values of all the checkboxes selected
  const [flooringTypeError, setFlooringTypeError] = useState(false) //If flooringTypeArray is null, this is set to true
  const flooringTypeOptions = ['Cemented', 'Marble', 'Luxurious Marble', 'Standard tiles', 'Premium tiles', 'Luxurious tiles']

  const [roofTypeArray, setRoofTypeArray] = useState(null) //It is null when no checkbox is selected. If checkboxes are selected, The array stores the values of all the checkboxes selected
  const [roofTypeError, setRoofTypeError] = useState(false) //If roofTypeArray is null, this is set to true
  const roofTypeOptions = ['Standard', 'POP work', 'Down ceiling']

  const [wallTypeArray, setWallTypeArray] = useState(null)
  const [wallTypeError, setWallTypeError] = useState(false)
  const wallTypeOptions = ['Plaster', 'Paint', 'Premium paint', 'Wall paper', 'PVC panelling', 'Art work']

  const [windowTypeArray, setWindowTypeArray] = useState(null) //It is null when no checkbox is selected. If checkboxes are selected, The array stores the values of all the checkboxes selected
  const [windowTypeError, setWindowTypeError] = useState(false) //If windowTypeArray is null, this is set to true
  const windowTypeOptions = ['Standard', 'Wood', 'Premium material']

  const [safetySystemArray, setSafetySystemArray] = useState([]) //If checkboxes are selected, The array stores the values of all the checkboxes selected
  const safetySystemOptions = ['CCTV', 'Glass break siren', 'Entry sensor', 'Motion sensor', 'Panic button', 'Keypad', 'Keyfob', 'Smoke detector', 'CO detector', 'Water sprinkler', 'Doorbell camera']

  const [garden, setGarden] = useState(null)  //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the option
  const [gardenDetails, setGardenDetails] = useState('') //Details of garden
  const [gardenError, setGardenError] = useState(false) //If garden state is null, this is set to true
  const [gardenDetailsError, setGardenDetailsError] = useState(false) //It is true if gardenDetails state is empty

  const [ageOfConstruction, setAgeOfConstruction] = useState('') //It consist of a number that represents age of construction
  const [ageOfConstructionError, setAgeOfConstructionError] = useState(false) //If ageOfConstruction state is empty, this state is set to true

  const [conditionOfProperty, setConditionOfProperty] = useState(null) //It is null when no radio button is selected, and stores a value when a radio button is clicked
  const [conditionOfPropertyError, setConditionOfPropertyError] = useState(false) //if conditionOfProperty state is null, this state is set to true
  const conditionOfPropertyOptions = ['Exceptionally new', 'Near to new', 'Some signs of agying', 'Need some renovations', 'Needs complete renovation']

  const [numberOfOwners, setNumberOfOwners] = useState(1)

  const [isLegalRestrictions, setIsLegalRestrictions] = useState(null) //It is true if yes option is selected. It is false if the option no is selected. It is null if the user selects neither of the options
  const [legalRestrictionError, setLegalRestrictionError] = useState(false) //If isLegalRestrictions state is null, this state is set to true
  const [legalRestrictionDetails, setLegalRestrictionDetails] = useState('') //stores details about legal restrictions
  const [legalRestrictionDetailsError, setLegalRestrictionDetailsError] = useState(false) //if  legalRestrictionDetails state is empty, this state is set to true

  const [propertyTaxes, setPropertyTaxes] = useState('') //This states stores a number representing property taxes

  const [homeOwnersAssociationFees, setHomeOwnersAssociationFees] = useState('') //This states stores a number representing home owners association fees

  //The states below are for location of the property
  const [state, setState] = useState('')
  const [stateError, setStateError] = useState(false)
  const [district, setDistrict] = useState('')
  const [districtError, setDistrictError] = useState(false)
  const [city, setCity] = useState('')
  const [tehsil, setTehsil] = useState('')
  const [village, setVillage] = useState('')

  //The states below are for the uploading property images
  const [residentialLandImageFileError, setResidentialLandImageFileError] = useState(false)
  const [residentialLandImages, setResidentialLandImages] = useState([])

  //The states below are for uploading contract images
  const [contractImages, setContractImages] = useState([])

  const states = ['Chandigarh', 'Punjab']

  const [propertyData, setPropertyData] = useState()

  //The function triggers when the user adds a proeprty image
  const residentialLandImageHandler = (event) => {
    setResidentialLandImageFileError(false)
    setResidentialLandImages(array => [...array, {
      file: URL.createObjectURL(event.target.files[0]),
      upload: event.target.files[0]
  }])
  }

  //The function triggers when the user adds a contract image
  const contractImageHandler = (event) => {
    setContractImages(array => [...array, {
        file: URL.createObjectURL(event.target.files[0]),
        upload: event.target.files[0]
    }])
}

  const arrayOfNumbersFromOneToTen = Array.apply(null, Array(10))
    .map(function (y, i) { return i + 1 })

  const arrayOfNumbersFromZeroToNine = Array.apply(null, Array(10))
    .map(function (y, i) { return i })

  function countWords(str) {
    const wordMatches = str.match(/\b\w+\b/g)
    return wordMatches ? wordMatches.length : 0
  }

  //The function is used to throw errors if the user has given incomplete data
  const errorCheckingBeforeSubmit = () => {
    if (!propertyTitle.trim()) {
      setPropertyTitleErrorMessage('Provide a title')
    } else if (countWords(propertyTitle.trim()) > 30) {
      setPropertyTitleErrorMessage('Title should be less than 30 words')
    }

    if (propertyDetail.trim() && countWords(propertyDetail.trim()) > 150) {
      setPropertyDetailError(true)
    }

    if (!isDeclareFixedPrice && !isRangeOfPrice) {
      setPriceErrorMessage('Select an option')
    } else if ((isDeclareFixedPrice && !fixedPrice) || (isRangeOfPrice && (!rangeOfPriceFrom || !rangeOfPriceTo))) {
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
    } else if (isRangeOfPrice && (rangeOfPriceTo <= rangeOfPriceFrom)) {
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

    if (!residentialLandImages.length) {
      setResidentialLandImageFileError(true)
    }

    if (residentialPropertyType.toLowerCase() === 'house' && !typeOfSale) {
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

    if (residentialPropertyType.toLowerCase() !== 'plot' && storeRoom === null) {
      setStoreRoomError(true)
    }

    if (residentialPropertyType.toLowerCase() !== 'plot') {
      if (servantRoom === null) {
        setServantRoomError(true)
      } else if (servantRoom && servantWashroom === null) {
        setServantWashroomError(true)
      }
    }

    if (residentialPropertyType.toLowerCase() !== 'plot') {
      if (!furnishing) {
        setFurnishingError(true)
      } else if (furnishing && (furnishing.semiFurnished || furnishing.fullyFurnished) && countWords(furnishingDetails.trim()) > 150) {
        setFurnishingDetailsError(true)
      }
    }

    if (residentialPropertyType.toLowerCase() !== 'plot') {
      if (!kitchenFurnishing) {
        setKitchenFurnishingError(true)
      } else if (kitchenFurnishing && (kitchenFurnishing.semiFurnished || kitchenFurnishing.modular) && countWords(kitchenFurnishingDetails.trim()) > 150) {
        setKitchenFurnishingDetailsError(true)
      }
    }

    if (residentialPropertyType.toLowerCase() !== 'plot') {
      if (kitchenAppliances === null) {
        setKitchenAppliancesError(true)
      } else if (kitchenAppliances && countWords(kitchenAppliancesDetails.trim()) > 50) {
        setKitchenAppliancesDetailsError(true)
      }
    }

    if (residentialPropertyType.toLowerCase() !== 'plot' && !washroomFitting) {
      setWashRoomFittingError(true)
    }

    if (residentialPropertyType.toLowerCase() !== 'plot' && !electricalFitting) {
      setElectricalFittingError(true)
    }

    if (residentialPropertyType.toLowerCase() !== 'plot' && (!flooringTypeArray || (flooringTypeArray && !flooringTypeArray.length))) {
      setFlooringTypeError(true)
    }

    if (residentialPropertyType.toLowerCase() !== 'plot' && (!roofTypeArray || (roofTypeArray && !roofTypeArray.length))) {
      setRoofTypeError(true)
    }

    if (residentialPropertyType.toLowerCase() !== 'plot' && (!wallTypeArray || (wallTypeArray && !wallTypeArray.length))) {
      setWallTypeError(true)
    }

    if (residentialPropertyType.toLowerCase() !== 'plot' && (!windowTypeArray || (windowTypeArray && !windowTypeArray.length))) {
      setWindowTypeError(true)
    }

    if (residentialPropertyType.toLowerCase() !== 'plot') {
      if (garden === null) {
        setGardenError(true)
      } else if (garden && countWords(gardenDetails.trim()) > 50) {
        setGardenDetailsError(true)
      }
    }

    if (residentialPropertyType.toLowerCase() !== 'plot' && !ageOfConstruction) {
      setAgeOfConstructionError(true)
    }

    if (residentialPropertyType.toLowerCase() !== 'plot' && !conditionOfProperty) {
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

    if (!residentialLandImages.length) {
      setResidentialLandImageFileError(true)
    }
  }

  //The function is triggered when the user submits the form
  const formSubmit = async (e) => {
    e.preventDefault()

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

    if (!propertyTitle.trim() || countWords(propertyTitle.trim()) > 30) {
      return errorFunction()
    } else if (propertyDetail.trim() && countWords(propertyDetail.trim()) > 150) {
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
    } else if (residentialPropertyType.toLowerCase() === 'house' && !typeOfSale) {
      return errorFunction()
    } else if (!totalAreaMetreSquare || !totalAreaGajj || !coveredAreaGajj || !coveredAreaMetreSquare) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && storeRoom === null) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (servantRoom === null || (servantRoom && servantWashroom === null))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (!furnishing || (furnishing && (furnishing.semiFurnished || furnishing.fullyFurnished) && countWords(furnishingDetails.trim()) > 150))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (!kitchenFurnishing || (kitchenFurnishing && (kitchenFurnishing.semiFurnished || kitchenFurnishing.modular) && countWords(kitchenFurnishingDetails.trim()) > 150))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (kitchenAppliances === null || (kitchenAppliances && countWords(kitchenAppliancesDetails.trim()) > 50))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && !washroomFitting) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && !electricalFitting) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (!flooringTypeArray || (flooringTypeArray && !flooringTypeArray.length))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (!roofTypeArray || (roofTypeArray && !roofTypeArray.length))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (!wallTypeArray || (wallTypeArray && !wallTypeArray.length))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (!windowTypeArray || (windowTypeArray && !windowTypeArray.length))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && (garden === null || (garden && countWords(gardenDetails.trim()) > 50))) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && !ageOfConstruction) {
      return errorFunction()
    } else if (residentialPropertyType.toLowerCase() !== 'plot' && !conditionOfProperty) {
      return errorFunction()
    } else if (isLegalRestrictions === null || (isLegalRestrictions && !legalRestrictionDetails.trim())) {
      return errorFunction()
    } else if (!district.trim() && !state.trim()) {
      return errorFunction()
    } else if(!residentialLandImages.length) {
      return errorFunction()
    }

    //Final property data submitted by the user
    const finalPropertyData = {
      addedByPropertyDealer: propertyDealerId,
      residentialPropertyType,
      title: propertyTitle,
      details: propertyDetail,
      price: {
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
        details: legalRestrictionDetails.trim() && (legalRestrictionDetails.trim()[0].toUpperCase() + legalRestrictionDetails.trim().slice(1)),
      },
      propertyTaxes: propertyTaxes || null,
      homeOwnersAssociationFees: homeOwnersAssociationFees || null,
      location: {
        name: {
          village: village.trim().toUpperCase(),
          city: city.trim().toUpperCase(),
          tehsil: tehsil,
          district,
          state
        }
      }
    }

    //data specific to house property type
    const houseSpecificData = {
      typeOfSale
    }

    //data specific to house and flat property typr
    const fieldsCommonToHouseAndFlat = {
      numberOfFloors,
      numberOfLivingRooms,
      numberOfBedrooms,
      numberOfOfficeRooms,
      numberOfWashrooms,
      numberOfKitchen,
      numberOfCarParkingSpaces,
      numberOfBalconies,
      storeRoom,
      servantRoom: {
        room: servantRoom,
        washroom: servantWashroom
      },
      furnishing: {
        type: furnishing,
        details: furnishingDetails.trim()
      },
      kitchenFurnishing: {
        type: kitchenFurnishing,
        details: kitchenFurnishingDetails.trim()
      },
      kitchenAppliances: {
        available: kitchenAppliances,
        details: kitchenAppliancesDetails
      },
      washroomFitting,
      electricalFitting,
      flooringTypeArray,
      roofTypeArray,
      wallTypeArray,
      windowTypeArray,
      safetySystemArray,
      garden: {
        available: garden,
        details: gardenDetails
      },
      ageOfConstruction,
      conditionOfProperty
    }

    //The if statements below are used to set property data in accordance with property type
    if (residentialPropertyType.toLowerCase() === 'plot') {
      setPropertyData(finalPropertyData)
    } else if (residentialPropertyType.toLowerCase() !== 'house') {
      setPropertyData({ ...houseSpecificData, ...finalPropertyData, ...fieldsCommonToHouseAndFlat })
    } else if (residentialPropertyType.toLowerCase() !== 'flat') {
      setPropertyData({ ...finalPropertyData, ...fieldsCommonToHouseAndFlat })
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

      {/*If propertyData is available, it will be shown in ReviewResidentialPropertyAfterSubmission component */}
      {propertyData && <ReviewResidentialPropertyAfterSubmission
        propertyData={propertyData}
        contractImages={contractImages}
        residentialLandImages={residentialLandImages}
        propertyDataReset={() => setPropertyData(null)}
        firmName={propertyDealerFirmName} />}

      {!spinner && <div className={`pl-2 pr-2 mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center ${alert.isAlertModal ? 'blur' : ''} ${propertyData ? 'fixed right-full' : ''}`} >

        <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
          <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/field-agent', { replace: true })}>Home</button>
        </div>

        <p className="fixed w-full text-center top-28 sm:top-16 pl-4 pr-4 pb-4 sm:pt-4 bg-white  text-xl font-bold z-10">Add an residential property by filling the form</p>

        <form className="w-full min-h-screen mt-48 sm:mt-36 md:w-10/12 lg:w-8/12  h-fit pt-4 pb-4 flex flex-col rounded border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

          <div className="flex flex-col md:flex-row place-items-center md:place-content-center  gap-3 mb-10 ">
            <p className="text-3xl font-bold text-gray-500 w-fit text-center">{propertyDealerFirmName}</p>
            {propertyDealerLogoUrl && <img className="w-20 h-auto " src={propertyDealerLogoUrl} alt='' />}
          </div>

          {/*Type of sale */}
          {residentialPropertyType.toLowerCase() === 'house' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {typeOfSaleError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Type of sale</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="floor-for-sale" name="type-of-sale" onChange={e => {
                    if (e.target.checked) {
                      setTypeOfSaleError(false)
                      setTypeOfSale({
                        floorForSale: true,
                        houseForSale: false
                      })
                    }
                  }} />
                  <label htmlFor="floor-for-sale">Floor for sale</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="house-for-sale" name="type-of-sale" onChange={e => {
                    if (e.target.checked) {
                      setTypeOfSaleError(false)
                      setTypeOfSale({
                        floorForSale: false,
                        houseForSale: true
                      })
                    }
                  }} />
                  <label htmlFor="house-for-sale">House for sale</label>
                </div>
              </div>
            </div>
          </div>}

          {/* Property type*/}
          <div className="flex flex-col p-2 pb-5 pt-5 ">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <p className="text-xl font-semibold text-gray-500" >Property type</p>
              <p className="text-lg text-gray-500">{residentialPropertyType}</p>
            </div>
          </div>

          {/*property title*/}
          <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            {propertyTitleErrorMessage.trim() && <p className="text-red-500 -mt-1">{propertyTitleErrorMessage.trim()}</p>}
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="property-title">Property title</label>
              </div>

              <textarea className={`border-2 ${propertyTitleErrorMessage.trim() ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-full sm:w-80 resize-none`} id="property-title" rows={5} name="property-title" autoCorrect="on" autoComplete="new-password" value={propertyTitle} onChange={e => {
                if (countWords(e.target.value.trim()) > 30) {
                  setPropertyTitle(e.target.value.trim())
                  setPropertyTitleErrorMessage('Title should be less than 30 words')
                } else {
                  setPropertyTitleErrorMessage('')
                  setPropertyTitle(e.target.value)
                }
              }} />
            </div>
          </div>

          {/*property details*/}
          <div className="flex flex-col p-2 pb-5 pt-5 ">
            {propertyDetailError && <p className="text-red-500 -mt-1">Details should be less than 150 words</p>}
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-16">
              <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="property-detail">Property details</label>

              <textarea className={`border-2 ${propertyDetailError ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-full sm:w-80 resize-none`} id="property-detail" rows={10} name="property-detail" autoCorrect="on" autoComplete="new-password" value={propertyDetail} onChange={e => {
                if (countWords(e.target.value.trim()) > 150) {
                  setPropertyDetail(e.target.value.trim())
                  setPropertyDetailError(true)
                } else {
                  setPropertyDetailError(false)
                  setPropertyDetail(e.target.value)
                }
              }} />
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
                  <input className=" mr-1 cursor-pointer" type="radio" id="fixed-price" name="price" onChange={e => {
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
                    <input id="fixed-price-number" type="number" name='fixed-price-number' className={`border-2 ${fixedPriceError ? 'border-red-400' : 'border-gray-300'} pl-1 pr-1 rounded bg-white w-40`} placeholder="Number" value={fixedPrice} onChange={e => {
                      if (+e.target.value.trim() > 0) {
                        setPriceErrorMessage('')
                        setFixedPrice(+e.target.value.trim())
                      } else {
                        setFixedPrice('')
                      }
                    }} />
                  </div>}

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="range-of-price" name="price" onChange={e => {
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
                      <input id="range-of-price-number-1" type="number" name='range-of-price-number-1' className={`border-2 ${rangeOfPriceFromError ? 'border-red-400' : 'border-gray-300'} pl-1 pr-1 rounded bg-white w-40`} placeholder="Number" value={rangeOfPriceFrom} onChange={e => {
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
                      <input id="range-of-price-number-2" type="number" name='range-of-price-number-2' className={`border-2 ${rangeOfPriceToError ? 'border-red-400' : 'border-gray-300'} pl-1 pr-1 rounded bg-white w-40`} placeholder="Number" value={rangeOfPriceTo} onChange={e => {
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
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="water-supply-yes" name="water-supply" onChange={e => {
                    if (e.target.checked) {
                      setIsWaterSupply(true)
                      setIsWaterSupplyTwentyFourHours(null)
                      setWaterSupplyError(false)
                      setWaterSupplyTwentyFourHoursError(false)
                    }
                  }} />
                  <label htmlFor="water-supply-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="water-supply-no" name="water-supply" onChange={e => {
                    if (e.target.checked) {
                      setIsWaterSupply(false)
                      setIsWaterSupplyTwentyFourHours(null)
                      setWaterSupplyError(false)
                      setWaterSupplyTwentyFourHoursError(false)
                    }
                  }} />
                  <label htmlFor="water-supply-no">No</label>
                </div>
              </div>
            </div>

            {isWaterSupply && <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ml-3">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">24 hours water supply</p>
              </div>
              <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="twenty-four-hours-yes" name="water-supply-twenty-four-hours" onChange={e => {
                    if (e.target.checked) {
                      setIsWaterSupplyTwentyFourHours(true)
                      setWaterSupplyTwentyFourHoursError(false)
                    }
                  }} />
                  <label htmlFor="twenty-four-hours-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="twenty-four-hours-no" name="water-supply-twenty-four-hours" onChange={e => {
                    if (e.target.checked) {
                      setIsWaterSupplyTwentyFourHours(false)
                      setWaterSupplyTwentyFourHoursError(false)
                    }
                  }} />
                  <label htmlFor="twenty-four-hours-no">No</label>
                </div>
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
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="electricity-connection-yes" name="electricity-connection" onChange={e => {
                    if (e.target.checked) {
                      setElectricityConnection(true)
                      setElectricityConnectionError(false)
                    }
                  }} />
                  <label htmlFor="electricity-connection-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="electricity-connection-no" name="electricity-connection" onChange={e => {
                    if (e.target.checked) {
                      setElectricityConnection(false)
                      setElectricityConnectionError(false)
                    }
                  }} />
                  <label htmlFor="electricity-connection-no">No</label>
                </div>
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
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="sewage-system-yes" name="sewage-system" onChange={e => {
                    if (e.target.checked) {
                      setSewageSystem(true)
                      setSewageSystemError(false)
                    }
                  }} />
                  <label htmlFor="sewage-system-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="sewage-system-no" name="sewage-system" onChange={e => {
                    if (e.target.checked) {
                      setSewageSystem(false)
                      setSewageSystemError(false)
                    }
                  }} />
                  <label htmlFor="sewage-system-no">No</label>
                </div>
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
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="cable-tv-yes" name="cable-tv" onChange={e => {
                    if (e.target.checked) {
                      setCableTV(true)
                      setCableTVError(false)
                    }
                  }} />
                  <label htmlFor="cable-tv-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="cable-tv-no" name="cable-tv" onChange={e => {
                    if (e.target.checked) {
                      setCableTV(false)
                      setCableTVError(false)
                    }
                  }} />
                  <label htmlFor="cable-tv-no">No</label>
                </div>
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
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="high-speed-internet-yes" name="high-speed-internet" onChange={e => {
                    if (e.target.checked) {
                      setHighSpeedInternet(true)
                      setHighSpeedInternetError(false)
                    }
                  }} />
                  <label htmlFor="high-speed-internet-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="high-speed-internet-no" name="high-speed-internet" onChange={e => {
                    if (e.target.checked) {
                      setHighSpeedInternet(false)
                      setHighSpeedInternetError(false)
                    }
                  }} />
                  <label htmlFor="high-speed-internet-no">No</label>
                </div>
              </div>
            </div>
          </div>

          {/*distance */}
          <div className="flex flex-col gap-1 p-2 pb-5 pt-5 bg-gray-100">
            {(distanceFromGroceryStoreError || distanceFromRestaurantCafeError || distanceFromExerciseAreaError || distanceFromSchoolError || distanceFromHospitalError) && <p className="text-red-500">Select district and state</p>}

            <div className="flex flex-row gap-0.5">
              <p className="h-4 text-2xl text-red-500">*</p>
              <p className="text-xl font-semibold text-gray-500" htmlFor="location">Distance from</p>
            </div>
            <div className="flex flex-col place-self-center w-11/12 gap-2">
              <div className="flex flex-row gap-8 w-full">
                <label className="text-gray-500 font-semibold" htmlFor="grocery-store">Grocery store (km)</label>
                <input type="number" id="grocery-store" name="grocery-store"
                  className={`border-2 ${distanceFromGroceryStoreError ? 'border-red-500' : 'border-gray-500'} border-gray-500 w-12 text-center p-1 rounded`} autoComplete="new-password" value={distanceFromGroceryStore} onChange={e => {
                    if (+e.target.value.trim() > 0) {
                      setDistanceFromGroceryStore(+e.target.value.trim())
                      setDistanceFromGroceryStoreError(false)
                    } else {
                      setDistanceFromGroceryStore('')
                    }
                  }} />
              </div>
              <div className="flex flex-row gap-3 w-full">
                <label className="text-gray-500 font-semibold" htmlFor="restaurant-cafe">Restaurant/Cafe (km)</label>
                <input type="number" id="restaurant-cafe" name="restaurant-cafe"
                  className={`border-2 ${distanceFromRestaurantCafeError ? 'border-red-500' : 'border-gray-500'} w-12 text-center p-1 rounded`} autoComplete="new-password" value={distanceFromRestaurantCafe} onChange={e => {
                    if (+e.target.value.trim() > 0) {
                      setDistanceFromRestaurantCafe(+e.target.value.trim())
                      setDistanceFromRestaurantCafeError(false)
                    } else {
                      setDistanceFromRestaurantCafe('')
                    }
                  }} />
              </div>
              <div className="flex flex-row gap-9 w-full">
                <label className="text-gray-500 font-semibold" htmlFor="exrecise-area">Exercise area (km)</label>
                <input type="number" id="exrecise-area" name="exrecise-area"
                  className={`border-2 ${distanceFromExerciseAreaError ? 'border-red-500' : 'border-gray-500'} w-12 text-center p-1 rounded`} autoComplete="new-password" value={distanceFromExerciseArea} onChange={e => {
                    if (+e.target.value.trim() > 0) {
                      setDistanceFromExerciseArea(+e.target.value.trim())
                      setDistanceFromExerciseAreaError(false)
                    } else {
                      setDistanceFromExerciseArea('')
                    }
                  }} />
              </div>
              <div className="flex flex-row gap-20 w-full">
                <label className="text-gray-500 font-semibold" htmlFor="school">School (km)</label>
                <input type="number" id="school" name="school"
                  className={`border-2 ${distanceFromSchoolError ? 'border-red-500' : 'border-gray-500'} w-12 text-center p-1 rounded`} autoComplete="new-password" value={distanceFromSchool} onChange={e => {
                    if (+e.target.value.trim() > 0) {
                      setDistanceFromSchool(+e.target.value.trim())
                      setDistanceFromSchoolError(false)
                    } else {
                      setDistanceFromSchool('')
                    }
                  }} />
              </div>
              <div className="flex flex-row gap-16 w-full">
                <label className="text-gray-500 font-semibold" htmlFor="hospital">Hospital (km)</label>
                <input type="number" id="hospital" name="hospital"
                  className={`border-2 ${distanceFromHospitalError ? 'border-red-500' : 'border-gray-500'} w-12 text-center ml-1 p-1 rounded`} autoComplete="new-password" value={distanceFromHospital} onChange={e => {
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
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="area-type-rural" name="area-type" value='Rural' onChange={e => {
                    if (e.target.checked) {
                      setAreaType(e.target.value)
                      setAreaTypeError(false)
                    }
                  }} />
                  <label htmlFor="area-type-rural">Rural</label>
                </div>
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="area-type-subUrban" name="area-type" value='Sub-Urban' onChange={e => {
                    if (e.target.checked) {
                      setAreaType(e.target.value)
                      setAreaTypeError(false)
                    }
                  }} />
                  <label htmlFor="area-type-subUrban">Sub-urban</label>
                </div>
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="area-type-urban" name="area-type" value='Urban' onChange={e => {
                    if (e.target.checked) {
                      setAreaType(e.target.value)
                      setAreaTypeError(false)
                    }
                  }} />
                  <label htmlFor="area-type-urban">Urban</label>
                </div>
              </div>
            </div>
          </div>

          {/* Number of floors*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="owners">Number of floors</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="floors" id="floors" value={numberOfFloors} onChange={e => {
                setNumberOfFloors(+e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/*total area*/}
          <div className="flex flex-col p-2 pb-5 pt-5 ">
            {(totalAreaGajjError || totalAreaMetreSquareError) && <p className="text-red-500 -mt-1">Provide details</p>}
            <div className="flex flex-row gap-5 sm:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Total area</p>
              </div>

              <div className="flex flex-col w-full gap-3">
                <div className="flex flex-row gap-1 ">
                  <input id="total-area-metre" type="number" name='total-area-metre' className={`border-2 ${totalAreaMetreSquareError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`} placeholder="Size" value={totalAreaMetreSquare} onChange={e => {
                    if (+e.target.value.trim() > 0) {
                      setTotalAreaErrorMetreSquareError(false)
                      setTotalAreaMetreSquare(+e.target.value.trim())
                    } else {
                      setTotalAreaMetreSquare('')
                    }
                  }} />
                  <p>Metre square</p>
                </div>
                <div className="flex flex-row gap-1 ">
                  <input id="total-area-gajj" type="number" name='total-area-gajj' className={`border-2 ${totalAreaGajjError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`} placeholder="Size" value={totalAreaGajj} onChange={e => {
                    if (+e.target.value.trim() > 0) {
                      setTotalAreaGajjError(false)
                      setTotalAreaGajj(+e.target.value.trim())
                    } else {
                      setTotalAreaGajj('')
                    }
                  }} />
                  <p>Gajj</p>
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

              <div className="flex flex-col  place-items-center sm:place-items-start gap-3">
                <div className="flex flex-row gap-1">
                  <input id="covered-area-metre" type="number" name='covered-area-metre' className={`border-2 ${coveredAreaMetreSquareError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`} placeholder="Size" value={coveredAreaMetreSquare} onChange={e => {
                    if (+e.target.value.trim() > 0) {
                      setCoveredAreaErrorMetreSquareError(false)
                      setCoveredAreaMetreSquare(+e.target.value.trim())
                    } else {
                      setCoveredAreaMetreSquare('')
                    }
                  }} />
                  <p>Metre square</p>
                </div>
                <div className="flex flex-row gap-1">
                  <input id="covered-area-gajj" type="number" name='covered-area-gajj' className={`border-2 ${coveredAreaGajjError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`} placeholder="Size" value={coveredAreaGajj} onChange={e => {
                    if (+e.target.value.trim() > 0) {
                      setCoveredAreaGajjError(false)
                      setCoveredAreaGajj(+e.target.value.trim())
                    } else {
                      setCoveredAreaGajj('')
                    }
                  }} />
                  <p>Gajj</p>
                </div>
              </div>
            </div>
          </div>

          {/* Number of living rooms*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5 ">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-rooms">Number of Living Rooms</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-rooms" id="number-of-rooms" value={numberOfLivingRooms} onChange={e => {
                setNumberOfLivingRooms(+e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of bedrooms*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-bedrooms">Number of Bedrooms</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-bedrooms" id="number-of-bedrooms" value={numberOfBedrooms} onChange={e => {
                setNumberOfBedrooms(+e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of office rooms*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5 ">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-office-rooms">Number of Office rooms</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-office-rooms" id="number-of-office-rooms" value={numberOfOfficeRooms} onChange={e => {
                setNumberOfOfficeRooms(+e.target.value)
              }}>
                {arrayOfNumbersFromZeroToNine.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of washrooms*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-washrooms">Number of Washrooms</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-washrooms" id="number-of-washrooms" value={numberOfWashrooms} onChange={e => {
                setNumberOfWashrooms(+e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of kitchen*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-kitchen">Number of Kitchens</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-kitchen" id="number-of-kitchen" value={numberOfKitchen} onChange={e => {
                setNumberOfKitchen(+e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of car parking spaces*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-car-parkings">Number of car parkings</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-car-parkings" id="number-of-car-parkings" value={numberOfCarParkingSpaces} onChange={e => {
                setNumberOfCarParkingSpaces(+e.target.value)
              }}>
                {arrayOfNumbersFromZeroToNine.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of balconies*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5 ">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-balconies">Number of balconies</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-balconies" id="number-of-balconies" value={numberOfBalconies} onChange={e => {
                setNumberOfBalconies(+e.target.value)
              }}>
                {arrayOfNumbersFromZeroToNine.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/*store room*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {storeRoomError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Store room</p>
              </div>
              <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="store-room-yes" name="store-room" onChange={e => {
                    if (e.target.checked) {
                      setStoreRoom(true)
                      setStoreRoomError(false)
                    }
                  }} />
                  <label htmlFor="store-room-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="store-room-no" name="store-room" onChange={e => {
                    if (e.target.checked) {
                      setStoreRoom(false)
                      setStoreRoomError(false)
                    }
                  }} />
                  <label htmlFor="store-room-no">No</label>
                </div>
              </div>
            </div>
          </div>}

          {/*servant room*/}
          {residentialPropertyType.toLowerCase() !== 'plot' &&
            <div className="p-2  flex flex-col pb-5 pt-5 ">
              {(servantRoomError || servantWashroomError) && <p className="text-red-500">Select an option</p>}
              <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                <div className="flex flex-row gap-0.5">
                  <p className="h-4 text-2xl text-red-500">*</p>
                  <p className="text-xl font-semibold text-gray-500 mb-2">Servant room</p>
                </div>
                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                  <div className="flex flex-row h-fit">
                    <input className="mr-1 cursor-pointer" type="radio" id="servant-room-yes" name="servant-room" onChange={e => {
                      if (e.target.checked) {
                        setServantRoom(true)
                        setServantRoomError(false)
                      }
                    }} />
                    <label htmlFor="servant-room-yes">Yes</label>
                  </div>

                  <div className="flex flex-row h-fit">
                    <input className=" mr-1 cursor-pointer" type="radio" id="servant-room-no" name="servant-room" onChange={e => {
                      if (e.target.checked) {
                        setServantRoom(false)
                        setServantRoomError(false)
                      }
                    }} />
                    <label htmlFor="servant-room-no">No</label>
                  </div>
                </div>
              </div>

              {servantRoom && <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
                <div className="flex flex-row gap-0.5">
                  <p className="h-4 text-2xl text-red-500">*</p>
                  <p className="text-xl font-semibold text-gray-500 mb-2">Servant washroom</p>
                </div>
                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                  <div className="flex flex-row h-fit">
                    <input className="mr-1 cursor-pointer" type="radio" id="servant-washroom-yes" name="servant-washroom" onChange={e => {
                      if (e.target.checked) {
                        setServantWashroom(true)
                        setServantWashroomError(false)
                      }
                    }} />
                    <label htmlFor="servant-washroom-yes">Yes</label>
                  </div>

                  <div className="flex flex-row h-fit">
                    <input className=" mr-1 cursor-pointer" type="radio" id="servant-room-no" name="servant-washroom" onChange={e => {
                      if (e.target.checked) {
                        setServantWashroom(false)
                        setServantWashroomError(false)
                      }
                    }} />
                    <label htmlFor="servant-room-no">No</label>
                  </div>
                </div>
              </div>}
            </div>}

          {/*Furnishing */}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {furnishingError && <p className="text-red-500">Select an option</p>}
            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">House Furnishing</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="fully-furnished" name="furnishing" onClick={() => {
                    setFurnishingDetails('')
                    setFurnishingDetailsError(false)
                    setFurnishingError(false)
                  }} onChange={e => {
                    if (e.target.checked) {
                      setFurnishing({
                        fullyFurnished: true,
                        semiFurnished: false,
                        unfurnished: false
                      })
                    }
                  }} />
                  <label htmlFor="fully-furnished">Fully furnished</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="semi-furnished" name="furnishing" value="Semi-furnished" onClick={() => {
                    setFurnishingDetails('')
                    setFurnishingDetailsError(false)
                    setFurnishingError(false)
                  }} onChange={e => {
                    if (e.target.checked) {
                      setFurnishing({
                        fullyFurnished: false,
                        semiFurnished: true,
                        unfurnished: false
                      })
                    }
                  }} />
                  <label className="whitespace-nowrap" htmlFor="semi-furnished">Semi-furnished</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="unfurnished" name="furnishing" value="Unfurnished" onClick={() => {
                    setFurnishingDetails('')
                    setFurnishingDetailsError(false)
                    setFurnishingError(false)
                  }} onChange={e => {
                    if (e.target.checked) {
                      setFurnishing({
                        fullyFurnished: false,
                        semiFurnished: false,
                        unfurnished: true
                      })
                    }
                  }} />
                  <label htmlFor="unfurnished">Unfurnished</label>
                </div>
              </div>
            </div>
            {furnishing && (furnishing.semiFurnished || furnishing.fullyFurnished) && <div className="text-center">
              <textarea className={`border-2 ${furnishingDetailsError ? "border-red-500" : "border-gray-400"}  rounded h-40 w-80 p-1 resize-none`} id="furnishing-details" name="furnishing-details" autoCorrect="on" autoComplete="new-password" placeholder="Add details about furnishing (optional)" value={furnishingDetails} onChange={e => {
                if (countWords(furnishingDetails.trim()) > 150) {
                  setFurnishingDetailsError(true)
                  setFurnishingDetails(e.target.value.trim())
                } else {
                  setFurnishingDetails(e.target.value)
                  setFurnishingDetailsError(false)
                }
              }} />
              {furnishingDetailsError && <p className="text-red-500">Details cannot be more than 150 words</p>}
            </div>}
          </div>}

          {/*Kitchen furnishing */}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5">
            {kitchenFurnishingError && <p className="text-red-500">Select an option</p>}
            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Kitchen furnishing</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="modular" name="kitchen-furnishing" value="Modular" onClick={() => {
                    setKitchenFurnishingDetails('')
                    setKitchenFurnishingDetailsError(false)
                    setKitchenFurnishingError(false)
                  }} onChange={e => {
                    if (e.target.checked) {
                      setKitchenFurnishing({
                        modular: true,
                        semiFurnished: false,
                        unFurnished: false
                      })
                    }
                  }} />
                  <label htmlFor="modular">Modular</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="kitchen-semi-furnished" name="kitchen-furnishing" onClick={() => {
                    setKitchenFurnishingDetails('')
                    setKitchenFurnishingDetailsError(false)
                    setKitchenFurnishingError(false)
                  }} onChange={e => {
                    if (e.target.checked) {
                      setKitchenFurnishing({
                        modular: false,
                        semiFurnished: true,
                        unFurnished: false
                      })
                    }
                  }} />
                  <label className="whitespace-nowrap" htmlFor="kitchen-semi-furnished">Semi-furnished</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className=" mr-1 cursor-pointer" type="radio" id="kitchen-unfurnished" name="kitchen-furnishing" value="Unfurnished" onClick={() => {
                    setKitchenFurnishingDetails('')
                    setKitchenFurnishingDetailsError(false)
                    setKitchenFurnishingError(false)
                  }} onChange={e => {
                    if (e.target.checked) {
                      setKitchenFurnishing({
                        modular: false,
                        semiFurnished: false,
                        unFurnished: true
                      })
                    }
                  }} />
                  <label htmlFor="kitchen-unfurnished">Unfurnished</label>
                </div>
              </div>
            </div>
            {kitchenFurnishing && (kitchenFurnishing.semiFurnished || kitchenFurnishing.modular) && <div className="text-center">
              <textarea className={`border-2 ${kitchenFurnishingDetailsError ? "border-red-500" : "border-gray-400"}  rounded h-40 w-80 p-1 resize-none`} id="type-of-kitchen-details" name="type-of-kitchen-details" autoCorrect="on" autoComplete="new-password" placeholder="Add details about furnishing (optional)" value={kitchenFurnishingDetails} onChange={e => {
                if (countWords(kitchenFurnishingDetails.trim()) > 150) {
                  setKitchenFurnishingDetailsError(true)
                  setKitchenFurnishingDetails(e.target.value.trim())
                } else {
                  setKitchenFurnishingDetails(e.target.value)
                  setKitchenFurnishingDetailsError(false)
                }
              }} />
              {kitchenFurnishingDetailsError && <p className="text-red-500">Details cannot be more than 150 words</p>}
            </div>}
          </div>}

          {/*kitchen appliances */}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {kitchenAppliancesError && <p className="text-red-500">Select an option</p>}
            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Kitchen appliances</p>
              </div>
              <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="kitchen-appliances-yes" name="kitchen-appliances" onChange={e => {
                    setKitchenAppliancesDetails('')
                    setKitchenAppliancesDetailsError(false)
                    setKitchenAppliancesError(false)
                    if (e.target.checked) {
                      setKitchenAppliances(true)
                    }
                  }} />
                  <label htmlFor="kitchen-appliances-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="kitchen-appliances-no" name="kitchen-appliances" onChange={e => {
                    setKitchenAppliancesDetails('')
                    setKitchenAppliancesDetailsError(false)
                    setKitchenAppliancesError(false)
                    if (e.target.checked) {
                      setKitchenAppliances(false)
                    }
                  }} />
                  <label htmlFor="kitchen-appliances-no">No</label>
                </div>
              </div>
            </div>
            {kitchenAppliances && <div className="text-center">
              <textarea className={`border-2 ${kitchenAppliancesDetailsError ? 'border-red-500' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`} id="kitchen-appliances-details" name="kitchen-appliances-details" autoCorrect="on" autoComplete="new-password" placeholder="Add details about kitchen appliances (optional)" value={kitchenAppliancesDetails} onChange={e => {
                if (countWords(kitchenAppliancesDetails.trim()) > 50) {
                  setKitchenAppliancesDetailsError(true)
                  setKitchenAppliancesDetails(e.target.value.trim())
                } else {
                  setKitchenAppliancesDetails(e.target.value)
                  setKitchenAppliancesDetailsError(false)
                }
              }} />
              {kitchenAppliancesDetailsError && <p className="text-red-500">Details cannot be more than 50 words</p>}
            </div>}
          </div>}

          {/*washroom fitting*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 ">
            {washroomFittingError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Washrooom fitting</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="standard" name="washroom-fitting" onChange={e => {
                    if (e.target.checked) {
                      setWashRoomFittingError(false)
                      setWashRoomFitting({
                        standard: true,
                        premium: false,
                        luxurious: false
                      })
                    }
                  }} />
                  <label htmlFor="standard">Standard</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="premium" name="washroom-fitting" onChange={e => {
                    if (e.target.checked) {
                      setWashRoomFittingError(false)
                      setWashRoomFitting({
                        standard: false,
                        premium: true,
                        luxurious: false
                      })
                    }
                  }} />
                  <label htmlFor="premium">Premium</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="luxurious" name="washroom-fitting" onChange={e => {
                    if (e.target.checked) {
                      setWashRoomFittingError(false)
                      setWashRoomFitting({
                        standard: false,
                        premium: false,
                        luxurious: true
                      })
                    }
                  }} />
                  <label htmlFor="luxurious">Luxurious</label>
                </div>
              </div>
            </div>
          </div>}

          {/*electrical fitting*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {electricalFittingError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Electrical fitting</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="standard" name="electrical-fitting" onChange={e => {
                    if (e.target.checked) {
                      setElectricalFittingError(false)
                      setElectricalFitting({
                        standard: true,
                        premium: false,
                        luxurious: false
                      })
                    }
                  }} />
                  <label htmlFor="standard">Standard</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="premium" name="electrical-fitting" onChange={e => {
                    if (e.target.checked) {
                      setElectricalFittingError(false)
                      setElectricalFitting({
                        standard: false,
                        premium: true,
                        luxurious: false
                      })
                    }
                  }} />
                  <label htmlFor="premium">Premium</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="luxurious" name="electrical-fitting" onChange={e => {
                    if (e.target.checked) {
                      setElectricalFittingError(false)
                      setElectricalFitting({
                        standard: false,
                        premium: false,
                        luxurious: true
                      })
                    }
                  }} />
                  <label htmlFor="luxurious">Luxurious</label>
                </div>
              </div>
            </div>
          </div>}

          {/*flooring type*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 ">
            {flooringTypeError && <p className="text-red-500">Select atleast one option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Flooring type</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                {flooringTypeOptions.map(type =>
                  <div key={type} className="flex flex-row h-fit">
                    <input className="mr-1 cursor-pointer" type="checkbox" id={type} onChange={e => {
                      if (e.target.checked) {
                        setFlooringTypeError(false)
                        if (!flooringTypeArray) {
                          setFlooringTypeArray([type])
                        } else {
                          setFlooringTypeArray(flooringTypeArray => [...flooringTypeArray, type])
                        }
                      } else {
                        const updatedFlooringTypeArray = flooringTypeArray.filter(item => item !== type)
                        setFlooringTypeArray(updatedFlooringTypeArray)
                      }
                    }} />
                    <label htmlFor={type}>{type}</label>
                  </div>
                )}
              </div>
            </div>
          </div>}

          {/*roof type*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {roofTypeError && <p className="text-red-500">Select atleast one option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Roof type</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                {roofTypeOptions.map(type =>
                  <div key={type} className="flex flex-row h-fit">
                    <input className="mr-1 cursor-pointer" type="checkbox" id={type} onChange={e => {
                      if (e.target.checked) {
                        setRoofTypeError(false)
                        if (!roofTypeArray) {
                          setRoofTypeArray([type])
                        } else {
                          setRoofTypeArray(roofTypeArray => [...roofTypeArray, type])
                        }
                      } else {
                        const updatedRoofTypeArray = roofTypeArray.filter(item => item !== type)
                        setRoofTypeArray(updatedRoofTypeArray)
                      }
                    }} />
                    <label htmlFor={type}>{type}</label>
                  </div>
                )}
              </div>
            </div>
          </div>}

          {/*wall type*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5">
            {wallTypeError && <p className="text-red-500">Select atleast one option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Wall type</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                {wallTypeOptions.map(type =>
                  <div key={type} className="flex flex-row h-fit">
                    <input className="mr-1 cursor-pointer" type="checkbox" id={type} onChange={e => {
                      if (e.target.checked) {
                        setWallTypeError(false)
                        if (!wallTypeArray) {
                          setWallTypeArray([type])
                        } else {
                          setWallTypeArray(wallTypeArray => [...wallTypeArray, type])
                        }
                      } else {
                        const updatedWallTypeArray = wallTypeArray.filter(item => item !== type)
                        setWallTypeArray(updatedWallTypeArray)
                      }
                    }} />
                    <label htmlFor={type}>{type}</label>
                  </div>
                )}
              </div>
            </div>
          </div>}

          {/*Window type*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {windowTypeError && <p className="text-red-500">Select atleast one option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Window type</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                {windowTypeOptions.map(type =>
                  <div key={type} className="flex flex-row h-fit">
                    <input className="mr-1 cursor-pointer" type="checkbox" id={type} onChange={e => {
                      if (e.target.checked) {
                        setWindowTypeError(false)
                        if (!windowTypeArray) {
                          setWindowTypeArray([type])
                        } else {
                          setWindowTypeArray(windowTypeArray => [...windowTypeArray, type])
                        }
                      } else {
                        const updatedWindowTypeArray = windowTypeArray.filter(item => item !== type)
                        setWindowTypeArray(updatedWindowTypeArray)
                      }
                    }} />
                    <label htmlFor={type}>{type}</label>
                  </div>
                )}
              </div>
            </div>
          </div>}

          {/*safety system*/}
          {residentialPropertyType.toLowerCase() !== 'plot' &&
            <div className="p-2  flex flex-row gap-8 sm:gap-10 lg:gap-16 pb-5 pt-5 ">
              <p className="text-xl font-semibold text-gray-500 mb-2">Safety system</p>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                {safetySystemOptions.map(type =>
                  <div key={type} className="flex flex-row h-fit">
                    <input className="mr-1 cursor-pointer" type="checkbox" id={type} onChange={e => {
                      if (e.target.checked) {
                        setSafetySystemArray(array => [...array, type])
                      } else {
                        const updatedSafetySystemArray = safetySystemArray.filter(item => item !== type)
                        setSafetySystemArray(updatedSafetySystemArray)
                      }
                    }} />
                    <label htmlFor={type}>{type}</label>
                  </div>
                )}
              </div>
            </div>}

          {/*garden */}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {gardenError && <p className="text-red-500">Select an option</p>}
            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Garden</p>
              </div>
              <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="garden-yes" name="garden" onChange={e => {
                    setGardenDetails('')
                    setGardenDetailsError(false)
                    setGardenError(false)
                    if (e.target.checked) {
                      setGarden(true)
                    }
                  }} />
                  <label htmlFor="garden-yes">Yes</label>
                </div>

                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="garden-no" name="garden" onChange={e => {
                    setGardenDetails('')
                    setGardenDetailsError(false)
                    setGardenError(false)
                    if (e.target.checked) {
                      setGarden(false)
                    }
                  }} />
                  <label htmlFor="garden-no">No</label>
                </div>
              </div>
            </div>
            {garden && <div className="text-center">
              <textarea className={`border-2 ${gardenDetailsError ? 'border-red-500' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`} id="garden-details" name="garden-details" autoCorrect="on" autoComplete="new-password" placeholder="Add details about garden (optional)" value={gardenDetails} onChange={e => {
                if (countWords(gardenDetails.trim()) > 50) {
                  setGardenDetailsError(true)
                  setGardenDetails(e.target.value.trim())
                } else {
                  setGardenDetails(e.target.value)
                  setGardenDetailsError(false)
                }
              }} />
              {gardenDetailsError && <p className="text-red-500">Details cannot be more than 50 words</p>}
            </div>}
          </div>}

          {/*age of construction*/}
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="flex flex-col p-2 pb-5 pt-5 ">
            {ageOfConstructionError && <p className="text-red-500 -mt-1">Provide details</p>}
            <div className="flex flex-row gap-5 sm:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Age of construction</p>
              </div>

              <div className="flex flex-row gap-1">
                <input id="total-area-metre" type="number" name='total-area-metre' className={`border-2 ${ageOfConstructionError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-16 text-center`} placeholder="Size" value={ageOfConstruction} onChange={e => {
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
          {residentialPropertyType.toLowerCase() !== 'plot' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {conditionOfPropertyError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 ">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 mb-2">Condition of property</p>
              </div>
              <div className="flex flex-col gap-2 pt-1 pr-4 sm:pr-0">
                {conditionOfPropertyOptions.map(option => {
                  return <div key={option} className="flex flex-row h-fit">
                    <input className="mr-1 cursor-pointer" type="radio" id={option} name="washroom-fitting" onChange={e => {
                      if (e.target.checked) {
                        setConditionOfPropertyError(false)
                        setConditionOfProperty(option)
                      }
                    }} />
                    <label htmlFor={option}>{option}</label>
                  </div>
                })}
              </div>
            </div>
          </div>}

          {/* Number of owners*/}
          <div className="flex flex-col p-2 pb-5 pt-5">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="owners">Number of owners</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="owners" id="owners" value={numberOfOwners} onChange={e => {
                setNumberOfOwners(+e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
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
                <div className="flex flex-row h-fit">
                  <input className="mr-1 cursor-pointer" type="radio" id="yes" name="restrictions" value="yes" onChange={e => {
                    setLegalRestrictionDetails('')
                    setLegalRestrictionDetailsError(false)
                    setLegalRestrictionError(false)
                    if (e.target.checked) {
                      setIsLegalRestrictions(true)
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

          {/*Property taxes*/}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 lg:gap-16  p-2 pb-5 pt-3">
            <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Property taxes per year</p>
            <div className="flex flex-row place-content-center gap-1">
              <p>Rs.</p>
              <input id="proeprty-taxes" type="number" name='proeprty-taxes' className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-28 `} value={propertyTaxes} onChange={e => {
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
              <input id="home-owners-fees" type="number" name='home-owners-fees' className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-28 `} value={homeOwnersAssociationFees} onChange={e => {
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
            {districtError && !stateError && <p className="text-red-500">Select a state</p>}
            {stateError && !districtError && <p className="text-red-500">Select a district</p>}
            {stateError && districtError && <p className="text-red-500">Select district and state</p>}

            <div className="flex flex-row gap-0.5">
              <p className="h-4 text-2xl text-red-500">*</p>
              <p className="text-xl font-semibold text-gray-500" htmlFor="location">Property location</p>
            </div>
            <div className="flex flex-col place-self-center w-11/12 gap-2">
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


          {/* contract*/}
          <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5">
              <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Upload images of contract between seller and dealer (optional)</label>
              <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={contractImageHandler} onClick={e => e.target.value = null} />
            </div>
            {contractImages.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
              {contractImages.map(image => {
                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                  <img className='relative w-auto h-60' src={image.file} alt="" />
                  <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                    const updatedState = contractImages.filter(item => item.file !== image.file)
                    setContractImages(updatedState)
                  }}>X</div>
                </div>
              })}
            </div>}
          </div>

          {/*images */}
          <div className="flex flex-col p-2 pb-5 pt-5 ">
            {residentialLandImageFileError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
            <div className="flex flex-row gap-5">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Upload property images</label>
              </div>
              <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={residentialLandImageHandler} onClick={e => e.target.value = null} />
            </div>
            {residentialLandImages.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
              {residentialLandImages.map(image => {
                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                  <img className='relative w-auto h-60' src={image.file} alt="" />
                  <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                    const updatedState = residentialLandImages.filter(item => item.file !== image.file)
                    setResidentialLandImages(updatedState)
                  }}>X</div>
                </div>
              })}
            </div>}
          </div>

          <div className="flex justify-center mt-4 p-2">
            <button type='submit' className="w-full bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">Save</button>
          </div>

        </form>
      </div >}
    </Fragment >
  )
}
export default ResidentialPropertyAddForm