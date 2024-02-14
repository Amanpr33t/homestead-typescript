import { Fragment } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"

interface EvaluationDataType {
    areDetailsComplete?: boolean,
    incompletePropertyDetails?: string | null,
    typeOfLocation?: string | null,
    locationStatus?: string | null,
    fairValueOfProperty?: number | null,
    fiveYearProjectionOfPrices?: {
        increase?: boolean | null,
        decrease?: boolean | null,
        percentageIncreaseOrDecrease?: number | null,
    },
    conditionOfConstruction?: string | null
    qualityOfConstructionRating?: number | null,
    evaluatedAt?: Date | null
}

const EvaluationDataTable: React.FC<EvaluationDataType> = ({ areDetailsComplete, incompletePropertyDetails, typeOfLocation, locationStatus, fairValueOfProperty, fiveYearProjectionOfPrices, conditionOfConstruction, qualityOfConstructionRating, evaluatedAt }) => {

        return (
            <Fragment>
                <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto">
                    <thead >
                        <tr className="bg-gray-200 border-2 border-gray-200">
                            <th className="w-40 text-xl pt-2 pb-2">Field</th>
                            <th className="text-xl ">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-2 border-gray-300">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Type of location</td>
                            <td className=" pt-4 pb-4 text-center">{typeOfLocation}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Location status</td>
                            <td className="pt-2 pb-2 text-center">{locationStatus}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Fair value of property</td>
                            <td className="pt-2 pb-2 text-center">{fairValueOfProperty}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Five year projection of prices</td>
                            {fiveYearProjectionOfPrices && <td className="pt-7 text-center flex flex-row gap-2 items-center justify-center">
                                <p>{fiveYearProjectionOfPrices.percentageIncreaseOrDecrease}%</p>
                                {fiveYearProjectionOfPrices.decrease ? <FaArrowDown className="text-red-500 text-lg" /> : <FaArrowUp className="text-green-500 text-lg" />}
                            </td>}
                        </tr>
                        {qualityOfConstructionRating &&
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Quality of construction rating</td>
                                <td className="pt-2 pb-2 text-center">{qualityOfConstructionRating}</td>
                            </tr>}
                    </tbody>
                </table>
            </Fragment>
        )
    }
    export default EvaluationDataTable