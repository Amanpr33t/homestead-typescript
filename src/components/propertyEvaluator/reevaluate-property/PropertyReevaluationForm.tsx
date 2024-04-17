import { ChangeEvent, Fragment, useEffect, useState } from "react"
import AlertModal from '../../AlertModal'
import { useNavigate } from "react-router-dom"
import { capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions"
import { FaEdit } from "react-icons/fa";
import { EvaluationDataType } from "../../../dataTypes/evaluationDataType";
import { AlertType } from "../../../dataTypes/alertType";
import { LocationType,LocationStatusType,ConstructionType } from "../../../dataTypes/evaluationDataType";

interface PropsType {
    showReevaluationForm: boolean,
    hideReevaluationForm: () => void,
    propertyType: 'agricultural' | 'residential' | 'commercial',
    propertyId: string,
    residentialPropertyType?: 'plot' | 'house' | 'flat' | null,
    isBuiltUpProperty?: boolean,
    oldEvaluationData: EvaluationDataType
}

//This component is a form used to evaluate a property
const PropertyReevaluationForm: React.FC<PropsType> = (props) => {
    const {
        showReevaluationForm,
        hideReevaluationForm,
        propertyType,
        propertyId,
        residentialPropertyType,
        isBuiltUpProperty,
        oldEvaluationData
    } = props

    const navigate = useNavigate()

    let index: number = 1//to show index numbers for details of incomplete information

    const authToken: string | null = localStorage.getItem("homestead-property-evaluator-authToken")

    const [alert, setAlert] = useState<AlertType>({
        isAlertModal: false,
        alertType: null,
        alertMessage: null,
        routeTo: null
    })
    const [spinner, setSpinner] = useState<boolean>(false)

    const [editForm, setEditForm] = useState<boolean>(false)

    const [isInformationComplete, setIsInformationComplete] = useState<boolean>(true)//tells whether the information is complete or not
    const [isInformationInCompleteDetails, setIsInformationInCompleteDetails] = useState<string[]>([])//an array that stores the details of incomplete information
    const [incompleteDetailItem, setIncompleteDetailItem] = useState<string>('')//a single detail item 
    const [isInformationInCompleteDetailsError, setIsInformationInCompleteDetailsError] = useState(false)//it is true if isInformationInCompleteDetails state is an empty array

    const [typeOfLocation, setTypeOfLocation] = useState<LocationType | null>(null) //stores th type of location
    const [typeOfLocationError, setTypeOfLocationError] = useState<boolean>(false) //set to true if type of location is not selected
    const typesOfLocationArray: LocationType[] = ['rural', 'sub-urban', 'urban', 'mixed-use', 'industrial'] //option for type of location

    const [locationStatus, setLocationStatus] = useState<LocationStatusType | null>(null) //stores location of status
    const [locationStatusError, setLocationStatusError] = useState<boolean>(false) //set to true if location status is null, otherwise is set to true
    const typesOfPropertyStatusArray: LocationStatusType[] = ['posh', 'premium', 'popular', 'ordinary', 'low income'] //options for property status

    const [conditionOfConstruction, setConditionOfConstruction] = useState<ConstructionType | null>(null) //condition of constucted property
    const [conditionOfConstructionError, setConditionOfConstructionError] = useState<boolean>(false) //Is set to true if conditionOfConstruction state is null, otherwise is set to false
    const conditionOfConstructionArray: ConstructionType[] = ['newly built', 'ready to move', 'needs renovation', 'needs repair'] //Options for construction of property

    const [qualityOfConstructionRating, setQualityOfConstructionRating] = useState<number | ''>('') //Rating for quality of construction
    const [qualityOfConstructionRatingError, setQualityOfConstructionRatingError] = useState<boolean>(false) //Is set to true if qualityOfConstructionRating state is null, otherwise is set to false

    const [fairValueOfProperty, setFairValueOfProperty] = useState<number | ''>('') //Fair value of property in number
    const [fairValueOfPropertyError, setFairValueOfPropertyError] = useState<boolean>(false) //Is set to true if fairValueOfProperty state is not provided, otherwise is set to false

    const [fiveYearProjectionPriceIncrease, setFiveYearProjectionPriceIncrease] = useState<boolean | null>(null) //Is true if prices are projected to increase, otherwise set to false
    const [fiveYearProjectionPercentageNumber, setFiveYearProjectionPercentageNumber] = useState<number | ''>('') //A number which tells percentage increase or decrease in prices
    const [fiveYearProjectionError, setFiveYearProjectionError] = useState<boolean>(false) //Is true if fiveYearProjectionPriceIncrease state is null, otherwise is false
    const [fiveYearProjectionPercentageNumberError, setFiveYearProjectionPercentageNumberError] = useState<boolean>(false) //Is false if fiveYearProjectionPercentageNumber state is empty, otherwise is false

    useEffect(() => {
        if (oldEvaluationData) {
            setTypeOfLocation(oldEvaluationData.typeOfLocation as LocationType)
            setLocationStatus(oldEvaluationData.locationStatus as LocationStatusType)
            setConditionOfConstruction(oldEvaluationData.conditionOfConstruction as ConstructionType)
            setQualityOfConstructionRating(oldEvaluationData.qualityOfConstructionRating as number)
            setFairValueOfProperty(oldEvaluationData.fairValueOfProperty as number)
            if (oldEvaluationData.fiveYearProjectionOfPrices) {
                setFiveYearProjectionPriceIncrease(oldEvaluationData.fiveYearProjectionOfPrices.increase)
            }
            if (oldEvaluationData.fiveYearProjectionOfPrices && oldEvaluationData.fiveYearProjectionOfPrices.percentageIncreaseOrDecrease) {
                setFiveYearProjectionPercentageNumber(oldEvaluationData.fiveYearProjectionOfPrices.percentageIncreaseOrDecrease)
            }
        }
    }, [oldEvaluationData])

    //The function is used to show error messages if all the data is not provided
    const errorChecking = () => {
        if (!isInformationComplete && !isInformationInCompleteDetails.length) {
            setIsInformationInCompleteDetailsError(true)
        }
        if (isInformationComplete) {
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
            } else if (fiveYearProjectionPriceIncrease !== null && !fiveYearProjectionPercentageNumber) {
                setFiveYearProjectionPercentageNumberError(true)
            }
        }
    }

    const formSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const errorFunction = () => {
            errorChecking()
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
        } else if (!isInformationComplete) {
            if (!isInformationInCompleteDetails.length) {
                return errorFunction()
            } else if (isInformationInCompleteDetails.length > 10) {
                return
            }
        } else if (isInformationComplete) {
            if (!typeOfLocation) {
                return errorFunction()
            }
            if (!locationStatus) {
                return errorFunction()
            }
            if (propertyType !== 'agricultural' &&
                ((propertyType === 'residential' && residentialPropertyType !== 'plot') || (propertyType === 'commercial' && isBuiltUpProperty)) &&
                !qualityOfConstructionRating) {
                return errorFunction()
            }
            if (propertyType !== 'agricultural' &&
                ((propertyType === 'residential' && residentialPropertyType !== 'plot') || (propertyType === 'commercial' && isBuiltUpProperty)) && !conditionOfConstruction) {
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
        }

        let evaluationData: EvaluationDataType
        if (isInformationComplete) {
            //if information provided by field agentis complete
            evaluationData = {
                typeOfLocation: typeOfLocation as LocationType,
                locationStatus: locationStatus as LocationStatusType,
                fairValueOfProperty: fairValueOfProperty as number,
                fiveYearProjectionOfPrices: {
                    increase: fiveYearProjectionPriceIncrease,
                    decrease: !fiveYearProjectionPriceIncrease,
                    percentageIncreaseOrDecrease: fiveYearProjectionPercentageNumber as number,
                },
                conditionOfConstruction: conditionOfConstruction as ConstructionType,
                qualityOfConstructionRating: qualityOfConstructionRating as number,
                evaluatedAt: new Date(),
            }
        } else {
            //information provided by field agent is incorrect
            evaluationData = {
                incompletePropertyDetails: isInformationInCompleteDetails
            }
        }

        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-evaluator/evaluateProperty?propertyType=${propertyType}&propertyId=${propertyId}&isInformationComplete=${isInformationComplete ? 'true' : 'false'}`, {
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
                    routeTo: '/property-evaluator/properties-pending-for-reevaluation'
                })
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-property-evaluator-authToken")
                return navigate('/user', { replace: true })
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured',
                routeTo: null
            })
            return
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
                            alertType: null,
                            alertMessage: null,
                            routeTo: null
                        })
                    }} />}

            <div className={` z-40 w-full h-screen fixed top-0  bg-transparent flex justify-center pt-24 pb-10 ${showReevaluationForm ? '' : 'left-full'} ${alert.isAlertModal ? 'blur' : ''} `} onClick={hideReevaluationForm}>

                <div className="relative h-fit max-h-full w-11/12 sm:w-9/12 md:w-7/12 bg-white rounded-md overflow-y-auto flex flex-col place-items-center px-2 md:px-0 pb-10" onClick={e => e.stopPropagation()}>

                    <div className="absolute -top-1 right-1 ">
                        {/*button to hide evaluation form*/}
                        <button className="text-3xl font-bold p-1 text-gray-600" onClick={hideReevaluationForm}>X</button>
                    </div>


                    <div className="w-full mt-3">
                        <p className="text-2xl font-semibold text-center ">Reevaluation form</p>
                    </div>

                    <form className="min-h-fit w-full flex flex-col rounded mt-2 px-2 md:px-10 sm:px-5" onSubmit={formSubmit}>

                        {!editForm && <div className="w-full flex justify-center ">
                            <FaEdit className="text-3xl text-orange-500 hover:text-orange-700 cursor-pointer font-bold" onClick={e => {
                                e.stopPropagation()
                                setEditForm(true)
                            }} />
                        </div>}

                        {/*two radio button to know whether the information is complete or not*/}
                        <div className="px-2 flex flex-col py-3">
                            {/*Radio buttons to know if the information is complete or not information complete?*/}
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 lg:gap-16">
                                <p className="text-xl font-semibold text-gray-500">Is the information complete ?</p>
                                <div className="flex flex-row place-content-center gap-4 pt-1 pr-4 sm:pr-0">
                                    <div className="flex flex-row h-fit">
                                        <input
                                            className="mr-1 cursor-pointer"
                                            type="radio"
                                            id="yes"
                                            disabled={editForm === false}
                                            name="photograph"
                                            checked={isInformationComplete === true}
                                            value="yes"
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                setIsInformationInCompleteDetails([])
                                                setIsInformationInCompleteDetailsError(false)
                                                setIncompleteDetailItem('')
                                                if (e.target.checked) {
                                                    setIsInformationComplete(true)
                                                }
                                            }} />
                                        <label htmlFor="yes">Yes</label>
                                    </div>

                                    <div className="flex flex-row h-fit">
                                        <input
                                            className=" mr-1 cursor-pointer"
                                            type="radio"
                                            id="no"
                                            disabled={editForm === false}
                                            name="photograph"
                                            checked={isInformationComplete === false}
                                            value="no"
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                setFairValueOfProperty('')
                                                setFiveYearProjectionPercentageNumber('')
                                                setTypeOfLocation(null)
                                                setLocationStatus(null)
                                                setQualityOfConstructionRating('')
                                                setFiveYearProjectionPriceIncrease(null)
                                                setConditionOfConstruction(null)

                                                //reset all error states
                                                setTypeOfLocationError(false)
                                                setLocationStatusError(false)
                                                setConditionOfConstructionError(false)
                                                setQualityOfConstructionRatingError(false)
                                                setFairValueOfPropertyError(false)
                                                setFiveYearProjectionPercentageNumberError(false)
                                                setFiveYearProjectionError(false)
                                                if (e.target.checked) {
                                                    setIsInformationComplete(false)
                                                }
                                            }} />
                                        <label htmlFor="no">No</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*This jsx is shown if the information is incomplete*/}
                        {isInformationComplete === false &&
                            <div className="px-2 flex flex-col">
                                {isInformationInCompleteDetailsError && <p className="text-red-500">Add details regarding incomplete information</p>}

                                <div className="flex flex-row w-full">
                                    <textarea
                                        className="w-full h-24 resize-none border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                                        placeholder="Add details here..."
                                        value={incompleteDetailItem}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                            setIsInformationInCompleteDetailsError(false)
                                            if (e.target.value.trim().length < 200) {
                                                setIncompleteDetailItem(e.target.value)
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="bg-green-500 hover:bg-green-600 text-4xl text-white font-semibold text-center px-2"
                                        onClick={() => {
                                            if (incompleteDetailItem.trim() && incompleteDetailItem.trim().length < 200 && isInformationInCompleteDetails.length < 10) {
                                                setIsInformationInCompleteDetails(array => [...array, incompleteDetailItem])
                                                setIncompleteDetailItem('')
                                            }
                                        }}>+</button>
                                </div>

                                <div className="flex flex-row place-content-center">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="">You can add a maximum of 10 detail points</p>
                                </div>

                                {isInformationInCompleteDetails.length > 0 && isInformationInCompleteDetails.map(detail => {
                                    let indexToRemove: number = index - 1
                                    return <div key={Math.random()} className="w-full flex flex-row place-content-between mt-2 bg-white">
                                        <div className="flex flex-row gap-2">
                                            <p className="font-semibold pl-1">{index++}.</p>
                                            <p>{detail}</p>
                                        </div>
                                        <div className="flex justify-center items-center h-full">
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white font-semibold text-xl h-fit px-2"
                                                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                    e.stopPropagation()
                                                    const filteredArray = isInformationInCompleteDetails.filter(item => item !== isInformationInCompleteDetails[indexToRemove])
                                                    setIsInformationInCompleteDetails(filteredArray)
                                                }}
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>

                                })}
                            </div>}

                        {/*This jsx is shown if the information is complete*/}
                        {isInformationComplete && <>
                            {/*type of location*/}
                            <div className="px-2 flex flex-col py-3 ">
                                {(typeOfLocationError) && <p className="text-red-500">Select an option</p>}
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 mb-2">
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Type of location</p>
                                    <div className="flex flex-col gap-1 pt-1 pr-4 sm:pr-0">
                                        {typesOfLocationArray.map(type => {
                                            return <div key={type} className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    disabled={editForm === false}
                                                    id={'location' + type}
                                                    name="type-of-location"
                                                    checked={type === typeOfLocation}
                                                    value={type}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        setTypeOfLocationError(false)
                                                        if (e.target.checked) {
                                                            setTypeOfLocation(e.target.value as LocationType)
                                                        }
                                                    }} />
                                                <label htmlFor={'location' + type}>{capitalizeFirstLetterOfAString(type)}</label>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/*property status */}
                            <div className="px-2 flex flex-col py-3">
                                {locationStatusError && <p className="text-red-500">Select an option</p>}
                                <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 mb-2">
                                    <p className="text-xl font-semibold text-gray-500 mb-2">Location status</p>
                                    <div className="flex flex-col gap-1 pt-1 pr-4 sm:pr-0">
                                        {typesOfPropertyStatusArray.map(type => {
                                            return <div key={type} className="flex flex-row h-fit">
                                                <input
                                                    className="mr-1 cursor-pointer"
                                                    type="radio"
                                                    disabled={editForm === false}
                                                    id={'status' + type}
                                                    checked={type === locationStatus}
                                                    name="property-status"
                                                    value={type}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        setLocationStatusError(false)
                                                        if (e.target.checked) {
                                                            setLocationStatus(e.target.value as LocationStatusType)
                                                        }
                                                    }} />
                                                <label htmlFor={'status' + type}>{capitalizeFirstLetterOfAString(type)}</label>
                                            </div>
                                        })}

                                    </div>
                                </div>

                            </div>

                            {/*condition of construction*/}
                            {propertyType !== 'agricultural' &&
                                ((propertyType === 'residential' && residentialPropertyType !== 'plot') ||
                                    (propertyType === 'commercial' && isBuiltUpProperty)) &&
                                <div className="px-2 flex flex-col py-3">
                                    {conditionOfConstructionError && <p className="text-red-500">Select an option</p>}
                                    <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Condtion of construction</p>
                                        <div className="flex flex-col gap-1 pt-1 pr-4 sm:pr-0">
                                            {conditionOfConstructionArray.map(type => {
                                                return <div key={type} className="flex flex-row h-fit">
                                                    <input
                                                        className="mr-1 cursor-pointer"
                                                        type="radio"
                                                        disabled={editForm === false}
                                                        id={'construction' + type}
                                                        checked={type === conditionOfConstruction}
                                                        name="condition-of-construction"
                                                        value={type}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            setConditionOfConstructionError(false)
                                                            if (e.target.checked) {
                                                                setConditionOfConstruction(e.target.value as ConstructionType)
                                                            }
                                                        }} />
                                                    <label htmlFor={'construction' + type}>{capitalizeFirstLetterOfAString(type)}</label>
                                                </div>
                                            })}

                                        </div>
                                    </div>
                                </div>}

                            {/*quality of construction rating */}
                            {propertyType !== 'agricultural' &&
                                ((propertyType === 'residential' && residentialPropertyType !== 'plot') ||
                                    (propertyType === 'commercial' && isBuiltUpProperty)) &&
                                <div className="px-2 flex flex-col py-3">
                                    {qualityOfConstructionRatingError && <p className="text-red-500">Select a rating</p>}
                                    <div className="flex flex-row gap-16 sm:gap-10 lg:gap-16 mb-2">
                                        <p className="text-xl font-semibold text-gray-500 mb-2">Quality of construction</p>
                                        <div className="flex flex-row gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`cursor-pointer text-2xl -mt-1 ${star <= (qualityOfConstructionRating as number) ? 'text-red-600' : 'text-gray-400'}`}
                                                    onClick={() => {
                                                        if (editForm) {
                                                            setQualityOfConstructionRatingError(false)
                                                            setQualityOfConstructionRating(star)
                                                        }
                                                    }}>
                                                    &#9733;
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>}

                            {/*fair value of property*/}
                            <div className="px-2 flex flex-col py-3 ">
                                {fairValueOfPropertyError && <p className="text-red-500 -mt-1">Provide a price</p>}
                                <div className="flex flex-row gap-5 sm:gap-16">
                                    <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="fair-value">Fair value (Rs)</label>

                                    <input
                                        id="fair-value"
                                        type="number"
                                        disabled={editForm === false}
                                        min="0"
                                        name='fair-value'
                                        className={`border-2 ${fairValueOfPropertyError ? 'border-red-400' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-40`}
                                        value={fairValueOfProperty}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
                            <div className="px-2 flex flex-col py-3">
                                {fiveYearProjectionError && <p className="text-red-500">Select an option</p>}
                                <div className="flex flex-col gap-2 ">
                                    <p className=" text-xl font-semibold text-gray-500 ">Five year projection of property prices</p>
                                    <div className="flex flex-col place-items-center gap-2">
                                        <div className="flex flex-row">
                                            <input
                                                className="mr-1 cursor-pointer"
                                                type="radio"
                                                disabled={editForm === false}
                                                id="increase"
                                                checked={fiveYearProjectionPriceIncrease === true}
                                                name="five-year-projection"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
                                        <div className="flex flex-row">
                                            <input
                                                className=" mr-1 cursor-pointer"
                                                type="radio"
                                                disabled={editForm === false}
                                                id="decrease"
                                                checked={fiveYearProjectionPriceIncrease === false}
                                                name="five-year-projection"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
                            </div>

                            {/*input element to get percentage number*/}
                            {fiveYearProjectionPriceIncrease !== null &&
                                <div className="px-2 flex flex-col py-3">
                                    {fiveYearProjectionPercentageNumberError && <p className="text-red-500">Provide a percentage</p>}
                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 lg:gap-16">
                                        <p className="text-xl font-semibold text-gray-500">{fiveYearProjectionPriceIncrease ? "Percentage increase in price" : "Percentage decrease in price"}</p>
                                        <div className="flex flex-row place-content-center gap-1 pt-1 pr-4 sm:pr-0">
                                            <input
                                                id="projection-percentage"
                                                type="number"
                                                disabled={editForm === false}
                                                name='projection-percentage'
                                                className={`border-2 border-gray-400 pl-1 pr-1 rounded bg-white w-20 text-center h-fit`}
                                                value={fiveYearProjectionPercentageNumber}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
                                </div>}

                        </>}


                        {editForm &&
                            <div className="w-full h-12 flex justify-center mt-7 px-2">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1 cursor-pointer"
                                    disabled={spinner || alert.isAlertModal}>
                                    {spinner ? (
                                        <div className="spinner absolute border-t-4 border-white border-solid rounded-full h-6 w-6 animate-spin"></div>
                                    ) : (
                                        'Save reevaluated data'
                                    )}
                                </button>
                            </div>}
                    </form>
                </div>
            </div >
        </Fragment >
    )
}
export default PropertyReevaluationForm