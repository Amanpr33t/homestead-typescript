import React, { Fragment } from "react"
import { PropertyDataType } from "../../../dataTypes/agriculturalPropertyTypes"
import { FaPerson, FaRoad } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions";
import ContractImagesContainer from "./ContractImagesContainer";
import EvaluationContainer from "./EvaluationContainer";

interface PropsType {
    property: PropertyDataType
}

//This component is used to show customer messages to property dealer
const AgriculturalPropertyReview: React.FC<PropsType> = ({ property }) => {
    return (
        <Fragment>
            <div className="py-8 border-b shadow-b border-gray-300">
                <p className="text-xl font-semibold text-gray-800 mb-5">Property features</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 text-gray-700 gap-4">
                    <div className=" flex flex-row">
                        <p className="flex flex-row gap-2">
                            <BiArea className="mt-1 text-xl" /> {property.area.size?.toLocaleString('en-IN')}
                        </p>
                        {property.area.unit === 'metre-square' ? <div>m<sup>2</sup></div> : 'acre'}
                    </div>
                    {property.road && property.road.type && <div className="flex flex-row gap-2">
                        <FaRoad className="text-xl mt-1" />{capitalizeFirstLetterOfAString(property.road.type)}
                    </div>}
                    <div className="flex flex-row gap-2">
                        <FaPerson className="text-xl mt-1" />
                        <div className="flex flex-row gap-1">
                            <p className="font-semibold">{property.numberOfOwners}</p>
                            {property.numberOfOwners > 1 ? 'owners' : 'owner'}
                        </div>
                    </div>
                    {property.waterSource.canal && property.waterSource.canal?.length > 0 && <div className="flex flex-row gap-2">
                        <FaCheck className="text-green-500 mt-1" />Canal water
                    </div>}
                    {property.waterSource.river && property.waterSource.river?.length > 0 && <div className="flex flex-row gap-2">
                        <FaCheck className="text-green-500 mt-1" />River water
                    </div>}
                    {property.waterSource.tubewells.numberOfTubewells > 0 && <div className="flex flex-row gap-2">
                        <FaCheck className="text-green-500 mt-1" />Tubewell
                    </div>}
                    {property.reservoir.isReservoir && <div className="flex flex-row gap-2">
                        <FaCheck className="text-green-500 mt-1" />Reservoir
                    </div>}
                    {property.irrigationSystem && property.irrigationSystem?.length > 0 && property.irrigationSystem.map((type) => {
                        return <div key={Math.random()} className="flex flex-row gap-2 ">
                            <FaCheck className="text-green-500 mt-1" />{capitalizeFirstLetterOfAString(type)}
                        </div>
                    })}
                </div>
            </div>

            <div className="py-8 border-b shadow-b border-gray-300">
                <p className="text-xl font-semibold text-gray-800 mb-5">Detailed Information</p>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="bg-red-500 w-32 sm:w-44 md:w-60"></th>
                            <th ></th>
                        </tr>
                    </thead>
                    <tbody >
                        {property.road && property.road.details && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Road</td>
                            <td className="py-3 text-gray-600 text-center">{capitalizeFirstLetterOfAString(property.road.details)}</td>
                        </tr>}
                        {property.area.details && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Area</td>
                            <td className="py-3 text-gray-600 text-center">{capitalizeFirstLetterOfAString(property.area.details)}</td>
                        </tr>}
                        {property.waterSource.canal && property.waterSource.canal?.length > 0 && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Canal</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.waterSource.canal.map(canal => {
                                    return <p key={Math.random()}>{capitalizeFirstLetterOfAString(canal)}</p>
                                })}
                            </td>
                        </tr>}
                        {property.waterSource.river && property.waterSource.river?.length > 0 && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">River</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.waterSource.river.map(river => <p key={Math.random()}>{capitalizeFirstLetterOfAString(river)}</p>)}
                            </td>
                        </tr>}
                        {property.waterSource.tubewells.depth && property.waterSource.tubewells.depth.length > 0 && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Tubewells</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.waterSource.tubewells.depth.map(depth => <p key={Math.random()}>{depth} feet</p>)}
                            </td>
                        </tr>}
                        {property.reservoir.type && property.reservoir.capacityOfPrivateReservoir && property.reservoir.unitOfCapacityForPrivateReservoir && property.reservoir.type?.includes('private') && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Capacity of private reservoir</td>
                            <td className="py-3 text-gray-600 text-center">{property.reservoir.capacityOfPrivateReservoir} {property.reservoir.unitOfCapacityForPrivateReservoir}</td>
                        </tr>}
                        {property.crops && property.crops.length > 0 && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Crops grown</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.crops.map(crop => {
                                    return <p key={Math.random()}>{capitalizeFirstLetterOfAString(crop)}</p>
                                })}
                            </td>
                        </tr>}
                        {property.nearbyTown && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Nearby town</td>
                            <td className="py-3 text-gray-600 text-center">{capitalizeFirstLetterOfAString(property.nearbyTown)}</td>
                        </tr>}
                        {property.legalRestrictions.details && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Legal restrictions</td>
                            <td className="py-3 text-gray-600 text-center">{capitalizeFirstLetterOfAString(property.legalRestrictions.details)} </td>
                        </tr>}
                        {property.contractImagesUrl && property.contractImagesUrl?.length > 0 && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Contract</td>
                            <td className="py-3 text-gray-600 flex justify-center">
                                <ContractImagesContainer imagesUrl={property.contractImagesUrl} />
                            </td>
                        </tr>}
                        {property.crops && property.crops.length > 0 && <tr className="">
                            <td className="py-3 text-gray-800">Crops grown</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.crops.map(crop => {
                                    return <p key={Math.random()}>{capitalizeFirstLetterOfAString(crop)}</p>
                                })}
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>

            {property.evaluationData &&
                <EvaluationContainer evaluationData={property.evaluationData} />
            }

        </Fragment >
    )
}
export default AgriculturalPropertyReview