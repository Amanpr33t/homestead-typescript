
import { Fragment, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AlertModal from '../AlertModal'
import { punjabDistricts } from '../../utils/tehsilsAndDistricts/districts'
import PunjabTehsilsDropdown from "./tehsilsDropdown/Punjab"
import ReviewAgriculturalPropertyAfterSubmission from "./ReviewAgriculturalPropertyAfterSubmission"
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../utils/stringUtilityFunctions"
import Spinner from "../Spinner"

//This component is a form used by a field agent to add a property dealer
function ResidentialPropertyAddForm() {
  const navigate = useNavigate()

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const propertyDealerId = queryParams.get('id')
  const propertyDealerLogoUrl = queryParams.get('logoUrl')
  const propertyDealerFirmName = queryParams.get('firmName')
  const residentialPropertyType = queryParams.get('propertyType')

  const [spinner, setSpinner] = useState(true)

  useEffect(() => {
    if (!propertyDealerId || !propertyDealerLogoUrl || !propertyDealerFirmName || (residentialPropertyType !== 'plot' && residentialPropertyType !== 'flat' && residentialPropertyType !== 'house')) {
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

  const [propertyTitle, setPropertyTitle] = useState('')
  const [propertyTitleErrorMessage, setPropertyTitleErrorMessage] = useState('')

  const [propertyDetail, setPropertyDetail] = useState('')
  const [propertyDetailError, setPropertyDetailError] = useState(false)

  const [priceErrorMessage, setPriceErrorMessage] = useState('')
  const [isDeclareFixedPrice, setIsDeclaredFixedPrice] = useState(false)
  const [isRangeOfPrice, setIsRangeOfPrice] = useState(false)
  const [fixedPrice, setFixedPrice] = useState('')
  const [fixedPriceError, setFixedPriceError] = useState(false)
  const [rangeOfPriceFrom, setRangeOfPriceFrom] = useState('')
  const [rangeOfPriceFromError, setRangeOfPriceFromError] = useState(false)
  const [rangeOfPriceTo, setRangeOfPriceTo] = useState('')
  const [rangeOfPriceToError, setRangeOfPriceToError] = useState(false)

  const [isWaterSupply, setIsWaterSupply] = useState(null)
  const [isWaterSupplyTwentyFourHours, setIsWaterSupplyTwentyFourHours] = useState(null)
  const [waterSupplyError, setWaterSupplyError] = useState(false)
  const [waterSupplyTwentyFourHoursError, setWaterSupplyTwentyFourHoursError] = useState(false)

  const [electricityConnection, setElectricityConnection] = useState(null)
  const [electricityConnectionError, setElectricityConnectionError] = useState(false)

  const [sewageSystem, setSewageSystem] = useState(null)
  const [sewageSystemError, setSewageSystemError] = useState(false)

  const [cableTV, setCableTV] = useState(null)
  const [cableTVError, setCableTVError] = useState(false)

  const [highSpeedInternet, setHighSpeedInternet] = useState(null)
  const [highSpeedInternetError, setHighSpeedInternetError] = useState(false)

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

  const [areaType, setAreaType] = useState(false)
  const [areaTypeError, setAreaTypeError] = useState(false)

  const [numberOfFloors, setNumberOfFloors] = useState(1)

  const [typeOfSale, setTypeOfSale] = useState(null)
  const [typeOfSaleError, setTypeOfSaleError] = useState(false)

  const [totalAreaMetreSquare, setTotalAreaMetreSquare] = useState('')
  const [totalAreaGajj, setTotalAreaGajj] = useState('')
  const [totalAreaMetreSquareError, setTotalAreaErrorMetreSquareError] = useState(false)
  const [totalAreaGajjError, setTotalAreaGajjError] = useState(false)

  const [coveredAreaMetreSquare, setCoveredAreaMetreSquare] = useState('')
  const [coveredAreaGajj, setCoveredAreaGajj] = useState('')
  const [coveredAreaMetreSquareError, setCoveredAreaErrorMetreSquareError] = useState(false)
  const [coveredAreaGajjError, setCoveredAreaGajjError] = useState(false)

  const [numberOfLivingRooms, setNumberOfLivingRooms] = useState(1)
  const [numberOfBedrooms, setNumberOfBedrooms] = useState(1)
  const [numberOfOfficeRooms, setNumberOfOfficeRooms] = useState(0)
  const [numberOfWashrooms, setNumberOfWashrooms]=useState(1)
  const [numberOfKitchen, setNumberOfKitchen]=useState(1)
  const [numberOfCarParkingSpaces, setNumberOfCarParkingSpaces]=useState(0)
  const [numberOfBalconies, setNumberOfBalconies]=useState(0)





  const [state, setState] = useState('')
  const [stateError, setStateError] = useState(false)
  const [district, setDistrict] = useState('')
  const [districtError, setDistrictError] = useState(false)
  const [city, setCity] = useState('')
  const [tehsil, setTehsil] = useState('')
  const [village, setVillage] = useState('')

  const [residentialLandImageUpload, setResidentialLandImageUpload] = useState([])
  const [residentialLandImageFile, setResidentialLandImageFile] = useState([])
  const [residentialLandImageFileError, setResidentialLandImageFileError] = useState(false)

  const [contractImageUpload, setContractImageUpload] = useState([])
  const [contractImageFile, setContractImageFile] = useState([])

  const [numberOfOwners, setNumberOfOwners] = useState(1)

  const [isLegalRestrictions, setIsLegalRestrictions] = useState(false)
  const [legalRestrictionError, setLegalRestrictionError] = useState(false)
  const [legalRestrictionDetails, setLegalRestrictionDetails] = useState('')
  const [legalRestrictionDetailsError, setLegalRestrictionDetailsError] = useState(false)

  const states = ['Chandigarh', 'Punjab', 'Haryana']

  const [propertyData, setPropertyData] = useState()

  const residentialLandImageHandler = (event) => {
    setResidentialLandImageFileError(false)
    setResidentialLandImageFile(array => [...array, URL.createObjectURL(event.target.files[0])])
    setResidentialLandImageUpload(array => [...array, event.target.files[0]])
  }

  const contractImageHandler = (event) => {
    setContractImageFile(array => [...array, URL.createObjectURL(event.target.files[0])])
    setContractImageUpload(array => [...array, event.target.files[0]])
  }

  const arrayOfNumbersFromOneToTen = Array.apply(null, Array(10))
    .map(function (y, i) { return i + 1 })

  const arrayOfNumbersFromZeroToNine = Array.apply(null, Array(10))
    .map(function (y, i) { return i  })

  function countWords(str) {
    const wordMatches = str.match(/\b\w+\b/g)
    return wordMatches ? wordMatches.length : 0
  }

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
    } else if (rangeOfPriceTo < rangeOfPriceFrom) {
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

    if (!residentialLandImageFile.length) {
      setResidentialLandImageFileError(true)
    }

    if (residentialPropertyType === 'house' && !typeOfSale) {
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

    if (isLegalRestrictions === undefined) {
      setLegalRestrictionError(true)
    } else {
      if (isLegalRestrictions && !legalRestrictionDetails.trim()) {
        legalRestrictionDetailsError(true)
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

    if (!propertyTitle.trim() || countWords(propertyTitle.trim()) > 30) {
      errorFunction()
    } else if (propertyDetail.trim() && countWords(propertyDetail.trim()) > 150) {
      errorFunction()
    } else if ((!isDeclareFixedPrice && !isRangeOfPrice) || (isDeclareFixedPrice && !fixedPrice) || (isRangeOfPrice && (!rangeOfPriceFrom || !rangeOfPriceTo)) || (rangeOfPriceTo <= rangeOfPriceFrom)) {
      errorFunction()
    } else if (isWaterSupply === null || (isWaterSupply && isWaterSupplyTwentyFourHours === null)) {
      errorFunction()
    } else if (electricityConnection === null) {
      errorFunction()
    } else if (sewageSystem === null) {
      errorFunction()
    } else if (cableTV === null) {
      errorFunction()
    } else if (highSpeedInternet === null) {
      errorFunction()
    } else if (!distanceFromGroceryStore || !distanceFromRestaurantCafe || !distanceFromExerciseArea || !distanceFromSchool || !distanceFromHospital) {
      errorFunction()
    } else if (!areaType) {
      errorFunction()
    } else if (residentialPropertyType === 'house' && !typeOfSale) {
      errorFunction()
    } else if (!totalAreaMetreSquare || !totalAreaGajj || !coveredAreaGajj || !coveredAreaMetreSquare) {
      errorFunction()
    }


    if (!residentialLandImageFile.length || !district.trim() || !state.trim() || isLegalRestrictions === undefined || (isLegalRestrictions && !legalRestrictionDetails.trim())) {

    }

    const finalPropertyData = {
      addedByPropertyDealer: propertyDealerId,
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
        twentyHours: isWaterSupplyTwentyFourHours
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




     
      location: {
        name: {
          village: village.trim() && (village.trim()[0].toUpperCase() + village.trim().slice(1)),
          city: city.trim() && (city.trim()[0].toUpperCase() + city.trim().slice(1)),
          tehsil: tehsil,
          district,
          state
        }
      },
      numberOfOwners,
      legalRestrictions: {
        isLegalRestrictions,
        details: legalRestrictionDetails.trim() && (legalRestrictionDetails.trim()[0].toUpperCase() + legalRestrictionDetails.trim().slice(1)),
      }
    }
    const plotSpecificData = {

    }
    const flatSpecificData = {
      numberOfFloors,
      numberOfLivingRooms,
      numberOfBedrooms,
      numberOfOfficeRooms,
      numberOfWashrooms,
      numberOfKitchen,
      numberOfCarParkingSpaces,
      numberOfBalconies
    }
    const houseSpecificData = {
      numberOfFloors,
      typeOfSale,
      numberOfLivingRooms,
      numberOfBedrooms,
      numberOfOfficeRooms,
      numberOfWashrooms,
      numberOfKitchen,
      numberOfCarParkingSpaces,
      numberOfBalconies
    }
    setPropertyData(finalPropertyData)
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

      {/*propertyData && <ReviewAgriculturalPropertyAfterSubmission
        propertyData={propertyData}
        residentialLandImageFile={residentialLandImageFile}
        contractImageFile={contractImageFile}
        residentialLandImageUpload={residentialLandImageUpload}
        contractImageUpload={contractImageUpload}
        propertyDataReset={() => setPropertyData(null)}
    firmName={propertyDealerFirmName} />*/}

      {/*propertyData ? 'fixed right-full' : ''*/}

      {!spinner && <div className={`pl-2 pr-2 mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center ${alert.isAlertModal ? 'blur' : ''} $`} >

        <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
          <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/field-agent', { replace: true })}>Home</button>
        </div>

        <p className="fixed w-full text-center top-28 sm:top-16 pl-4 pr-4 pb-4 sm:pt-4 bg-white  text-xl font-bold z-10">Add an agricultural property by filling the form</p>

        <form className="w-full min-h-screen mt-48 sm:mt-36 md:w-10/12 lg:w-8/12  h-fit pt-4 pb-4 flex flex-col rounded border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

          <div className="flex flex-col md:flex-row place-items-center md:place-content-center  gap-3 mb-10 ">
            <p className="text-3xl font-bold text-gray-500 w-fit text-center">{propertyDealerFirmName}</p>
            {propertyDealerLogoUrl && <img className="w-20 h-auto " src={propertyDealerLogoUrl} alt='' />}
          </div>


          {/* Property type*/}
          <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <p className="text-xl font-semibold text-gray-500" >Property type</p>
              <p className="text-lg text-gray-500">{residentialPropertyType}</p>
            </div>
          </div>

          {/*Type of sale */}
          {residentialPropertyType === 'house' && <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {typeOfSaleError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
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

          {/*property title*/}
          <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            {propertyTitleErrorMessage.trim() && <p className="text-red-500 -mt-1">{propertyTitleErrorMessage.trim()}</p>}
            <div className="flex flex-row gap-5 sm:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="property-title">Title</label>
              </div>

              <div className="flex flex-col gap-5">
                <textarea className={`border-2 ${propertyTitleErrorMessage.trim() ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-56 sm:w-80 resize-none`} id="property-title" rows={5} name="property-title" autoCorrect="on" autoComplete="new-password" value={propertyTitle} onChange={e => {
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
          </div>

          {/*property details*/}
          <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            {propertyDetailError && <p className="text-red-500 -mt-1">Details should be less than 150 words</p>}
            <div className="flex flex-row gap-5 sm:gap-16">
              <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="property-detail">Details</label>

              <div className="flex flex-col gap-5">
                <textarea className={`border-2 ${propertyDetailError ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-56 sm:w-80 resize-none`} id="property-detail" rows={10} name="property-detail" autoCorrect="on" autoComplete="new-password" value={propertyDetail} onChange={e => {
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
          </div>

          {/*price */}
          <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {priceErrorMessage && <p className="text-red-500 -mt-1">{priceErrorMessage}</p>}
            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
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
                      if (+e.target.value.trim() !== 0) {
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
                        if (+e.target.value.trim() !== 0) {
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
                        if (+e.target.value.trim() !== 0) {
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
          <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {(waterSupplyError || waterSupplyTwentyFourHoursError) && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
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

            {isWaterSupply && <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2 ml-3">
              <p className="text-xl font-semibold text-gray-500 mb-2">24 hours water supply</p>
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

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
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
          <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {sewageSystemError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
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

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
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
          <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {highSpeedInternetError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
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
          <div className="flex flex-col gap-1 p-2 pb-5 pt-5">
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
                    if (+e.target.value.trim() !== 0) {
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
                    if (+e.target.value.trim() !== 0) {
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
                    if (+e.target.value.trim() !== 0) {
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
                    if (+e.target.value.trim() !== 0) {
                      setDistanceFromSchool(+e.target.value.trim())
                      setDistanceFromSchoolError(false)
                    } else {
                      setDistanceFromSchool('')
                    }
                  }} />
              </div>
              <div className="flex flex-row gap-9 w-full">
                <label className="text-gray-500 font-semibold" htmlFor="hospital">Exercise area (km)</label>
                <input type="number" id="hospital" name="hospital"
                  className={`border-2 ${distanceFromHospitalError ? 'border-red-500' : 'border-gray-500'} w-12 text-center p-1 rounded`} autoComplete="new-password" value={distanceFromHospital} onChange={e => {
                    if (+e.target.value.trim() !== 0) {
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
          <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
            {areaTypeError && <p className="text-red-500">Select an option</p>}

            <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
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
          {(residentialPropertyType === 'flat' || residentialPropertyType === 'house') && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="owners">Number of floors</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="floors" id="floors" value={numberOfFloors} onChange={e => {
                setNumberOfFloors(e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/*total area*/}
          <div className="flex flex-col p-2 pb-5 pt-5">
            {(totalAreaGajjError || totalAreaMetreSquareError) && <p className="text-red-500 -mt-1">Provide details</p>}
            <div className="flex flex-row gap-5 sm:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Total area</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-1">
                  <input id="total-area-metre" type="number" name='total-area-metre' className={`border-2 ${totalAreaMetreSquareError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`} placeholder="Size" value={totalAreaMetreSquare} onChange={e => {
                    if (+e.target.value.trim() !== 0) {
                      setTotalAreaErrorMetreSquareError(false)
                      setTotalAreaMetreSquare(+e.target.value.trim())
                    } else {
                      setTotalAreaMetreSquare('')
                    }
                  }} />
                  <p>Metre square</p>
                </div>
                <div className="flex flex-row gap-1">
                  <input id="total-area-gajj" type="number" name='total-area-gajj' className={`border-2 ${totalAreaGajjError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`} placeholder="Size" value={totalAreaGajj} onChange={e => {
                    if (+e.target.value.trim() !== 0) {
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
          <div className="flex flex-col p-2 pb-5 pt-5">
            {(coveredAreaGajjError || coveredAreaMetreSquareError) && <p className="text-red-500 -mt-1">Provide details</p>}
            <div className="flex flex-row gap-5 sm:gap-16">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <p className="text-xl font-semibold text-gray-500 whitespace-nowrap" >Covered area</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-1">
                  <input id="covered-area-metre" type="number" name='covered-area-metre' className={`border-2 ${coveredAreaMetreSquareError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`} placeholder="Size" value={coveredAreaMetreSquare} onChange={e => {
                    if (+e.target.value.trim() !== 0) {
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
                    if (+e.target.value.trim() !== 0) {
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
          {(residentialPropertyType === 'flat' || residentialPropertyType === 'house') && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-rooms">Number of Living Rooms</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-rooms" id="number-of-rooms" value={numberOfLivingRooms} onChange={e => {
                setNumberOfLivingRooms(e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of bedrooms*/}
          {(residentialPropertyType === 'flat' || residentialPropertyType === 'house') && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-bedrooms">Number of Bedrooms</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-bedrooms" id="number-of-bedrooms" value={numberOfBedrooms} onChange={e => {
                setNumberOfBedrooms(e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of office rooms*/}
          {(residentialPropertyType === 'flat' || residentialPropertyType === 'house') && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-office-rooms">Number of Office rooms</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-office-rooms" id="number-of-office-rooms" value={numberOfOfficeRooms} onChange={e => {
                setNumberOfOfficeRooms(e.target.value)
              }}>
                {arrayOfNumbersFromZeroToNine.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}
          
          {/* Number of washrooms*/}
          {(residentialPropertyType === 'flat' || residentialPropertyType === 'house') && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-washrooms">Number of Washrooms</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-washrooms" id="number-of-washrooms" value={numberOfWashrooms} onChange={e => {
                setNumberOfWashrooms(e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of kitchen*/}
          {(residentialPropertyType === 'flat' || residentialPropertyType === 'house') && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-kitchen">Number of Kitchens</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-kitchen" id="number-of-kitchen" value={numberOfKitchen} onChange={e => {
                setNumberOfKitchen(e.target.value)
              }}>
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of car parking spaces*/}
          {(residentialPropertyType === 'flat' || residentialPropertyType === 'house') && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-car-parkings">Number of car parkings</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-car-parkings" id="number-of-car-parkings" value={numberOfCarParkingSpaces} onChange={e => {
                setNumberOfCarParkingSpaces(e.target.value)
              }}>
                {arrayOfNumbersFromZeroToNine.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
            </div>
          </div>}

          {/* Number of car parking spaces*/}
          {(residentialPropertyType === 'flat' || residentialPropertyType === 'house') && <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
              <label className="text-xl font-semibold text-gray-500" htmlFor="number-of-balconies">Number of balconies</label>
              <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="number-of-balconies" id="number-of-balconies" value={numberOfBalconies} onChange={e => {
                setNumberOfBalconies(e.target.value)
              }}>
                {arrayOfNumbersFromZeroToNine.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
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
                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
              </select>
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
                  <label htmlFor="nos">No</label>
                </div>
              </div>
            </div>
            {isLegalRestrictions && <div className="text-center">
              <textarea className={`border-2 ${legalRestrictionDetailsError ? 'border-red-400' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`} id="restrictions" name="restrictions" autoCorrect="on" autoComplete="new-password" placeholder="Add details about restrictions" onChange={e => {
                setLegalRestrictionDetailsError(false)
                setLegalRestrictionDetails(e.target.value)
              }} />
              {legalRestrictionDetailsError && <p className="text-red-500">Provide details</p>}
            </div>}
          </div>

          {/*images */}
          <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
            {residentialLandImageFileError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
            <div className="flex flex-row gap-5">
              <div className="flex flex-row gap-0.5">
                <p className="h-4 text-2xl text-red-500">*</p>
                <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Add property image</label>
              </div>
              <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={residentialLandImageHandler} onClick={e => e.target.value = null} />
            </div>
            {residentialLandImageFile.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
              {residentialLandImageFile.map(image => {
                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                  <img className='relative w-auto h-60' src={image} alt="" />
                  <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                    const updatedState = residentialLandImageFile.filter(file => file !== image)
                    setResidentialLandImageFile(updatedState)
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