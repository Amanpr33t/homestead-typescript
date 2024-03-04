import React, { Fragment } from "react"
import { PropertyDataType } from "../../../dataTypes/residentialPropertyTypes"
import { FaPerson } from "react-icons/fa6";
import { FaCheck, FaRupeeSign } from "react-icons/fa";
import { capitalizeFirstLetterOfAString } from "../../../utils/stringUtilityFunctions";
import ContractImagesContainer from "./ContractImagesContainer";
import EvaluationContainer from "./EvaluationContainer";
import { IoClose } from "react-icons/io5";

interface PropsType {
    property: PropertyDataType
}

//This component is used to show customer messages to property dealer
const ResidentialPropertyReview: React.FC<PropsType> = ({ property }) => {

    return (
        <Fragment>
            <div className="py-8 border-b shadow-b border-gray-300">
                <p className="text-xl font-semibold text-gray-800 mb-5">Property features</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 text-gray-700 gap-4">
                    <div className="flex flex-row gap-2">
                        {capitalizeFirstLetterOfAString(property.residentialPropertyType)}
                    </div>
                    <div className="flex flex-row gap-2">
                        <FaPerson className="text-xl mt-1" />
                        <div className="flex flex-row gap-1">
                            <p className="font-semibold">{property.numberOfOwners}</p>
                            {property.numberOfOwners > 1 ? 'owners' : 'owner'}
                        </div>
                    </div>
                    {property.residentialPropertyType === 'house' && property.typeOfSale &&
                        <div className="flex flex-row gap-2">
                            {property.typeOfSale?.floorForSale ? 'Floor for sale' : 'House for sale'}
                        </div>}

                    {property.residentialPropertyType !== 'plot' &&
                        <>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">{property.numberOfFloors}</p> floor
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">{property.numberOfLivingRooms}</p> living room
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">{property.numberOfBedrooms}</p> bedroom
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">{property.numberOfWashrooms}</p>washroom
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">{property.numberOfOfficeRooms}</p> office room
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">{property.numberOfKitchen}</p> kitchen
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">{property.numberOfCarParkingSpaces}</p> car parking space
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="font-semibold">{property.numberOfBalconies}</p> balcony
                            </div>
                        </>}

                    {property.waterSupply?.available ?
                        <div className="flex flex-row gap-2">
                            <FaCheck className="text-green-600 text-lg" /> {property.waterSupply.twentyFourHours ? '24 hours water supply' : 'Water supply'}
                        </div> :
                        <div className="flex flex-row gap-2">
                            <IoClose className="text-red-500 text-2xl" /> Water supply
                        </div>}
                    <div className="flex flex-row gap-2">
                        {property.electricityConnection ? <FaCheck className="text-green-600 text-xl mt-0.5" /> : <IoClose className="text-red-500 text-2xl" />} Electricity connection
                    </div>
                    <div className="flex flex-row gap-2">
                        {property.sewageSystem ? <FaCheck className="text-green-600 text-xl mt-0.5" /> : <IoClose className="text-red-500 text-2xl" />} Sewage system
                    </div>
                    <div className="flex flex-row gap-2">
                        {property.cableTV ? <FaCheck className="text-green-600 text-xl mt-0.5" /> : <IoClose className="text-red-500 text-2xl" />} Cable TV
                    </div>
                    <div className="flex flex-row gap-2">
                        {property.highSpeedInternet ? <FaCheck className="text-green-600 text-xl mt-0.5" /> : <IoClose className="text-red-500 text-2xl" />} High speed internet
                    </div>

                    {property.residentialPropertyType !== 'plot' &&
                        <>
                            <div className="flex flex-row gap-2">
                                {property.storeRoom ? <FaCheck className="text-green-600 text-xl mt-0.5" /> : <IoClose className="text-red-500 text-2xl" />} Store room
                            </div>
                            <div className="flex flex-row gap-2">
                                {property.servantRoom ? <FaCheck className="text-green-600 text-xl mt-0.5" /> : <IoClose className="text-red-500 text-2xl" />} Servant room
                            </div>
                            {property.furnishing?.type && <div className="flex flex-row gap-2">
                                <FaCheck className="text-green-600 text-xl mt-0.5" /> {capitalizeFirstLetterOfAString(property.furnishing?.type)} property
                            </div>}
                            {property.kitchenFurnishing?.type && <div className="flex flex-row gap-2">
                                <FaCheck className="text-green-600 text-xl mt-0.5" /> {capitalizeFirstLetterOfAString(property.kitchenFurnishing?.type)} kitchen
                            </div>}
                            {property.kitchenAppliances?.available && <div className="flex flex-row gap-2">
                                <FaCheck className="text-green-600 text-xl mt-0.5" /> Kitchen appliances
                            </div>}
                            {property.washroomFitting && <div className="flex flex-row gap-2">
                                <FaCheck className="text-green-600 text-xl mt-0.5" /> {capitalizeFirstLetterOfAString(property.washroomFitting)} washroom fitting
                            </div>}
                            {property.electricalFitting && <div className="flex flex-row gap-2">
                                <FaCheck className="text-green-600 text-xl mt-0.5" /> {capitalizeFirstLetterOfAString(property.electricalFitting)} electrical fitting
                            </div>}
                            <div className="flex flex-row gap-2">
                                {property.garden?.available ? <FaCheck className="text-green-600 text-xl mt-0.5" /> : <IoClose className="text-red-500 text-2xl" />} Garden
                            </div>
                        </>}
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
                                {property.area.totalArea?.gajj && <p>
                                    {property.area.totalArea?.gajj.toLocaleString('en-IN')} gajj
                                </p>}
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Covered area</td>
                            <td className="py-3 text-gray-600 text-center">
                                <p>
                                    {property.area.coveredArea?.metreSquare.toLocaleString('en-IN')} metre-square
                                </p>
                                {property.area.coveredArea?.gajj && <p>
                                    {property.area.coveredArea?.gajj.toLocaleString('en-IN')} gajj
                                </p>}
                            </td>
                        </tr>

                        {property.residentialPropertyType !== 'plot' && <>
                            {property.furnishing?.details && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Furnishing</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {capitalizeFirstLetterOfAString(property.furnishing.details)}
                                </td>
                            </tr>}
                            {property.kitchenFurnishing?.details && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Kitchen furnishing</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {capitalizeFirstLetterOfAString(property.kitchenFurnishing.details)}
                                </td>
                            </tr>}
                            {property.kitchenAppliances?.details && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Kitchen appliances</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {capitalizeFirstLetterOfAString(property.kitchenAppliances.details)}
                                </td>
                            </tr>}
                            {property.flooringTypeArray?.length && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Flooring</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {property.flooringTypeArray.map(floor => {
                                        return <p key={Math.random()}>{capitalizeFirstLetterOfAString(floor)}</p>
                                    })}
                                </td>
                            </tr>}
                            {property.roofTypeArray?.length && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Roof</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {property.roofTypeArray.map(type => {
                                        return <p key={Math.random()}>{capitalizeFirstLetterOfAString(type)}</p>
                                    })}
                                </td>
                            </tr>}
                            {property.wallTypeArray?.length && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Wall</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {property.wallTypeArray.map(type => {
                                        return <p key={Math.random()}>{capitalizeFirstLetterOfAString(type)}</p>
                                    })}
                                </td>
                            </tr>}
                            {property.windowTypeArray?.length && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Window</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {property.windowTypeArray.map(type => {
                                        return <p key={Math.random()}>{capitalizeFirstLetterOfAString(type)}</p>
                                    })}
                                </td>
                            </tr>}
                            {property.safetySystemArray && property.safetySystemArray?.length && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Safety system</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {property.safetySystemArray.map(type => {
                                        return <p key={Math.random()}>{capitalizeFirstLetterOfAString(type)}</p>
                                    })}
                                </td>
                            </tr>}
                            {property.garden?.details && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Garden</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {capitalizeFirstLetterOfAString(property.garden.details)}
                                </td>
                            </tr>}
                            <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Age of construction</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {property.ageOfConstruction} years
                                </td>
                            </tr>
                            {property.conditionOfProperty && <tr className="border-b shadow-b border-gray-200">
                                <td className="py-3 text-gray-800">Condition of property</td>
                                <td className="py-3 text-gray-600 text-center">
                                    {capitalizeFirstLetterOfAString(property.conditionOfProperty)}
                                </td>
                            </tr>}
                        </>}

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
                        {property.propertyTaxes && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Property taxes (per year)</td>
                            <td className="py-3 text-gray-600 text-center">
                                <div className="flex flex-row flex justify-center">
                                    <FaRupeeSign className="mt-1" />{property.propertyTaxes.toLocaleString('en-IN')}
                                </div>
                            </td>
                        </tr>}
                        {property.homeOwnersAssociationFees && <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Home owners association fees (per year)</td>
                            <td className="py-3 text-gray-600 text-center">
                                <div className="flex flex-row flex justify-center">
                                    <FaRupeeSign className="mt-1" />{property.homeOwnersAssociationFees.toLocaleString('en-IN')}
                                </div>
                            </td>
                        </tr>}
                        <tr className="">
                            <td className="py-3 text-gray-800">Area type</td>
                            <td className="py-3 text-gray-600 text-center">
                                {capitalizeFirstLetterOfAString(property.areaType)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="py-8 border-b shadow-b border-gray-300">
                <p className="text-xl font-semibold text-gray-800 mb-5">Distance of property from some nearby landmarks</p>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="bg-red-500 w-32 md:w-40"></th>
                            <th ></th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">School</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.distance.distanceFromSchool} km
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Hospital</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.distance.distanceFromHospital} km
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Exercise area</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.distance.distanceFromExerciseArea} km
                            </td>
                        </tr>
                        <tr className="border-b shadow-b border-gray-200">
                            <td className="py-3 text-gray-800">Grocery store</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.distance.distanceFromGroceryStore} km
                            </td>
                        </tr>
                        <tr className="">
                            <td className="py-3 text-gray-800">Restaurant/cafe</td>
                            <td className="py-3 text-gray-600 text-center">
                                {property.distance.distanceFromRestaurantCafe} km
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
export default ResidentialPropertyReview