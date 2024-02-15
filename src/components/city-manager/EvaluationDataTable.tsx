import { Fragment } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import { EvaluationDataType } from "../../dataTypes/evaluationDataType"

const EvaluationDataTable: React.FC<EvaluationDataType> = ({ typeOfLocation, locationStatus, fairValueOfProperty, fiveYearProjectionOfPrices, conditionOfConstruction, qualityOfConstructionRating }) => {

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
                    {/*Type of location */}
                    <tr className="border-2 border-gray-300">
                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Type of location</td>
                        <td className=" pt-4 pb-4 text-center">{typeOfLocation}</td>
                    </tr>
                    {/*Location status */}
                    <tr className="border-2 border-gray-200">
                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Location status</td>
                        <td className="pt-2 pb-2 text-center">{locationStatus}</td>
                    </tr>
                    {/*fair value of property*/}
                    <tr className="border-2 border-gray-200">
                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Fair value of property</td>
                        <td className="pt-2 pb-2 text-center">{fairValueOfProperty}</td>
                    </tr>
                    {/*five year projection of prices */}
                    <tr className="border-2 border-gray-200">
                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Five year projection of prices</td>
                        {fiveYearProjectionOfPrices && <td className="pt-7 text-center flex flex-row gap-2 items-center justify-center">
                            <p>{fiveYearProjectionOfPrices.percentageIncreaseOrDecrease}%</p>
                            {fiveYearProjectionOfPrices.decrease ? <FaArrowDown className="text-red-500 text-lg" /> : <FaArrowUp className="text-green-500 text-lg" />}
                        </td>}
                    </tr>
                    {/*quality of construction rating*/}
                    {qualityOfConstructionRating &&
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Quality of construction rating</td>
                            <td className="pt-2 pb-2 text-center">{qualityOfConstructionRating}</td>
                        </tr>}
                    {/*condition of construction */}
                    {conditionOfConstruction && <tr className="border-2 border-gray-200">
                        <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Condition of construction</td>
                        <td className="pt-2 pb-2 text-center">{conditionOfConstruction}</td>
                    </tr>}
                </tbody>

            </table>
        </Fragment>
    )
}
export default EvaluationDataTable