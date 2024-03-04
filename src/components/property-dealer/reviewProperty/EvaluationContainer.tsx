import React, { Fragment } from "react"
import { FaArrowDown, FaArrowUp, FaRupeeSign } from "react-icons/fa";
import { capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions";
import { EvaluationDataType } from "../../../dataTypes/evaluationDataType";

interface PropsType {
    evaluationData: EvaluationDataType
}

//This component is used to show customer messages to property dealer
const EvaluationContainer: React.FC<PropsType> = ({ evaluationData }) => {
    const {
        typeOfLocation,
        locationStatus,
        fairValueOfProperty,
        fiveYearProjectionOfPrices,
        conditionOfConstruction,
        qualityOfConstructionRating
    } = evaluationData

    return (
        <Fragment>
            <div className="py-8  w-full">
                <p className="text-xl font-semibold text-gray-800 mb-5">The property has been evaluated by our property evaluator</p>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="bg-red-500 w-40 sm:w-72"></th>
                            <th className="text-center"></th>
                        </tr>
                    </thead>
                    <tbody >
                        {typeOfLocation && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Location type</td>
                            <td className="py-3 text-gray-600 text-center">{capitalizeFirstLetterOfAString(typeOfLocation)}</td>
                        </tr>}
                        {locationStatus && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Location status</td>
                            <td className="py-3 text-gray-600 text-center">{capitalizeFirstLetterOfAString(locationStatus)}</td>
                        </tr>}
                        {conditionOfConstruction && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800 ">Condition of construction</td>
                            <td className="py-3 text-gray-600 text-center">{capitalizeFirstLetterOfAString(conditionOfConstruction)}</td>
                        </tr>}
                        {qualityOfConstructionRating && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800 ">Quality of construction</td>
                            <td className="py-3 text-gray-600 text-center">  {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`text-2xl -mt-1 ${star <= (qualityOfConstructionRating) ? 'text-green-600' : 'text-gray-400'}`}
                                >
                                    &#9733;
                                </span>
                            ))}</td>
                        </tr>}
                        {fairValueOfProperty && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Fair value of property</td>
                            <td className="py-3 text-gray-600 flex justify-center">
                                <div className="flex flex-row gap-1">
                                    <FaRupeeSign className="mt-1"/>
                                    {fairValueOfProperty.toLocaleString('en-IN')}
                                </div>
                            </td>
                        </tr>}
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Projected change in prices in five years</td>
                            <td className="py-3 text-gray-600 text-center flex flex-row place-content-center gap-1">
                                <p>{fiveYearProjectionOfPrices?.percentageIncreaseOrDecrease}% </p>{fiveYearProjectionOfPrices?.increase ? <FaArrowUp className="mt-1 text-green-600 text-lg" /> : <FaArrowDown className="mt-1 text-red-500 text-lg" />}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </Fragment >
    )
}
export default EvaluationContainer