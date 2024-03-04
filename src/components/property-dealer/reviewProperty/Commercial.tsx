import React, { Fragment } from "react"
import { PropertyDataType } from "../../../dataTypes/commercialPropertyTypes"
import { FaPerson, FaRoad } from "react-icons/fa6";
import { capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions";
import ContractImagesContainer from "./ContractImagesContainer";
import EvaluationContainer from "./EvaluationContainer";
import { LiaIndustrySolid } from "react-icons/lia";
import { CiShop } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";

interface PropsType {
    property: PropertyDataType
}

//This component is used to show customer messages to property dealer
const CommercialPropertyReview: React.FC<PropsType> = ({ property }) => {
    
    return (
        <Fragment>
            <div className="py-8 border-b shadow-b border-gray-300">
                <p className="text-xl font-semibold text-gray-800 mb-5">Property features</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 text-gray-700 gap-4">
                    <div className="flex flex-row gap-2">
                        {property.commercialPropertyType === 'shop' ?
                            <CiShop className="text-xl text-gray-900 mt-1" /> :
                            <LiaIndustrySolid className="text-xl mt-1" />}
                        {capitalizeFirstLetterOfAString(property.commercialPropertyType)}
                    </div>
                    <div className="flex flex-row gap-2">
                        <FaPerson className="text-xl mt-1" />
                        <div className="flex flex-row gap-1">
                            <p className="font-semibold">{property.numberOfOwners}</p>
                            {property.numberOfOwners > 1 ? 'owners' : 'owner'}
                        </div>
                    </div>
                    {property.stateOfProperty && property.stateOfProperty.builtUpPropertyType && <div className="flex flex-row gap-2">
                        <FaRegBuilding className=" mt-1" />{capitalizeFirstLetterOfAString(property.stateOfProperty.builtUpPropertyType)}
                    </div>}
                    <div className="flex flex-row gap-2">
                        <p className="font-semibold">{property.floors.floorsWithoutBasement + property.floors.basementFloors}</p>
                        {property.floors.floorsWithoutBasement + property.floors.basementFloors > 1 ? 'floors' : 'floor'}
                    </div>
                    <div className="flex flex-row gap-2">
                        <FaRoad className="mt-1" />{property.widthOfRoadFacing.feet.toLocaleString('en-IN')} feet
                    </div>
                    {property.shopPropertyType && <p className="flex flex-row gap-2 ">
                        {capitalizeFirstLetterOfAString(property.shopPropertyType)}
                    </p>}
                </div>
            </div>

            <div className="py-8 border-b shadow-b border-gray-300">
                <p className="text-xl font-semibold text-gray-800 mb-5">Detailed Information</p>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="bg-red-500 w-32 md:w-40"></th>
                            <th ></th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Total area</td>
                            <td className="py-3 text-gray-600 text-center">
                                <p>
                                    {property.area.totalArea?.metreSquare.toLocaleString('en-IN')} metre-square
                                </p>
                                {property.area.totalArea?.squareFeet && <p>
                                    {property.area.totalArea?.squareFeet.toLocaleString('en-IN')} square-feet
                                </p>}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Coverred area</td>
                            <td className="py-3 text-gray-600 text-center">
                                <p>
                                    {property.area.coveredArea?.metreSquare.toLocaleString('en-IN')} metre-square
                                </p>
                                {property.area.coveredArea?.squareFeet && <p>
                                    {property.area.coveredArea?.squareFeet.toLocaleString('en-IN')} square-feet
                                </p>}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Number of floors</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.floors.floorsWithoutBasement + property.floors.basementFloors} {property.floors.floorsWithoutBasement + property.floors.basementFloors > 1 ? 'floors' : 'floor'} {property.floors.basementFloors > 0 && `(including ${property.floors.basementFloors} basement floor)`}
                            </td>
                        </tr>
                        {property.lockInPeriod && (property.lockInPeriod.years || property.lockInPeriod.months) && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Lock-in period</td>
                            <td className="py-3 text-gray-600 text-center flex flex-row justify-center gap-3">
                                {property.lockInPeriod.years && <p>{property.lockInPeriod.years} {property.lockInPeriod.years > 1 ? 'years' : 'year'}</p>}
                                {property.lockInPeriod.months && <p>{property.lockInPeriod.months} {property.lockInPeriod.months > 1 ? 'months' : 'month'}</p>}
                            </td>
                        </tr>}
                        {property.leasePeriod && (property.leasePeriod.years || property.leasePeriod.months) && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Lease period</td>
                            <td className="py-3 text-gray-600 text-center flex flex-row justify-center gap-3">
                                {property.leasePeriod.years && <p>{property.leasePeriod.years} {property.leasePeriod.years > 1 ? 'years' : 'year'}</p>}
                                {property.leasePeriod.months && <p>{property.leasePeriod.months} {property.leasePeriod.months > 1 ? 'months' : 'month'}</p>}
                            </td>
                        </tr>}
                        {property.area.details && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Legal restrictions</td>
                            <td className="py-3 text-gray-600 text-center">{capitalizeFirstLetterOfAString(property.area.details)} </td>
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
                        <tr className="">
                            <td className="py-3 text-gray-800">Width of road facing</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.widthOfRoadFacing.feet} feet / {property.widthOfRoadFacing.metre} metre
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {property.evaluationData &&
                <EvaluationContainer evaluationData={property.evaluationData} />
            }

        </Fragment >
    )
}
export default CommercialPropertyReview