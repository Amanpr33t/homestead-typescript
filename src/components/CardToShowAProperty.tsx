import { Fragment } from "react"
import { Link } from "react-router-dom"
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../utils/stringUtilityFunctions"
import { formatDate, getDaysDifference } from "../utils/dateFunctions"

interface PropsType {
    _id: string,
    index: number,
    propertyType: 'agricultural' | 'residential' | 'commercial',
    location: {
        name: {
            district: string,
            state: string
        }
    },
    sentToEvaluatorByFieldAgentForEvaluation?: {
        date: string
    },
    sentToEvaluatorByCityManagerForReevaluation?: {
        date: string
    },
    sentToCityManagerForApproval?: {
        date: string
    }
}

//this component is an alert modal
const CardToShowProperty: React.FC<PropsType> = ({ _id, index, propertyType, location, sentToEvaluatorByFieldAgentForEvaluation, sentToEvaluatorByCityManagerForReevaluation, sentToCityManagerForApproval }) => {
    console.log(sentToCityManagerForApproval)

    const dayDiffernceColorSetter = (days: number): string => {
        if (days < 1) {
            return 'text-green-500'
        } else if (days < 2) {
            return 'text-orange-500'
        } else {
            return 'text-red-500'
        }
    }

    return (
        <Fragment>
            <div key={_id} className="h-fit flex flex-col gap-4  place-items-center  w-full sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white rounded shadow-2xl p-3 sm:p-6">
                <div className="w-full flex flex-row gap-3 ">
                    <p className="text-gray-500 text-lg font-semibold">{index})</p>
                    <div className="flex flex-col gap-1">
                        <p className=" text-lg font-semibold">{capitaliseFirstAlphabetsOfAllWordsOfASentence(propertyType)} property</p>
                        <div className="flex flex-row gap-2">
                            <p className="text-lg font-semibold">Location:</p>
                            <p className="text-lg">{capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.district)}, {capitaliseFirstAlphabetsOfAllWordsOfASentence(location.name.state)}</p>
                        </div>
                    </div>
                </div>

                {sentToEvaluatorByFieldAgentForEvaluation && <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-2">
                        <p className="font-medium text-gray-500">Request date:</p>
                        <p>{formatDate(sentToEvaluatorByFieldAgentForEvaluation.date
                        )}</p>
                    </div>
                    <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(sentToEvaluatorByFieldAgentForEvaluation.date))}`}>
                        Received {getDaysDifference(sentToEvaluatorByFieldAgentForEvaluation.date) > 0 ? `${getDaysDifference(sentToEvaluatorByFieldAgentForEvaluation.date)} days ago` : 'today'}
                    </p>
                </div>}

                {sentToEvaluatorByCityManagerForReevaluation && <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-2">
                        <p className="font-medium text-gray-500">Request date:</p>
                        <p>{formatDate(sentToEvaluatorByCityManagerForReevaluation.date
                        )}</p>
                    </div>
                    <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(sentToEvaluatorByCityManagerForReevaluation.date))}`}>
                        Received {getDaysDifference(sentToEvaluatorByCityManagerForReevaluation.date) > 0 ? `${getDaysDifference(sentToEvaluatorByCityManagerForReevaluation.date)} days ago` : 'today'}
                    </p>
                </div>}

                {sentToCityManagerForApproval && <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-2">
                        <p className="font-medium text-gray-500">Request date:</p>
                        <p>{formatDate(sentToCityManagerForApproval.date
                        )}</p>
                    </div>
                    <p className={`text-center ${dayDiffernceColorSetter(getDaysDifference(sentToCityManagerForApproval.date))}`}>
                        Received {getDaysDifference(sentToCityManagerForApproval.date) > 0 ? `${getDaysDifference(sentToCityManagerForApproval.date)} days ago` : 'today'}
                    </p>
                </div>}

                <div className="w-full flex justify-center ">

                    {sentToEvaluatorByFieldAgentForEvaluation && <Link to={`/property-evaluator/evaluate-property?propertyType=${propertyType}&propertyId=${_id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded px-1 py-1" >Open details</Link>}

                    {sentToEvaluatorByCityManagerForReevaluation && <Link to={`/property-evaluator/reevaluate-property?propertyType=${propertyType}&propertyId=${_id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded px-1 py-1" >Open details</Link>}

                    {sentToCityManagerForApproval && <Link to={`/city-manager/approve-property?propertyType=${propertyType}&propertyId=${_id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded pb-1 pr-1 pl-1" >Open details</Link>}

                </div>
            </div>
        </Fragment>
    )
}
export default CardToShowProperty