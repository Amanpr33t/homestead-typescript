import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropertyEvaluationForm from "./PropertyEvaluationForm"

//This component is used to review the residential proeprty details
function ReviewResidentialProperty(props) {
    const navigate = useNavigate()
    const { property, hideReviewPage, residentialPropertyTypeSetter } = props

    const [showEvaluationForm, setShowEvaluationForm] = useState(false)

    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        residentialPropertyTypeSetter(property.residentialPropertyType.toLowerCase())
    }, [residentialPropertyTypeSetter, property.residentialPropertyType])

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })//scroll to the top of the screen
    }, [])

    return (
        <Fragment>

            {!showEvaluationForm &&
                <div className="w-full fixed top-16 bg-white pb-2 z-50">
                    <button type='button' className="bg-green-500  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={hideReviewPage}>Back</button>
                    <button type='button' className="bg-green-500  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={() => navigate('/property-evaluator', { replace: true })}>Home</button>
                </div>
            }

            {!showEvaluationForm && <>
                <div className="w-full mt-28 bg-white z-20 mb-4">
                    <p className="text-2xl font-bold text-center">Review residential property</p>
                </div>

                <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                    <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                        <thead >
                            <tr className="bg-gray-200 border-2 border-gray-300">
                                <th className="w-28 text-xl pt-4 pb-4 sm:w-fit">Field</th>
                                <th className="text-xl ">Data</th>
                            </tr>
                        </thead>
                        <tbody>

                            {/*unique id */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property ID</td>
                                <td className=" pt-4 pb-4 text-center">{property.uniqueId}</td>
                            </tr>

                            {/*proeprty type */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                                <td className=" pt-4 pb-4 text-center">{property.residentialPropertyType.toLowerCase()}</td>
                            </tr>

                            {/*title */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Title</td>
                                <td className=" pt-4 pb-4 pr-2 pl-2 text-center">{property.title}</td>
                            </tr>

                            {/*details */}
                            {property.details && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Details</td>
                                <td className=" pt-4 pb-4 pr-2 pl-2 text-center">{property.details}</td>
                            </tr>}

                            {/*type of sale */}
                            {property.residentialPropertyType.toLowerCase() === 'house' && property.typeOfSale && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Type of sale</td>
                                <td className=" pt-4 pb-4 text-center">{property.typeOfSale.floorForSale ? 'Floor for sale' : 'House for sale'}</td>
                            </tr>}

                            {/*price fixed*/}
                            {!property.price.range.from && !property.price.range.to && property.price.fixed && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                                <td className=" pt-4 pb-4 text-center">Rs. {property.price.fixed}</td>
                            </tr>}

                            {/*price range */}
                            {property.price.range.from && property.price.range.to && !property.price.fixed && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                                <td className=" pt-4 pb-4 text-center">Rs. {property.price.range.from} - Rs. {property.price.range.to}</td>
                            </tr>}

                            {/*water supply */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Water supply</td>
                                <td className=" pt-4 pb-4 flex flex-col place-items-center">
                                    <p>{property.waterSupply.available ? 'Yes' : 'No'}</p>
                                    {property.waterSupply.available && property.waterSupply.twentyFourHours && <p className="w-fit bg-gray-200 mr-1 ml-1 text-center">24 hours water supply is available</p>}
                                    {property.waterSupply.available && !property.waterSupply.twentyFourHours && <p className="w-fit bg-gray-200 mr-1 ml-1 text-center">24 hours water supply is not available</p>}
                                </td>
                            </tr>

                            {/*electricity connection */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Electricity connection</td>
                                <td className=" pt-4 pb-4 text-center">{property.electricityConnection ? 'Yes' : 'No'}</td>
                            </tr>

                            {/*sewage system */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Sewage system</td>
                                <td className=" pt-4 pb-4 text-center">{property.sewageSystem ? 'Yes' : 'No'}</td>
                            </tr>

                            {/*cable tv*/}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Cable TV</td>
                                <td className=" pt-4 pb-4 text-center">{property.cableTV ? 'Yes' : 'No'}</td>
                            </tr>

                            {/*high speed internet */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">High speed internet</td>
                                <td className=" pt-4 pb-4 text-center">{property.highSpeedInternet ? 'Yes' : 'No'}</td>
                            </tr>

                            {/*Distance from grocery store */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from grocery store</td>
                                <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromGroceryStore} km</td>
                            </tr>

                            {/*Distance from restaurant/cafe */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from restaurant/cafe</td>
                                <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromRestaurantCafe} km</td>
                            </tr>

                            {/* Distance from exercise area*/}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from exercise area</td>
                                <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromExerciseArea} km</td>
                            </tr>

                            {/*Distance from school */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from school</td>
                                <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromSchool} km</td>
                            </tr>

                            {/*Distance from hospital */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Distance from hospital</td>
                                <td className=" pt-4 pb-4 text-center">{property.distance.distanceFromHospital} km</td>
                            </tr>

                            {/* Area type*/}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Area type</td>
                                <td className=" pt-4 pb-4 text-center">{property.areaType}</td>
                            </tr>

                            {/*Total area */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Total area</td>
                                <td className=" pt-4 pb-4 text-center flex flex-col">
                                    <p>{property.area.totalArea.metreSquare} metre-square</p>
                                    <p>{property.area.totalArea.gajj} gajj</p>
                                </td>
                            </tr>

                            {/*Covered area */}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Covered area</td>
                                <td className=" pt-4 pb-4 text-center flex flex-col">
                                    <p>{property.area.coveredArea.metreSquare} metre-square</p>
                                    <p>{property.area.coveredArea.gajj} gajj</p>
                                </td>
                            </tr>

                            {/*Number of owners*/}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                                <td className=" pt-4 pb-4 text-center"> {property.numberOfOwners}</td>
                            </tr>

                            {/*Legal restrictions */}
                            <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {!property.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                    {property.legalRestrictions.isLegalRestrictions && <>
                                        <p>Yes</p>
                                        <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200 text-center">{property.legalRestrictions.details}</p>
                                    </>}
                                </td>
                            </tr>

                            {/*Property taxes per year */}
                            {property.propertyTaxes && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Property taxes per year</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">Rs. {property.propertyTaxes}</td>
                            </tr>}

                            {/*Home owners association fees per year */}
                            {property.homeOwnersAssociationFees && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Home owners association fees per year</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">Rs. {property.homeOwnersAssociationFees}</td>
                            </tr>}

                            {/*Number of floors */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of floors</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfFloors}</td>
                            </tr>}

                            {/*Number of living rooms */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of living rooms</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfLivingRooms}</td>
                            </tr>}

                            {/*Number of bedrooms */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of bedrooms</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfBedrooms}</td>
                            </tr>}

                            {/*Number of office rooms */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of office rooms</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfOfficeRooms}</td>
                            </tr>}

                            {/*Number of washrooms */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of washrooms</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfWashrooms}</td>
                            </tr>}

                            {/*Number of kitchens */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of kitchens</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfKitchen}</td>
                            </tr>}

                            {/* Number of car parkings*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of car parkings</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfCarParkingSpaces}</td>
                            </tr>}

                            {/* Number of balconies*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Number of balconies</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.numberOfBalconies}</td>
                            </tr>}

                            {/*Store room */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Store room</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.storeRoom ? 'Yes' : 'No'}</td>
                            </tr>}


                            {/*Servant room */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Servant room</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.servantRoom.room ? 'Yes' : 'No'}</td>
                            </tr>}

                            {/* Servant washroom*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Servant washroom</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">{property.servantRoom.washroom ? 'Yes' : 'No'}</td>
                            </tr>}

                            {/*Furnishing*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Furnishing</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {property.furnishing.type.fullyFurnished && <p>Fully furnished</p>}
                                    {property.furnishing.type.semiFurnished && <p>Semi furnished</p>}
                                    {property.furnishing.type.unfurnished && <p> Unfurnished</p>}
                                    {property.furnishing.details && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200"> {property.furnishing.details}</p>}
                                </td>
                            </tr>}

                            {/* kitchen furnishing*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Kitchen furnishing</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {property.kitchenFurnishing.type.modular && <p>Modular</p>}
                                    {property.kitchenFurnishing.type.semiFurnished && <p>Semi furnished</p>}
                                    {property.kitchenFurnishing.type.unFurnished && <p> Unfurnished</p>}
                                    {property.kitchenFurnishing.details && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200"> {property.kitchenFurnishing.details}</p>}
                                </td>
                            </tr>}

                            {/*Kitchen appliances */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Kitchen appliances</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    <p>{property.kitchenAppliances.available ? 'Yes' : 'No'}</p>
                                    {property.kitchenAppliances.available && property.kitchenAppliances.details.trim() && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.kitchenAppliances.details}</p>}
                                </td>
                            </tr>}

                            {/*Washroom fitting */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Washroom fitting</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {property.washroomFitting.standard && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Standard</p>}
                                    {property.washroomFitting.premium && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Premium</p>}
                                    {property.washroomFitting.luxurious && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Luxurious</p>}
                                </td>
                            </tr>}

                            {/*Electrical fitting */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Electrical fitting</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {property.electricalFitting.standard && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Standard</p>}
                                    {property.electricalFitting.premium && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Premium</p>}
                                    {property.electricalFitting.luxurious && <p className="pt-4 pb-4 text-center flex flex-col gap-2">Luxurious</p>}
                                </td>
                            </tr>}

                            {/*property type*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Flooring type</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {property.flooringTypeArray && property.flooringTypeArray.map(type => {
                                        return <p key={type}>{type}</p>
                                    })}
                                </td>
                            </tr>}

                            {/*roof type */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Roof type</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {property.roofTypeArray.map(type => {
                                        return <p key={type}>{type}</p>
                                    })}
                                </td>
                            </tr>}

                            {/*wall type */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Wall type</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {property.wallTypeArray.map(type => {
                                        return <p key={type}>{type}</p>
                                    })}
                                </td>
                            </tr>}

                            {/* Window type*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Window type</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        {property.windowTypeArray.map(type => {
                                            return <p key={type}>{type}</p>
                                        })}
                                    </div>
                                </td>
                            </tr>}

                            {/* safety system*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && property.safetySystemArray.length > 0 && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Safety system</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {property.safetySystemArray.map(type => {
                                        return <p key={type}>{type}</p>
                                    })}
                                </td>
                            </tr>}

                            {/* Garden*/}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Garden</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    <p>{property.garden.available ? 'Yes' : 'No'}</p>
                                    {property.garden.details.trim() && <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.garden.details.trim()}</p>}
                                </td>
                            </tr>}

                            {/*age of construction */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Age of construction</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    <p>{property.ageOfConstruction} years</p>
                                </td>
                            </tr>}

                            {/*Condition of property */}
                            {(property.residentialPropertyType.toLowerCase() === 'flat' || property.residentialPropertyType.toLowerCase() === 'house') && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Condition of property</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    <p>{property.conditionOfProperty}</p>
                                </td>
                            </tr>}

                            {/* location*/}
                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                                <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                                    {property.location.name.village && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Village:</p>
                                        <p>{property.location.name.village}</p>
                                    </div>}
                                    {property.location.name.city && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">City:</p>
                                        <p>{property.location.name.city}</p>
                                    </div>}
                                    {property.location.name.tehsil && <div className="flex flex-row gap-2">
                                        <h2 className="font-semibold">Tehsil:</h2>
                                        <p>{property.location.name.tehsil}</p>
                                    </div>}
                                    <div className=" flex flex-row gap-2">
                                        <p className="font-semibold">District:</p>
                                        <p>{property.location.name.district}</p>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold">State:</p>
                                        <p>{property.location.name.state}</p>
                                    </div>
                                </td>
                            </tr>

                            {/*Property images*/}
                            {property.residentialLandImagesUrl.length > 0 && < tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Property images</td>
                                <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                    {property.residentialLandImagesUrl.map(image => {
                                        return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={()=>window.open(image, '_blank')} />;
                                    })}
                                </td>
                            </tr>}

                            {/*Contract images*/}
                            {property.contractImagesUrl.length > 0 && <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Contract images</td>
                                <td className="pt-4 pb-4 flex justify-center flex-wrap gap-2">
                                    {property.contractImagesUrl.map(image => {
                                        return <img key={Math.random()} className='w-40 h-auto cursor-pointer' src={image} alt="" onClick={()=>window.open(image, '_blank')} />
                                    })}
                                </td>
                            </tr>}


                        </tbody>
                    </table>
                </div></>}

            {!showEvaluationForm && <div className="w-full -mt-4 mb-6 flex justify-center ">
                <button type="button" className="w-fit bg-blue-500 text-white font-medium rounded pl-2 pr-2 h-8" onClick={() => setShowEvaluationForm(true)}>Fill evaluation form</button>
            </div>}

            <div className={`${showEvaluationForm ? '' : 'fixed left-100'}`}>
                <PropertyEvaluationForm
                    hideEvaluationForm={() => setShowEvaluationForm(false)}
                    propertyType='residential'
                    residentialPropertyType={property.residentialPropertyType.toLowerCase()}
                    propertyId={property._id}
                    propertyEvaluatorId={property.propertyEvaluator}
                    fieldAgentId={property.addedByFieldAgent}
                    numberOfReevaluationsReceived={property.numberOfReevaluationsReceived} />
            </div>
        </Fragment >
    )
}
export default ReviewResidentialProperty