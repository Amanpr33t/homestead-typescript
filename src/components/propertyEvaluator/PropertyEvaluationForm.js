import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from '../AlertModal'
import Spinner from "../Spinner"
import { countWordsInAString } from "../../utils/stringUtilityFunctions"

//This component is a form used to evaluate a property
function PropertyEvaluationForm(props) {
    const navigate = useNavigate()
    const {
        propertyType,
        propertyId,
        propertyEvaluatorId,
        fieldAgentId,
        residentialPropertyType,
        hideEvaluationForm,
        isBuiltUpProperty,
        numberOfReevaluationsReceived,
        showEvaluationForm
    } = props
    const authToken = localStorage.getItem("homestead-property-evaluator-authToken")

    const [spinner, setSpinner] = useState(false)

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    //const [isInformationComplete, setIsInformationComplete] = useState(null)
    /*const [isInformationCompleteError, setIsInformationCompleteError] = useState(false)
    const [isInformationInCompleteDetails, setIsInformationInCompleteDetails] = useState('')
    const [isInformationInCompleteDetailsArray, setIsInformationInCompleteDetailsArray] = useState([])
    const [isInformationInCompleteDetailsError, setIsInformationInCompleteDetailsError] = useState(false)*/

    let incompleteInformationDetailsIndex = 1
    const [isInformationComplete, setIsInformationComplete] = useState(null) //State is used to tell whether photograhs are upto standard
    const [incompleteInformationDetail, setIncompleteInformationDetail] = useState('') //detail of incomplete information
    const [incompleteInformationDetailsArray, setIncompleteInformationDetailsArray] = useState([])//An array that stores information about incomplete details
    const [incompleteInformationDetailsError, setInfromationIncompleteDetailsError] = useState(false)
    const [isInformationCompleteError, setIsInformationCompleteError] = useState(false) //State is set to true if isInformationComplete state is null, otherwise is set to false

    //const [arePhotographsInCompleteDetails, setArePhotographsInCompleteDetails] = useState('') //Details about incomplete photograph information
    //const [arePhotographsInCompleteDetailsError, setArePhotographsInCompleteDetailsError] = useState(false) //Is set to true if no details are provided, otherwise is set to false
    //const [arePhotographsInCompleteDetailsMoreThanFiveHundredWordError, setArePhotographsInCompleteDetailsMoreThanFiveHundredWordError] = useState(false) //Is set to true if details about incomplete information is less than 500 words

    const [typeOfLocation, setTypeOfLocation] = useState(null) //stores th type of location
    const [typeOfLocationError, setTypeOfLocationError] = useState(false) //set to true if type of location is not selected
    const typesOfLocationArray = ['Rural', 'Sub-urban', 'Urban', 'Mixed-use', 'Industrial'] //option for type of location

    const [locationStatus, setLocationStatus] = useState(null) //stores location of status
    const [locationStatusError, setLocationStatusError] = useState(false) //set to true if location status is null, otherwise is set to true
    const typesOfPropertyStatusArray = ['Posh', 'Premium', 'Popular', 'Ordinary', 'Low Income'] //options for property status


    const [conditionOfConstruction, setConditionOfConstruction] = useState(null) //condition of constucted property
    const [conditionOfConstructionError, setConditionOfConstructionError] = useState(false) //Is set to true if conditionOfConstruction state is null, otherwise is set to false
    const conditionOfConstructionArray = ['Newly built', 'Ready to move', 'Needs renovation', 'Needs repair'] //Options for construction of property

    const [qualityOfConstructionRating, setQualityOfConstructionRating] = useState(null) //Rating for quality of construction
    const [qualityOfConstructionRatingError, setQualityOfConstructionRatingError] = useState(false) //Is set to true if qualityOfConstructionRating state is null, otherwise is set to false

    const [fairValueOfProperty, setFairValueOfProperty] = useState('') //Fair value of property in number
    const [fairValueOfPropertyError, setFairValueOfPropertyError] = useState(false) //Is set to true if fairValueOfProperty state is not provided, otherwise is set to false

    const [fiveYearProjectionPriceIncrease, setFiveYearProjectionPriceIncrease] = useState(null) //Is true if prices are projected to increase, otherwise set to false
    const [fiveYearProjectionPercentageNumber, setFiveYearProjectionPercentageNumber] = useState('') //A number which tells percentage increase or decrease in prices
    const [fiveYearProjectionError, setFiveYearProjectionError] = useState(false) //Is true if fiveYearProjectionPriceIncrease state is null, otherwise is false
    const [fiveYearProjectionPercentageNumberError, setFiveYearProjectionPercentageNumberError] = useState(false) //Is false if fiveYearProjectionPercentageNumber state is empty, otherwise is false

    //This function triggers different errors if the user does not provide suitable data.
    const errorCheckingBeforeSubmitForCompleteForm = () => {

        if (!typeOfLocation) {
            setTypeOfLocationError(true)
        }

        if (!locationStatus) {
            setLocationStatusError(true)
        }

        if (propertyType !== 'agricultural' &&
            ((propertyType === 'residential' && residentialPropertyType !== 'plot') || (propertyType === 'commercial' && isBuiltUpProperty)) &&
            !qualityOfConstructionRating) {
            setQualityOfConstructionRatingError(true)
        }

        if (propertyType !== 'agricultural' &&
            ((propertyType === 'residential' && residentialPropertyType !== 'plot') || (propertyType === 'commercial' && isBuiltUpProperty)) && !conditionOfConstruction) {
            setConditionOfConstructionError(true)
        }

        if (!fairValueOfProperty) {
            setFairValueOfPropertyError(true)
        }

        if (fiveYearProjectionPriceIncrease === null) {
            setFiveYearProjectionError(true)
        } else if (fiveYearProjectionPriceIncrease !== null && !fiveYearProjectionPercentageNumber.trim()) {
            setFiveYearProjectionPercentageNumberError(true)
        }
    }

    //This function is triggered when the details are complete and the user submits the form
    const completeDetailsFormSubmit = async () => {
        //This function is triggered when the user does not provide suitable data
        const errorFunction = () => {
            errorCheckingBeforeSubmitForCompleteForm()
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields',
                routeTo: null
            })
            return
        }

        //the if statements below are triggered if the user does not provide suitable data

        if (!typeOfLocation) {
            return errorFunction()
        }

        if (!locationStatus) {
            return errorFunction()
        }

        if (propertyType !== 'agricultural' &&
            ((propertyType === 'residential' && residentialPropertyType !== 'plot') || (propertyType === 'commercial' && isBuiltUpProperty)) && !conditionOfConstruction) {
            return errorFunction()
        }

        if (propertyType !== 'agricultural' &&
            ((propertyType === 'residential' && residentialPropertyType !== 'plot') || (propertyType === 'commercial' && isBuiltUpProperty)) &&
            !qualityOfConstructionRating) {
            return errorFunction()
        }

        if (!fairValueOfProperty) {
            return errorFunction()
        }

        if (fiveYearProjectionPriceIncrease === null) {
            return errorFunction()
        } else if (fiveYearProjectionPriceIncrease !== null && !fiveYearProjectionPercentageNumber) {
            return errorFunction()
        }

        /*const commonEvaluationData = {
            information: {
                isInformationComplete: true,
                details: ''
            },
            photographs: {
                isInformationComplete: true,
                details: ''
            },
            typeOfLocation,
            locationStatus,
            fairValueOfProperty: +fairValueOfProperty,
            fiveYearProjectionOfPrices: {
                increase: fiveYearProjectionPriceIncrease === true || false,
                decrease: fiveYearProjectionPriceIncrease === false || false,
                percentageIncreaseOrDecrease: fiveYearProjectionPercentageNumber
            }
        }

        let builtupResidentialAndIndustrialPropertySpecificData
        if ((propertyType === 'residential' && residentialPropertyType !== 'plot') || (propertyType === 'commercial' && isBuiltUpProperty)) {
            builtupResidentialAndIndustrialPropertySpecificData = {
                conditionOfConstruction,
                qualityOfConstructionRating
            }
        }

        let finalEvaluationData

        if (propertyType === 'agricultural') {
            finalEvaluationData = commonEvaluationData
        } else if (propertyType === 'residential') {
            if (residentialPropertyType !== 'plot') {
                finalEvaluationData = {
                    ...commonEvaluationData,
                    ...builtupResidentialAndIndustrialPropertySpecificData
                }
            } else {
                finalEvaluationData = commonEvaluationData
            }
        } else if (propertyType === 'commercial') {
            if (isBuiltUpProperty) {
                finalEvaluationData = {
                    ...commonEvaluationData,
                    ...builtupResidentialAndIndustrialPropertySpecificData
                }
            } else {
                finalEvaluationData = commonEvaluationData
            }
        }*/

        const finalEvaluationData = {
            inCompleteInformationDetails: null,
            typeOfLocation,
            locationStatus,
            fairValueOfProperty: +fairValueOfProperty,
            fiveYearProjectionOfPrices: {
                increase: fiveYearProjectionPriceIncrease === true || false,
                decrease: fiveYearProjectionPriceIncrease === false || false,
                percentageIncreaseOrDecrease: fiveYearProjectionPercentageNumber
            },
            conditionOfConstruction,
            qualityOfConstructionRating,
            evaluatedAt: Date.now()
        }
        console.log(finalEvaluationData)

        /*try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/successful-evaluation-of-data?propertyType=${propertyType}&propertyId=${propertyId}&evaluatorId=${propertyEvaluatorId}&fieldAgentId=${fieldAgentId}`, {
                method: 'POST',
                body: JSON.stringify(finalEvaluationData),
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
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'Property evaluation data updated successfully',
                    routeTo: '/property-evaluator'
                })
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-evaluator-authToken")
                navigate('/property-evaluator/signIn', { replace: true })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
            return
        }*/

    }

    //This function triggers different errors if the user does not provide suitable data.
    const errorCheckingBeforeSubmitForInCompleteForm = () => {
        if (isInformationComplete === null) {
            setIsInformationCompleteError(true)
        } else if (!isInformationComplete && !incompleteInformationDetailsArray.length) {
            setInfromationIncompleteDetailsError(true)
        }
    }

    //This function is triggered when the details are incomplete and the user submits the form
    const incompleteDetailsFormSubmit = async () => {
        const errorFunction = () => {
            errorCheckingBeforeSubmitForInCompleteForm()
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields',
                routeTo: null
            })
            return
        }

        if (isInformationComplete === null) {
            return errorFunction()
        } else if (!isInformationComplete && !incompleteInformationDetailsArray.length) {
            return errorFunction()
        }

        let inCompleteInformationDetails = []
        incompleteInformationDetailsArray.forEach(detail => inCompleteInformationDetails.push(detail.incompleteInformationDetail))

        const evaluationData = {
            inCompleteInformationDetails,
            typeOfLocation: null,
            locationStatus: null,
            fairValueOfProperty: null,
            fiveYearProjectionOfPrices: {
                increase: null,
                decrease: null,
                percentageIncreaseOrDecrease: null
            },
            conditionOfConstruction: null,
            qualityOfConstructionRating: null,
            evaluatedAt: new Date()
        }
        console.log(evaluationData)

        /*try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/property-evaluation-data-update?propertyType=${propertyType}&propertyId=${propertyId}&evaluatorId=${propertyEvaluatorId}&fieldAgentId=${fieldAgentId}&numberOfReevaluationsReceived=${numberOfReevaluationsReceived}`, {
                method: 'POST',
                body: JSON.stringify(evaluationData),
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
                setAlert({
                    isAlertModal: true,
                    alertType: 'success',
                    alertMessage: 'Property evaluation data updated successfully',
                    routeTo: '/property-evaluator'
                })
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-evaluator-authToken")
                navigate('/property-evaluator/signIn', { replace: true })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
            return
        }*/


    }

    return (
        <Fragment>
            {spinner && <Spinner />}

            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}

            <div className={`z-40 w-full h-full max-h-screen fixed top-0 pt-24 pb-10  bg-transparent flex justify-center ${showEvaluationForm ? '' : 'left-full'} ${alert.isAlertModal || spinner ? 'blur' : ''} `} onClick={hideEvaluationForm}>
                <div className="relative w-10/12 sm:w-9/12 md:w-7/12 h-fit max-h-full bg-gray-100 rounded-md overflow-y-auto flex flex-col place-items-center pl-2 pr-2 md:pl-0 md:pr-0" onClick={e => e.stopPropagation()}>
                    <div className="absolute -top-1.5 right-0">
                        <button className="text-2xl font-bold p-1 text-gray-600" onClick={hideEvaluationForm}>X</button>
                    </div>
                    <div className="w-full mt-8 mb-4">
                        <p className="text-2xl font-semibold text-center ">Property Evaluation Form</p>
                    </div>
                    <form className=" h-fit  flex flex-col rounded" >

                        <div className="p-2  flex flex-col  pb-5 pt-5">
                            {isInformationCompleteError && <p className="text-red-500 w-full text-left">Select an option</p>}

                            {/*Is information complete?*/}
                            <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                                <div className="flex flex-row gap-0.5 w-24 sm:w-fit">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Is the information complete ?</p>
                                </div>
                                <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                    <div className="flex flex-row h-fit">
                                        <input className="mr-1 cursor-pointer" type="radio" id="yes" name="photograph" value="yes" onChange={e => {
                                            setIsInformationCompleteError(false)
                                            if (e.target.checked) {
                                                setIsInformationComplete(true)
                                            }
                                        }} />
                                        <label htmlFor="yes">Yes</label>
                                    </div>

                                    <div className="flex flex-row h-fit">
                                        <input className=" mr-1 cursor-pointer" type="radio" id="no" name="photograph" value="no" onChange={e => {
                                            setIsInformationCompleteError(false)
                                            if (e.target.checked) {
                                                setIsInformationComplete(false)
                                            }
                                        }} />
                                        <label htmlFor="no">No</label>
                                    </div>
                                </div>
                            </div>

                            {isInformationComplete === false &&
                                <div className="w-full flex justify-center"> 
                                    <div className="w-96">
                                        {incompleteInformationDetailsArray.length > 0 && <div className="bg-white px-2 py-3 ">
                                            {incompleteInformationDetailsArray.map(details => {
                                                return <div className="flex flex-row border-b py-1">
                                                    <div className="w-full flex flex-row gap-2">
                                                        <p className="text-lg font-semibold">{incompleteInformationDetailsIndex++}.</p>
                                                        <p className="pt-0.5 text-left">{details.incompleteInformationDetail}</p>
                                                    </div>
                                                    <button type='button' className="text-red-500 text-xl px-2 font-bold" onClick={() => {
                                                        const filteredArray = incompleteInformationDetailsArray.filter(item => item.index !== details.index)
                                                        setIncompleteInformationDetailsArray(filteredArray)
                                                    }}>X</button>
                                                </div>
                                            })}
                                        </div>}
                                        <div className="flex flex-row">
                                            <textarea id="incomplete-data-details" className="resize-none h-20 w-full border-2 border-gray-400 px-2 py-0.5" name="incomplete-data-details" autoCorrect="on" autoComplete="new-password" placeholder="Add details about incomplete information" value={incompleteInformationDetail} onChange={e => {
                                                setIncompleteInformationDetail(e.target.value)
                                            }} />
                                            <button type='button' className="bg-blue-500 text-xl px-2 font-bold text-white" onClick={() => {
                                                if (incompleteInformationDetail.trim()) {
                                                    setIncompleteInformationDetailsArray(array => [...array, {
                                                        index: array.length,
                                                        incompleteInformationDetail
                                                    }])
                                                    setIncompleteInformationDetail('')
                                                    setInfromationIncompleteDetailsError(false)
                                                }
                                            }}>+</button>
                                        </div>
                                        {incompleteInformationDetailsError && <p className="text-red-500">Provide details</p>}
                                    </div>
                                </div>}
                        </div>

                        {isInformationComplete && <>
                            {/*type of location*/}
                            <div className="p-2  flex flex-col pb-5 pt-5 ">
                                {(typeOfLocationError) && <p className="text-red-500">Select an option</p>}
                                <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                                    <div className="flex flex-row gap-0.5 w-24 sm:w-fit">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Type of location</p>
                                    </div>
                                    <div className="flex flex-col gap-1 pt-1 pr-4 sm:pr-0">
                                        {typesOfLocationArray.map(type => {
                                            return <div key={type} className="flex flex-row h-fit">
                                                <input className="mr-1 cursor-pointer" type="radio" id={type} name="type-of-location" value={type} onChange={e => {
                                                    setTypeOfLocationError(false)
                                                    if (e.target.checked) {
                                                        setTypeOfLocation(e.target.value)
                                                    }
                                                }} />
                                                <label htmlFor={type}>{type}</label>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/*property status */}
                            <div className="p-2  flex flex-col pb-5 pt-5">
                                {locationStatusError && <p className="text-red-500">Select an option</p>}
                                <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                                    <div className="flex flex-row gap-0.5 w-24 sm:w-fit">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Location status</p>
                                    </div>
                                    <div className="flex flex-col gap-1 pt-1 pr-4 sm:pr-0">
                                        {typesOfPropertyStatusArray.map(type => {
                                            return <div key={type} className="flex flex-row h-fit">
                                                <input className="mr-1 cursor-pointer" type="radio" id={type} name="property-status" value={type} onChange={e => {
                                                    setLocationStatusError(false)
                                                    if (e.target.checked) {
                                                        setLocationStatus(e.target.value)
                                                    }
                                                }} />
                                                <label htmlFor={type}>{type}</label>
                                            </div>
                                        })}

                                    </div>
                                </div>

                            </div>

                            {/*condition of construction*/}
                            {propertyType !== 'agricultural' &&
                                ((propertyType === 'residential' && residentialPropertyType !== 'plot') ||
                                    (propertyType === 'commercial' && isBuiltUpProperty)) &&
                                <div className="p-2  flex flex-col pb-5 pt-5">
                                    {conditionOfConstructionError && <p className="text-red-500">Select an option</p>}
                                    <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                                        <div className="flex flex-row gap-0.5 w-24 sm:w-fit">
                                            <p className="h-4 text-2xl text-red-500">*</p>
                                            <p className="text-xl font-semibold text-gray-500 mb-2">Condtion of construction</p>
                                        </div>
                                        <div className="flex flex-col gap-1 pt-1 pr-4 sm:pr-0">
                                            {conditionOfConstructionArray.map(type => {
                                                return <div key={type} className="flex flex-row h-fit">
                                                    <input className="mr-1 cursor-pointer" type="radio" id={type} name="condition-of-construction" value={type} onChange={e => {
                                                        setConditionOfConstructionError(false)
                                                        if (e.target.checked) {
                                                            setConditionOfConstruction(e.target.value)
                                                        }
                                                    }} />
                                                    <label htmlFor={type}>{type}</label>
                                                </div>
                                            })}

                                        </div>
                                    </div>
                                </div>}

                            {/*quality of construction rating */}
                            {propertyType !== 'agricultural' &&
                                ((propertyType === 'residential' && residentialPropertyType !== 'plot') ||
                                    (propertyType === 'commercial' && isBuiltUpProperty)) &&
                                <div className="p-2  flex flex-col pb-5 pt-5">
                                    {qualityOfConstructionRatingError && <p className="text-red-500">Select a rating</p>}
                                    <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                                        <div className="flex flex-row gap-0.5 w-24 sm:w-fit">
                                            <p className="h-4 text-2xl text-red-500">*</p>
                                            <p className="text-xl font-semibold text-gray-500 mb-2">Quality of construction</p>
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className={`cursor-pointer text-2xl -mt-1 ${star <= qualityOfConstructionRating ? 'text-red-600' : 'text-gray-400'}`} onClick={() => {
                                                    setQualityOfConstructionRatingError(false)
                                                    setQualityOfConstructionRating(star)
                                                }}>
                                                    &#9733;
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>}

                            {/*fair value of property*/}
                            <div className="flex flex-col p-2 pb-5 pt-5 ">
                                {fairValueOfPropertyError && <p className="text-red-500 -mt-1">Provide a price</p>}
                                <div className="flex flex-row gap-5 sm:gap-16">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="fair-value">Fair value (Rs)</label>
                                    </div>

                                    <input id="fair-value" type="number" min="0" name='fair-value' className={`border-2 ${fairValueOfPropertyError ? 'border-red-400' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-40`} value={fairValueOfProperty} onChange={e => {
                                        if (+e.target.value.trim() > 0) {
                                            setFairValueOfPropertyError(false)
                                            setFairValueOfProperty(+e.target.value.trim())
                                        } else {
                                            setFairValueOfProperty('')
                                        }
                                    }} />
                                </div>
                            </div>

                            {/*five year projection*/}
                            <div className="p-2 flex flex-col pb-5 pt-5">
                                {fiveYearProjectionError && <p className="text-red-500">Select an option</p>}
                                <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                                    <div className="flex flex-row gap-0.5 w-24 sm:w-fit">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Five year projection of property</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                        <div className="flex flex-row h-fit">
                                            <input className="mr-1 cursor-pointer" type="radio" id="increase" name="five-year-projection" onChange={e => {
                                                setFiveYearProjectionError(false)
                                                if (e.target.checked) {
                                                    setFiveYearProjectionPriceIncrease(true)
                                                    setFiveYearProjectionPercentageNumber('')
                                                    setFiveYearProjectionError(false)
                                                    setFiveYearProjectionPercentageNumberError(false)
                                                }
                                            }} />
                                            <label htmlFor="increase">Prices might increase</label>
                                        </div>

                                        <div className="flex flex-row h-fit">
                                            <input className=" mr-1 cursor-pointer" type="radio" id="decrease" name="five-year-projection" onChange={e => {
                                                setFiveYearProjectionError(false)
                                                if (e.target.checked) {
                                                    setFiveYearProjectionPriceIncrease(false)
                                                    setFiveYearProjectionPercentageNumber('')
                                                    setFiveYearProjectionError(false)
                                                    setFiveYearProjectionPercentageNumberError(false)
                                                }
                                            }} />
                                            <label htmlFor="decrease">Prices might decrease</label>
                                        </div>
                                    </div>
                                </div>
                                {fiveYearProjectionPriceIncrease !== null &&
                                    <>
                                        {fiveYearProjectionPercentageNumberError && <p className="text-red-500">Provide a percentage</p>}
                                        <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
                                            <div className="flex flex-row gap-0.5">
                                                <p className="h-4 text-2xl text-red-500">*</p>
                                                <p className="text-xl font-semibold text-gray-500 mb-2">{fiveYearProjectionPriceIncrease ? "Percentage increase in price" : "Percentage decrease in price"}</p>
                                            </div>
                                            <div className="flex flex-row gap-1 pt-1 pr-4 sm:pr-0">
                                                <input id="projection-percentage" type="number" name='projection-percentage' className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-20 text-center h-fit`} value={fiveYearProjectionPercentageNumber} onChange={e => {
                                                    if (+e.target.value.trim() === 0) {
                                                        setFiveYearProjectionPercentageNumber('')
                                                    } else if (+e.target.value.trim() >= 0 && +e.target.value.trim() <= 100) {
                                                        setFiveYearProjectionError(false)
                                                        setFiveYearProjectionPercentageNumber(+e.target.value.trim())
                                                        setFiveYearProjectionPercentageNumberError(false)
                                                    }
                                                }} />
                                                <p className="text-lg font-semibold">%</p>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>

                        </>
                        }
                    </form>

                    {!alert.isAlertModal &&
                        <div className="flex justify-center mb-4 p-2 ">
                            <button type='submit' className="text-lg bg-blue-500 text-white font-medium rounded pl-4 pr-4 pt-0.5 h-8" onClick={(e) => {
                                e.preventDefault()
                                if (isInformationComplete) {
                                    return completeDetailsFormSubmit()
                                }
                                incompleteDetailsFormSubmit()
                            }}>Save evaluation data</button>
                        </div>}
                </div>
            </div >
        </Fragment >
    )
}
export default PropertyEvaluationForm