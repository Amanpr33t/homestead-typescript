import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from '../AlertModal'
import Spinner from "../Spinner"
import { countWordsInAString } from "../../utils/stringUtilityFunctions"

//This component is a form used by a field agent to add an agricultural property
function PropertyEvaluationForm(props) {
    const navigate = useNavigate()
    const { propertyType, propertyId, propertyEvaluatorId, fieldAgentId, residentialPropertyType, hideEvaluationForm, isBuiltUpProperty, numberOfReevaluationsReceived } = props
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

    const [arePhotographsComplete, setArePhotographsComplete] = useState(null)
    const [arePhotographsCompleteError, setArePhotographsCompleteError] = useState(false)
    const [arePhotographsInCompleteDetails, setArePhotographsInCompleteDetails] = useState('')
    const [arePhotographsInCompleteDetailsError, setArePhotographsInCompleteDetailsError] = useState(false)
    const [arePhotographsInCompleteDetailsMoreThanFiveHundredWordError, setArePhotographsInCompleteDetailsMoreThanFiveHundredWordError] = useState(false)

    const [typeOfLocation, setTypeOfLocation] = useState(null)
    const [typeOfLocationError, setTypeOfLocationError] = useState(false)
    const typesOfLocationArray = ['Rural', 'Sub-urban', 'Urban', 'Mixed-use', 'Industrial']

    const [locationStatus, setLocationStatus] = useState(null)
    const [locationStatusError, setLocationStatusError] = useState(false)
    const typesOfPropertyStatusArray = ['Posh', 'Premium', 'Popular', 'Ordinary', 'Low Income']


    const [conditionOfConstruction, setConditionOfConstruction] = useState(null)
    const [conditionOfConstructionError, setConditionOfConstructionError] = useState(false)
    const conditionOfConstructionArray = ['Newly built', 'Ready to move', 'Needs renovation', 'Needs repair']

    const [qualityOfConstructionRating, setQualityOfConstructionRating] = useState(null)
    const [qualityOfConstructionRatingError, setQualityOfConstructionRatingError] = useState(false)

    const [fairValueOfProperty, setFairValueOfProperty] = useState('')
    const [fairValueOfPropertyError, setFairValueOfPropertyError] = useState(false)

    const [fiveYearProjectionPriceIncrease, setFiveYearProjectionPriceIncrease] = useState(null)
    const [fiveYearProjectionPercentageNumber, setFiveYearProjectionPercentageNumber] = useState('')
    const [fiveYearProjectionError, setFiveYearProjectionError] = useState(false)
    const [fiveYearProjectionPercentageNumberError, setFiveYearProjectionPercentageNumberError] = useState(false)

    //This function triggers different errors if the user does not provide suitable data
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

    //this function is triggered when the user submits the form
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
                arePhotographsComplete: true,
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
            photographs: {
                arePhotographsComplete: true,
                details: ''
            },
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

        try {
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
        }

    }

    const errorCheckingBeforeSubmitForInCompleteForm = () => {
        if (arePhotographsComplete === null) {
            setArePhotographsCompleteError(true)
        } else if (!arePhotographsComplete && !arePhotographsInCompleteDetails.trim()) {
            setArePhotographsInCompleteDetailsError(true)
        }
    }

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

        if (arePhotographsComplete === null) {
            return errorFunction()
        } else if (!arePhotographsComplete && !arePhotographsInCompleteDetails.trim()) {
            return errorFunction()
        }

        const evaluationData = {
            photographs: {
                arePhotographsComplete,
                details: arePhotographsInCompleteDetails.trim()
            },
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
            evaluatedAt: Date.now()
        }

        try {
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
        }


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

            <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-30 bg-white sm:bg-transparent'>
                <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 mr-2 h-8" onClick={hideEvaluationForm}>Back</button>
                <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/property-evaluator', { replace: true })}>Home</button>
            </div>

            <div className={`pl-2 pr-2 h-fit  mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center ${alert.isAlertModal || spinner ? 'blur' : ''} `} >
                <div className="w-full mt-32 bg-white mb-4">
                    <p className="text-2xl font-bold text-center">Evaluate {propertyType} property</p>
                </div>
                <form className="w-full  md:w-10/12 lg:w-8/12  h-fit  flex flex-col rounded border-2 border-gray-200 shadow" >


                    {/*photographs complete*/}
                    <div className="p-2  flex flex-col pb-5 pt-5 ">
                        {arePhotographsCompleteError && <p className="text-red-500">Select an option</p>}
                        <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                            <div className="flex flex-row gap-0.5 w-24 sm:w-fit">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500 mb-2">Are the photographs complete</p>
                            </div>
                            <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                <div className="flex flex-row h-fit">
                                    <input className="mr-1 cursor-pointer" type="radio" id="yes" name="photograph" value="yes" onChange={e => {
                                        setArePhotographsInCompleteDetails('')
                                        setArePhotographsInCompleteDetailsError(false)
                                        setArePhotographsCompleteError(false)
                                        if (e.target.checked) {
                                            setArePhotographsComplete(true)
                                        }
                                    }} />
                                    <label htmlFor="yes">Yes</label>
                                </div>

                                <div className="flex flex-row h-fit">
                                    <input className=" mr-1 cursor-pointer" type="radio" id="no" name="photograph" value="no" onChange={e => {
                                        setArePhotographsInCompleteDetails('')
                                        setArePhotographsInCompleteDetailsError(false)
                                        setArePhotographsCompleteError(false)
                                        if (e.target.checked) {
                                            setArePhotographsComplete(false)
                                        }
                                    }} />
                                    <label htmlFor="no">No</label>
                                </div>
                            </div>
                        </div>
                        {arePhotographsComplete === false && <div className="text-center">
                            <textarea className={`border-2 ${arePhotographsInCompleteDetailsError || arePhotographsInCompleteDetailsMoreThanFiveHundredWordError ? 'border-red-400' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`} id="photograph" name="photograph" autoCorrect="on" autoComplete="new-password" placeholder="Add details about incomplete information" value={arePhotographsInCompleteDetails} onChange={e => {
                                setArePhotographsInCompleteDetailsError(false)
                                if (countWordsInAString(e.target.value.trim()) > 500) {
                                    setArePhotographsInCompleteDetailsMoreThanFiveHundredWordError(true)
                                    setArePhotographsInCompleteDetails(e.target.value.trimEnd())
                                    return
                                }
                                setArePhotographsInCompleteDetailsError(false)
                                setArePhotographsInCompleteDetailsMoreThanFiveHundredWordError(false)
                                setArePhotographsInCompleteDetails(e.target.value)
                            }} />
                            {arePhotographsInCompleteDetailsError && <p className="text-red-500">Provide details</p>}
                            {arePhotographsInCompleteDetailsMoreThanFiveHundredWordError && <p className="text-red-500">Details cannot be more than 500 words</p>}
                        </div>}
                    </div>

                    {arePhotographsComplete && <>
                        {/*type of location*/}
                        <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
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
                            <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
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
                            <div className="p-2  flex flex-col pb-5 pt-5 ">
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
                        <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
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
                        <div className="p-2  flex flex-col pb-5 pt-5 ">
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

                    </>}

                </form>
                <div className="flex justify-center mt-4 p-2">
                    <button type='submit' className="text-lg bg-green-500 text-white font-medium rounded pl-4 pr-4 pt-0.5 h-8" onClick={(e) => {
                        e.preventDefault()
                        if (arePhotographsComplete) {
                            return completeDetailsFormSubmit()
                        }
                        incompleteDetailsFormSubmit()
                    }}>Save evaluation data</button>
                </div>
            </div >
        </Fragment >
    )
}
export default PropertyEvaluationForm